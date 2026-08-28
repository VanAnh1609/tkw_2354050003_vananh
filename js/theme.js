export function initTheme() {
  const button = document.getElementById("theme-toggle");

  if (!button) return;

  button.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}
