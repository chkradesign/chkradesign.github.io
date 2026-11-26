const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

function setMenuOpen(isOpen) {
  if (!hamburger || !navMenu) return;
  hamburger.classList.toggle("active", isOpen);
  navMenu.classList.toggle("active", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
}

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    setMenuOpen(!hamburger.classList.contains("active"));
  });

  hamburger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setMenuOpen(!hamburger.classList.contains("active"));
    }
  });
}

document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    setMenuOpen(false);
  }),
);

const cursor = document.getElementById("custom-cursor");
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
const speed = 0.2;
let cursorVisible = false;
let mousePositionKnown = false;
const cursorLabel = cursor?.querySelector(".cursor-label");
let activeCursorLabelElement = null;
let activeHoveredCard = null;
let cursorLabelUpdateFrame = null;

function updateCursorLabelFromPointer() {
  if (!cursor || !cursorLabel || !mousePositionKnown) return;

  const elementUnderPointer = document.elementFromPoint(mouseX, mouseY);
  const labelElement =
    elementUnderPointer?.closest("[data-cursor-label]") || null;
  const hoveredCard = elementUnderPointer?.closest(".card") || null;

  if (hoveredCard !== activeHoveredCard) {
    activeHoveredCard?.classList.remove("is-pointer-hovered");
    hoveredCard?.classList.add("is-pointer-hovered");
    activeHoveredCard = hoveredCard;
  }

  if (labelElement === activeCursorLabelElement) return;

  activeCursorLabelElement = labelElement;
  cursor.classList.toggle("cursor-active", Boolean(labelElement));
  cursorLabel.textContent =
    labelElement?.getAttribute("data-cursor-label") || "";
}

function scheduleCursorLabelUpdate() {
  if (cursorLabelUpdateFrame !== null) return;

  cursorLabelUpdateFrame = requestAnimationFrame(() => {
    cursorLabelUpdateFrame = null;
    updateCursorLabelFromPointer();
  });
}

function animate() {
  if (!cursor) return;
  const distX = mouseX - cursorX;
  const distY = mouseY - cursorY;

  cursorX += distX * speed;
  cursorY += distY * speed;

  cursor.style.left = cursorX + "px";
  cursor.style.top = cursorY + "px";

  requestAnimationFrame(animate);
}

function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  mousePositionKnown = true;
  updateCursorLabelFromPointer();

  if (!cursorVisible) {
    cursor.style.visibility = "visible";
    cursorVisible = true;
    animate();
  }
}

// Mobile device check
const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

if (cursor && hasCoarsePointer) {
  // Mobile device, don't show custom cursor
  cursor.style.display = "none";
} else if (cursor) {
  // Desktop device, add mousemove listener
  document.addEventListener("mousemove", handleMouseMove);

  if (cursorLabel) {
    // Recheck the hit target after viewport or nested-container scrolling.
    window.addEventListener("scroll", scheduleCursorLabelUpdate, {
      passive: true,
    });
    document.addEventListener("scroll", scheduleCursorLabelUpdate, {
      passive: true,
      capture: true,
    });
  }
}

//intro bars animation
const overlay = document.querySelector(".overlay");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (overlay && window.gsap && !reducedMotion) {
  gsap.to(".line", 1.5, {
    delay: 0.5,
    height: 0,
    stagger: {
      amount: 0.5,
    },
    ease: "power4.inOut",
    onComplete: () => {
      // Fade out overlay after lines shrink
      gsap.to(".overlay", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          overlay.style.display = "none";
        },
      });
    },
  });
} else if (overlay) {
  overlay.style.display = "none";
}

