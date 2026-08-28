export function initPromo() {
  const code = document.getElementById("promo-code");
  const button = document.getElementById("copy-promo");
  const status = document.getElementById("copy-status");

  if (!code || !button || !status) return;

  button.addEventListener("click", async () => {
    const value = code.textContent.trim();

    try {
      await navigator.clipboard.writeText(value);

      button.textContent = "Đã sao chép";
      status.textContent = `Đã sao chép mã ${value}.`;

      setTimeout(() => {
        button.textContent = "Sao chép mã";
        status.textContent = "";
      }, 2000);
    } catch {
      status.textContent = "Không thể sao chép mã. Vui lòng thử lại.";
    }
  });
}
