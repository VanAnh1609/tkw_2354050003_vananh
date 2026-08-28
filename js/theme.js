export function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  if (!toggle || !icon) return;

  function updateButton() {
    const isDark = document.documentElement.classList.contains("dark");

    icon.textContent = isDark ? "☀️" : "🌙";

    toggle.setAttribute(
      "aria-label",
      isDark ? "Bật chế độ sáng" : "Bật chế độ tối",
    );
  }

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateButton();
  });

  updateButton();
}
