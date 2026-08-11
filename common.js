// ===== UMUMIY SOZLAMALAR (barcha sahifalarda ishlatiladi) =====

function getSetting(key, defaultValue) {
  const val = localStorage.getItem(key);
  return val === null ? defaultValue : val === "true";
}

// ----- Tungi / kunduzgi rejim -----
function applyTheme() {
  const isLight = getSetting("theme_light", false);
  document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
}
applyTheme();

// ----- Vibratsiya -----
function triggerHaptic() {
  const vibrationOn = getSetting("vibration_on", true);
  if (vibrationOn && "vibrate" in navigator) navigator.vibrate(30);
}

// ----- Har sahifa uchun qisqa yordam matni -----
const HELP_TEXTS = {
  index: {
    title: "🔢 Binary Konvertor haqida",
    text: "Matnni ikkilik (0 va 1) kodga va aksincha o'giradi. Tepadagi tugmalar orqali yo'nalishni tanlang, matn kiriting — natija avtomatik chiqadi. \"Namuna\" tugmasi misol qo'yadi, \"Joylash\" esa clipboard'dan avtomatik yopishtiradi."
  },
  translate: {
    title: "🌐 Tarjimon haqida",
    text: "Matnni bir tildan boshqasiga tarjima qiladi. Manba va maqsad tilni tanlang, matn kiriting va \"Tarjima qilish\"ni bosing. ⇄ tugmasi tanlangan tillarni almashtiradi."
  },
  foto: {
    title: "🖼 Rasm Shifrlash haqida",
    text: "Rasmni parol bilan shifrlab, 6 xonali qisqa kodga aylantiradi. Kod va parolni saqlab qo'ying — boshqa qurilmada shu ikkovi orqali rasmni qayta tiklash mumkin. \"1 martalik\" rejimda rasm ko'rilgach avtomatik o'chib ketadi, \"Ko'p martalik\" rejimda bazada saqlanib qoladi."
  },
  settings: {
    title: "⚙️ Sozlamalar haqida",
    text: "Bu yerda ilovaning tashqi ko'rinishi va xatti-harakatini o'zgartirasiz: tungi/kunduzgi rejim va tugmalar bosilganda vibratsiya yoqiq yoki o'chiqligini tanlaysiz."
  }
};

function showHelp(pageKey) {
  const data = HELP_TEXTS[pageKey];
  const modal = document.getElementById("helpModal");
  if (!data || !modal) return;
  triggerHaptic();
  document.getElementById("helpModalTitle").innerText = data.title;
  document.getElementById("helpModalText").innerText = data.text;
  modal.classList.add("show");
}

function closeHelp() {
  const modal = document.getElementById("helpModal");
  if (modal) modal.classList.remove("show");
}

// ----- Umumiy Toast -----
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
