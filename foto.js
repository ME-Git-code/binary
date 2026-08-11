// 1. Firebase Sozlamalari (https://console.firebase.google.com saytidan bepul olinadi)
// Haqiqiy kalitlar endi shu faylda emas — firebase-config.js faylida saqlanadi
// (u .gitignore orqali repo'dan chetlab o'tiladi). Qarang: firebase-config.example.js

if (!window.FIREBASE_CONFIG) {
  throw new Error(
    "firebase-config.js topilmadi! firebase-config.example.js faylidan nusxa oling " +
    "va nomini firebase-config.js ga o'zgartirib, o'z Firebase kalitlaringizni kiriting."
  );
}
const firebaseConfig = window.FIREBASE_CONFIG;

// Firebase-ni ishga tushirish
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function switchCrypto(type) {
  triggerHaptic();
  document.getElementById("encBox").style.display = type === "encode" ? "block" : "none";
  document.getElementById("decBox").style.display = type === "decode" ? "block" : "none";
  document.getElementById("encTab").classList.toggle("active", type === "encode");
  document.getElementById("decTab").classList.toggle("active", type === "decode");
}

// ----- Galereya / Kamera orqali rasm tanlash -----
let selectedImageFile = null;

document.addEventListener("DOMContentLoaded", () => {
  const galleryInput = document.getElementById("imgInputGallery");
  const cameraInput = document.getElementById("imgInputCamera");
  if (galleryInput) galleryInput.addEventListener("change", (e) => onImageSelected(e.target.files[0]));
  if (cameraInput) cameraInput.addEventListener("change", (e) => onImageSelected(e.target.files[0]));
});

function onImageSelected(file) {
  if (!file) return;
  selectedImageFile = file;
  const preview = document.getElementById("imgPreview");
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.innerHTML = `<img src="${e.target.result}" alt="Tanlangan rasm" />`;
  };
  reader.readAsDataURL(file);
}

// Random 6 xonali kalta kod yaratish (Masalan: A7X9K2)
function generateShortCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Bazada band bo'lmagan, takrorlanmas kod topish
async function generateUniqueShortCode() {
  const MAX_ATTEMPTS = 5;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const code = generateShortCode();
    const doc = await db.collection("photos").doc(code).get();
    if (!doc.exists) return code;
  }
  throw new Error("Bo'sh kod topilmadi, qaytadan urinib ko'ring.");
}

// Firestore hujjat hajmi limiti (~1MB). Xavfsizlik chegarasi sifatida 900KB olamiz.
const MAX_ENCRYPTED_SIZE = 900 * 1024;

// SHIFRLASH VA BAZAGA SAQLASH
async function encryptAndUpload() {
  const pass = document.getElementById("encPass").value;
  const deleteMode = document.getElementById("deleteMode").value; // Rejimni olish ('once' yoki 'keep')
  const resultBox = document.getElementById("shortCodeResult");
  const encryptBtn = document.getElementById("encryptBtn");

  if (!selectedImageFile || !pass) return alert("Rasm va parolni kiriting!");

  triggerHaptic();
  encryptBtn.disabled = true;
  resultBox.value = "Shifrlanmoqda...";

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = async function () {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxDim = 800;
        let width = img.width, height = img.height;

        if (width > height && width > maxDim) { height *= maxDim / width; width = maxDim; }
        else if (height > maxDim) { width *= maxDim / height; height = maxDim; }

        canvas.width = width; canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
        const encryptedData = CryptoJS.AES.encrypt(compressedBase64, pass).toString();

        // Hujjat hali ham juda katta bo'lsa, foydalanuvchini ogohlantiramiz
        if (encryptedData.length > MAX_ENCRYPTED_SIZE) {
          alert("Rasm hali ham juda katta, iltimos kichikroq yoki sifati pastroq rasm tanlang.");
          resultBox.value = "";
          encryptBtn.disabled = false;
          return;
        }

        resultBox.value = "Kod tekshirilmoqda...";
        const shortCode = await generateUniqueShortCode();

        // Firebase Firestore-ga rejim bilan saqlash
        await db.collection("photos").doc(shortCode).set({
          data: encryptedData,
          mode: deleteMode,
          createdAt: new Date()
        });

        resultBox.value = shortCode;
        showToast("Kod yaratildi!");
      } catch (err) {
        alert("Bazaga saqlashda xatolik! " + (err && err.message ? err.message : ""));
        resultBox.value = "";
      } finally {
        encryptBtn.disabled = false;
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(selectedImageFile);
}

// BAZADAN OLIB RASSHIFRLASH
function fetchAndDecrypt() {
  const code = document.getElementById("decCodeInput").value.trim().toUpperCase();
  const pass = document.getElementById("decPass").value;
  const previewBox = document.getElementById("imgPreviewBox");
  const decryptBtn = document.getElementById("decryptBtn");

  if (!code || !pass) return alert("Kod va parolni kiriting!");

  triggerHaptic();
  decryptBtn.disabled = true;
  previewBox.innerHTML = "<p style='color:var(--text-secondary);'>Rasm qidirilmoqda...</p>";

  db.collection("photos").doc(code).get().then((doc) => {
    if (!doc.exists) {
      previewBox.innerHTML = "";
      return alert("Bunday kodli rasm topilmadi yoki u allaqachon o'chirilgan!");
    }

    const docData = doc.data();
    const encryptedData = docData.data;
    const mode = docData.mode || "keep";

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, pass);
      const originalBase64 = bytes.toString(CryptoJS.enc.Utf8);

      if (!originalBase64.startsWith("data:image")) {
        previewBox.innerHTML = "";
        return alert("Xato parol!");
      }

      // 1 martalik rejim bo'lsa, avtomatik o'chirish
      if (mode === "once") {
        db.collection("photos").doc(code).delete();
      }

      const badge = mode === "once"
        ? "<p class='result-note is-danger'>🔥 Ushbu rasm 1 martalik edi va bazadan o'chirildi!</p>"
        : "<p class='result-note is-success'>♾ Ushbu rasm ko'p martalik va bazada saqlanadi.</p>";

      previewBox.innerHTML = `
        ${badge}
        <img src="${originalBase64}" class="decoded-img" />
        <br/>
        <a href="${originalBase64}" download="restored-image.jpg" class="btn btn-primary" style="display:inline-block; text-decoration:none;">📥 Yuklab olish</a>
      `;
      showToast("Rasm tiklandi!");
    } catch (e) {
      previewBox.innerHTML = "";
      alert("Parol xato bo'lishi mumkin!");
    }
  }).catch(() => {
    previewBox.innerHTML = "";
    alert("Server bilan bog'lanishda xatolik!");
  }).finally(() => {
    decryptBtn.disabled = false;
  });
}

function copyCode() {
  triggerHaptic();
  const res = document.getElementById("shortCodeResult");
  if (res.value && res.value !== "Shifrlanmoqda...") {
    navigator.clipboard.writeText(res.value);
    showToast("Kod nusxalandi!");
  }
}