export function initPricing() {
  const root = document.getElementById("pricing");
  const toggle = document.getElementById("pricing-toggle");

  if (!root || !toggle) return;

  const prices = root.querySelectorAll("[data-price]");
  const thumb = toggle.querySelector("[data-switch-thumb]");

  const dong = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  function updatePrices(yearly) {
    prices.forEach((price) => {
      const value = yearly ? price.dataset.yearly : price.dataset.monthly;

      price.textContent = dong.format(Number(value));
    });

    toggle.setAttribute("aria-checked", String(yearly));

    toggle.setAttribute(
      "aria-label",
      yearly ? "Chuyển sang giá theo tháng" : "Chuyển sang giá theo năm",
    );

    if (thumb) {
      thumb.classList.toggle("translate-x-7", yearly);
    }
  }

  toggle.addEventListener("click", () => {
    const yearly = toggle.getAttribute("aria-checked") !== "true";

    updatePrices(yearly);
  });

  updatePrices(false);
}
