export function initFaq() {
  const root = document.getElementById("faq");

  if (!root) return;

  const triggers = root.querySelectorAll("[data-faq-trigger]");

  function setOpen(trigger, open) {
    const panelId = trigger.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);
    const icon = trigger.querySelector("[aria-hidden='true']");

    if (!panel) return;

    trigger.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("hidden", !open);

    if (icon) {
      icon.textContent = open ? "−" : "+";
    }
  }

  root.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-faq-trigger]");

    if (!trigger) return;

    const willOpen = trigger.getAttribute("aria-expanded") !== "true";

    triggers.forEach((item) => {
      setOpen(item, false);
    });

    if (willOpen) {
      setOpen(trigger, true);
    }
  });
}