const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  const showIfNearViewport = (el) => {
    const rect = el.getBoundingClientRect();
    const viewHeight =
      window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < viewHeight * 0.98 && rect.bottom > 0) {
      el.classList.add("is-visible");
      return true;
    }
    return false;
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -2% 0px" },
    );

    revealEls.forEach((el) => {
      if (!showIfNearViewport(el)) {
        revealObserver.observe(el);
      }
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
}

if (hasCoarsePointer) {
  const cards = document.querySelectorAll(".card");

  const setActiveMobileCard = (targetCard) => {
    cards.forEach((card) => {
      card.classList.toggle("is-mobile-active", card === targetCard);
    });
  };

  // 1. Touch / hold on a card triggers the hover animation immediately
  cards.forEach((card) => {
    card.addEventListener(
      "touchstart",
      () => {
        setActiveMobileCard(card);
      },
      { passive: true },
    );
  });

  // 2. Scrolling over a card brings it into focus in the middle band of the screen
  if ("IntersectionObserver" in window && cards.length) {
    const mobileScrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveMobileCard(entry.target);
          } else {
            entry.target.classList.remove("is-mobile-active");
          }
        });
      },
      {
        // Triggers when a card passes through the middle ~40% of the viewport
        rootMargin: "-30% 0px -30% 0px",
        threshold: 0.2,
      },
    );

    cards.forEach((card) => mobileScrollObserver.observe(card));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // --- Dynamic Splash Transition Logic ---
  const splashTriggers = document.querySelectorAll(".splash-trigger");

  splashTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      if (!trigger.href || !window.gsap || reducedMotion) return;
      // Prevent default navigation initially
      e.preventDefault();

      const targetUrl = trigger.getAttribute("href");
      // Get the color from data-bg, default to white if not set
      const targetColor = trigger.getAttribute("data-bg") || "#F2F0EF";

      // Create splash element dynamically
      const splash = document.createElement("div");
      splash.classList.add("splash-transition");
      splash.style.backgroundColor = targetColor;

      // Set position based on click
      splash.style.left = `${e.clientX}px`;
      splash.style.top = `${e.clientY}px`;

      document.body.appendChild(splash);

      // Expand the circle
      gsap.to(splash, {
        scale: 250,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          window.location.href = targetUrl;
        },
      });
    });
  });
});

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;

  document
    .querySelectorAll(".splash-transition")
    .forEach((splash) => splash.remove());
  if (window.gsap) {
    window.gsap.killTweensOf(".overlay, .line");
  }
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.display = "none";
  }
  document.querySelectorAll(".line").forEach((line) => {
    line.style.height = "";
  });
  setMenuOpen(false);
  cursor?.classList.remove("cursor-active");
  if (cursorLabel) cursorLabel.textContent = "";
  activeCursorLabelElement = null;
  scheduleCursorLabelUpdate();
});
// Keep the favicon artwork in assets/chkra.svg and tint it from this page's
// --brand-bg token. The static SVG link in each HTML head remains the fallback.
(() => {
  const favicon = document.querySelector('link[rel~="icon"]');
  if (!favicon || !window.fetch) return;

  const color = getComputedStyle(document.documentElement)
    .getPropertyValue("--brand-bg")
    .trim();
  if (!color) return;

  fetch(new URL("/assets/chkra.svg", document.baseURI))
    .then((response) => {
      if (!response.ok) throw new Error("Could not load favicon SVG");
      return response.text();
    })
    .then((svg) => {
      const tintedSvg = svg.replace(/fill="white"/i, `fill="${color}"`);
      if (tintedSvg === svg) return;

      favicon.type = "image/svg+xml";
      favicon.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(tintedSvg)}`;
    })
    .catch(() => {
      // Keep the static favicon if fetching or tinting is unavailable.
    });
})();

const header = document.querySelector(".home-header");
const intro = document.querySelector(".hero-logo");
const updateNavLogo = () => {
  if (header && intro)
    header.classList.toggle(
      "logo-visible",
      intro.getBoundingClientRect().top <=
        header.getBoundingClientRect().bottom - 50,
    );
};
window.addEventListener("scroll", updateNavLogo, { passive: true });
window.addEventListener("resize", updateNavLogo);
updateNavLogo();