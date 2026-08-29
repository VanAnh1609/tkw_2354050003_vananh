export function initSlider() {
  const root = document.getElementById("testimonial-slider");

  if (!root) return;

  const track = root.querySelector("[data-slider-track]");
  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const prev = root.querySelector("[data-slider-prev]");
  const next = root.querySelector("[data-slider-next]");
  const dotsRoot = root.querySelector("[data-slider-dots]");

  if (!track || !slides.length || !prev || !next || !dotsRoot) {
    return;
  }

  let index = 0;
  let timer = null;

  const dots = slides.map((_, slideIndex) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.setAttribute("aria-label", `Đi đến cảm nhận ${slideIndex + 1}`);

    dot.className = "h-2.5 w-2.5 rounded-full bg-line transition-colors";

    dot.addEventListener("click", () => {
      go(slideIndex);
      start();
    });

    dotsRoot.appendChild(dot);

    return dot;
  });

  function updateDots() {
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("bg-brand-500", dotIndex === index);

      dot.classList.toggle("bg-line", dotIndex !== index);

      if (dotIndex === index) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  function go(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;

    track.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      slide.toggleAttribute("inert", slideIndex !== index);
    });

    updateDots();
  }

  function stop() {
    if (!timer) return;

    clearInterval(timer);
    timer = null;
  }

  function start() {
    stop();

    timer = setInterval(() => {
      go(index + 1);
    }, 5000);
  }

  prev.addEventListener("click", () => {
    go(index - 1);
    start();
  });

  next.addEventListener("click", () => {
    go(index + 1);
    start();
  });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  go(0);
  start();
}
