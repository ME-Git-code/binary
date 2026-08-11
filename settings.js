document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const vibrationToggle = document.getElementById("vibrationToggle");

  const isLight = getSetting("theme_light", false);
  themeToggle.checked = !isLight; // belgilangan = tungi rejim yoqiq

  vibrationToggle.checked = getSetting("vibration_on", true);
});

function onThemeToggle() {
  const darkMode = document.getElementById("themeToggle").checked;
  localStorage.setItem("theme_light", (!darkMode).toString());
  applyTheme();
  triggerHaptic();
  showToast(darkMode ? "Tungi rejim yoqildi" : "Kunduzgi rejim yoqildi");
}

function onVibrationToggle() {
  const on = document.getElementById("vibrationToggle").checked;
  localStorage.setItem("vibration_on", on.toString());
  if (on) triggerHaptic();
  showToast(on ? "Vibratsiya yoqildi" : "Vibratsiya o'chirildi");
}
