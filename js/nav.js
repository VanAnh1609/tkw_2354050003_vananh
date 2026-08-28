export function initNav() {
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");

  if (!header || !toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("hidden", !open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    document.body.classList.toggle("overflow-hidden", open);
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;

    setOpen(false);
    toggle.focus();
  });

  document.addEventListener("click", (event) => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;

    if (header.contains(event.target)) return;

    setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      setOpen(false);
    }
  });

  menu.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    setOpen(false);
  });
}

export function initHeaderOnScroll() {
  const header = document.getElementById("site-header");
  const sentinel = document.getElementById("nav-sentinel");

  if (!header || !sentinel) return;

  const observer = new IntersectionObserver(([entry]) => {
    const scrolled = !entry.isIntersecting;

    header.classList.toggle("shadow-sm", scrolled);
  });

  observer.observe(sentinel);
}

export function initToTop() {
  const button = document.getElementById("to-top");

  if (!button) return;

  function updateVisibility() {
    button.classList.toggle("hidden", window.scrollY <= 400);
  }

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", updateVisibility);

  updateVisibility();
}
