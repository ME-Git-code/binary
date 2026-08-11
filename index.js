let currentMode = "textToBinary";

function switchMode(mode) {
  triggerHaptic();
  currentMode = mode;
  document.getElementById("btnText").classList.toggle("active", mode === "textToBinary");
  document.getElementById("btnBin").classList.toggle("active", mode === "binaryToText");

  document.getElementById("inputLabel").innerText = mode === "textToBinary" ? "Matnni kiriting:" : "Binary kodni kiriting:";
  document.getElementById("outputLabel").innerText = mode === "textToBinary" ? "Binary natija:" : "Matn natijasi:";
  clearFields();
}

function convert() {
  const input = document.getElementById("inputText").value;
  const output = document.getElementById("outputText");
  const errorMsg = document.getElementById("errorMessage");

  errorMsg.style.display = "none";
  if (!input.trim()) return output.value = "";

  if (currentMode === "textToBinary") {
    output.value = Array.from(input).map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
  } else {
    const cleaned = input.trim().split(/\s+/);
    let result = "", isValid = true;
    for (let bin of cleaned) {
      if (!bin) continue;
      if (!/^[01]+$/.test(bin)) { isValid = false; break; }
      result += String.fromCharCode(parseInt(bin, 2));
    }
    if (isValid) output.value = result;
    else { errorMsg.style.display = "block"; output.value = ""; }
  }
}

function copyOutput() {
  triggerHaptic();
  const outputText = document.getElementById("outputText");
  if (outputText.value) {
    navigator.clipboard.writeText(outputText.value);
    showToast("Nusxalandi!");
  }
}

function clearFields() {
  triggerHaptic();
  document.getElementById("inputText").value = "";
  document.getElementById("outputText").value = "";
  document.getElementById("errorMessage").style.display = "none";
}

function insertSample() {
  triggerHaptic();
  document.getElementById("inputText").value = currentMode === "textToBinary" ? "Salom, Dunyo!" : "01010011 01000001 01001101";
  convert();
}

async function autoPaste() {
  triggerHaptic();
  try {
    document.getElementById("inputText").value = await navigator.clipboard.readText();
    convert();
    showToast("Joylandi!");
  } catch (e) { showToast("Ruxsat berilmadi!"); }
}