function swapLanguages() {
  triggerHaptic();
  const source = document.getElementById("sourceLang");
  const target = document.getElementById("targetLang");
  const temp = source.value;
  source.value = target.value;
  target.value = temp;
}

async function translateText() {
  triggerHaptic();
  const input = document.getElementById("trInput").value.trim();
  const output = document.getElementById("trOutput");
  const source = document.getElementById("sourceLang").value;
  const target = document.getElementById("targetLang").value;

  if (!input) return output.value = "";
  output.value = "Tarjima qilinmoqda...";

  try {
    // Google Translate ochiq va bepul API
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(input)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data && data[0]) {
      output.value = data[0].map(item => item[0]).join("");
    } else {
      output.value = "Tarjima topilmadi.";
    }
  } catch (e) {
    output.value = "Xatolik yuz berdi. Internetni tekshiring.";
  }
}

function copyTranslate() {
  triggerHaptic();
  const trOutput = document.getElementById("trOutput");
  if (trOutput.value) {
    navigator.clipboard.writeText(trOutput.value);
    showToast("Nusxalandi!");
  }
}