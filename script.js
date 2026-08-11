let currentMode = "textToBinary";

// Vibratsiya (Haptic feedback)
function triggerHaptic() {
  if ("vibrate" in navigator) navigator.vibrate(30);
}

// Matrix Animatsiyasi
let matrixInterval = null;
function animateMatrix(targetInput, targetText) {
  clearInterval(matrixInterval);
  const chars = "0101010101ABCDEFXYZ$#@%";
  let iteration = 0;

  matrixInterval = setInterval(() => {
    targetInput.value = targetText
      .split("")
      .map((char, index) => {
        if (index < iteration) return targetText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");

    if (iteration >= targetText.length) clearInterval(matrixInterval);
    iteration += 1 / 2;
  }, 25);
}

function switchMode(mode) {
  triggerHaptic();
  currentMode = mode;
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => tab.classList.remove("active"));

  const inputLabel = document.getElementById("inputLabel");
  const outputLabel = document.getElementById("outputLabel");
  const inputText = document.getElementById("inputText");

  if (mode === "textToBinary") {
    tabs[0].classList.add("active");
    inputLabel.innerText = "Matnni kiriting:";
    outputLabel.innerText = "Binary natija:";
    inputText.placeholder = "Bu yerga matn kiriting...";
  } else {
    tabs[1].classList.add("active");
    inputLabel.innerText = "Binary kodni kiriting:";
    outputLabel.innerText = "Matn natijasi:";
    inputText.placeholder =
      "Masalan: 01010011 01000001 01001101 01001111 01001101";
  }
  clearFields();
}

function convert() {
  const input = document.getElementById("inputText").value;
  const output = document.getElementById("outputText");
  const errorMsg = document.getElementById("errorMessage");

  errorMsg.style.display = "none";

  // Matn bo'shatilganda animatsiyani darhol to'xtatish
  if (!input.trim()) {
    clearInterval(matrixInterval);
    output.value = "";
    return;
  }

  if (currentMode === "textToBinary") {
    const binaryResult = Array.from(input)
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");
    animateMatrix(output, binaryResult);
  } else {
    clearInterval(matrixInterval);
    const cleanedInput = input.trim();
    const binaryArray = cleanedInput.split(/\s+/);
    let textResult = "";
    let isValid = true;

    for (let bin of binaryArray) {
      if (bin === "") continue;
      if (!/^[01]+$/.test(bin)) {
        isValid = false;
        break;
      }
      textResult += String.fromCharCode(parseInt(bin, 2));
    }

    if (isValid) {
      output.value = textResult;
    } else {
      errorMsg.style.display = "block";
      output.value = "";
    }
  }
}

function copyOutput() {
  triggerHaptic();
  const outputText = document.getElementById("outputText");
  if (!outputText.value) return;

  navigator.clipboard.writeText(outputText.value).then(() => {
    showToast("Nusxalandi!");
  });
}

function clearFields() {
  triggerHaptic();
  clearInterval(matrixInterval);
  document.getElementById("inputText").value = "";
  document.getElementById("outputText").value = "";
  document.getElementById("errorMessage").style.display = "none";
}

function insertSample() {
  triggerHaptic();
  const inputText = document.getElementById("inputText");
  if (currentMode === "textToBinary") {
    inputText.value = "Salom, Dunyo!";
  } else {
    inputText.value = "01010011 01000001 01001101 01001111 01001101";
  }
  convert();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// Auto-Paste (Vaqtinchalik xotiradan olish)
async function autoPaste() {
  triggerHaptic();
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("inputText").value = text;
    convert();
    showToast("Xotiradan joylandi!");
  } catch (err) {
    showToast("Ruxsat berilmadi!");
  }
}

// Tarjimon Modal Mantig'i
function openTranslator() {
  triggerHaptic();
  document.getElementById("translatorModal").classList.add("active");
}

function closeTranslator() {
  triggerHaptic();
  document.getElementById("translatorModal").classList.remove("active");
}

function swapLanguages() {
  triggerHaptic();
  const source = document.getElementById("sourceLang");
  const target = document.getElementById("targetLang");
  const temp = source.value;
  source.value = target.value;
  target.value = temp;
}

const dictionary = {
  "uz-tr": {
    salom: "Merhaba",
    qalaysiz: "Nasılsınız",
    yaxshiman: "İyiyim",
    rahmat: "Teşekkür ederim",
  },
  "tr-uz": {
    merhaba: "Salom",
    nasılsınız: "Qalaysiz",
    iyiyim: "Yaxshiman",
    "teşekkür ederim": "Rahmat",
  },
  "uz-en": {
    salom: "Hello",
    qalaysiz: "How are you",
    yaxshiman: "I am fine",
    rahmat: "Thank you",
  },
  "en-uz": {
    hello: "Salom",
    "how are you": "Qalaysiz",
    "i am fine": "Yaxshiman",
    "thank you": "Rahmat",
  },
  "uz-ru": {
    salom: "Привет",
    qalaysiz: "Как дела",
    yaxshiman: "Я в порядке",
    rahmat: "Спасибо",
  },
  "ru-uz": {
    привет: "Salom",
    "как дела": "Как дела",
    "я в порядке": "Yaxshiman",
    спасибо: "Rahmat",
  },
};

async function translateText() {
  const input = document.getElementById("trInput").value.trim();
  const output = document.getElementById("trOutput");
  const source = document.getElementById("sourceLang").value;
  const target = document.getElementById("targetLang").value;

  if (!input) {
    output.value = "";
    return;
  }

  if (source === target) {
    output.value = input;
    return;
  }

  output.value = "Tarjima qilinmoqda...";

  const dictKey = `${source}-${target}`;
  const lowerInput = input.toLowerCase();

  if (dictionary[dictKey] && dictionary[dictKey][lowerInput]) {
    output.value = dictionary[dictKey][lowerInput];
    return;
  }

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=${source}|${target}`
    );
    const data = await res.json();
    if (data && data.responseData) {
      output.value = data.responseData.translatedText;
    } else {
      output.value = "Tarjima topilmadi.";
    }
  } catch (error) {
    output.value = "Xatolik yuz berdi. Internetni tekshiring.";
  }
}

function copyTranslate() {
  triggerHaptic();
  const trOutput = document.getElementById("trOutput");
  if (!trOutput.value) return;

  navigator.clipboard.writeText(trOutput.value).then(() => {
    showToast("Tarjima nusxalandi!");
  });
}