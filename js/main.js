const I18N = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_team: "Team",
    nav_events: "Events",
    nav_join: "Join",
    nav_azerbaijan: "Azerbaijan"
  },
  az: {
    nav_home: "Ana səhifə",
    nav_about: "Haqqımızda",
    nav_team: "Komanda",
    nav_events: "Tədbirlər",
    nav_join: "Qoşul",
    nav_azerbaijan: "Azərbaycan"
  }
};

const LANGS = ["en", "az"];

function getLanguage() {
  try {
    const saved = localStorage.getItem("sjtuaz-lang");
    return LANGS.includes(saved) ? saved : "en";
  } catch (error) {
    return "en";
  }
}

function setLanguage(lang) {
  const active = LANGS.includes(lang) ? lang : "en";
  const dict = I18N[active] || I18N.en;

  document.documentElement.lang = active === "az" ? "az-Latn-AZ" : "en";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-en]").forEach(el => {
    const value = el.getAttribute(`data-${active}`) || el.getAttribute("data-en");
    if (value !== null) el.innerHTML = value;
  });

  document.querySelectorAll("[data-en-attr]").forEach(el => {
    const attr = el.getAttribute("data-target-attr") || "content";
    const value = el.getAttribute(`data-${active}-attr`) || el.getAttribute("data-en-attr");
    if (value !== null) el.setAttribute(attr, value);
  });

  document.querySelectorAll(".lang-btn").forEach(btn => {
    const pressed = btn.dataset.lang === active;
    btn.classList.toggle("active", pressed);
    btn.setAttribute("aria-pressed", pressed ? "true" : "false");
  });

  try {
    localStorage.setItem("sjtuaz-lang", active);
  } catch (error) {
    return;
  }
}

function initNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      hamburger.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".header-nav a, .mobile-nav a, .footer-links a").forEach(link => {
    const href = (link.getAttribute("href") || "").split("#")[0];
    link.classList.toggle("active", href === page || (page === "" && href === "index.html"));
  });
}

function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(el => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: "0px 0px -30px 0px" });

  revealEls.forEach(el => observer.observe(el));
}

function initGalleryMarquees() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-gallery-marquee]").forEach(marquee => {
    if (marquee.dataset.galleryReady === "true") return;
    marquee.dataset.galleryReady = "true";

    const viewport = marquee.querySelector("[data-gallery-viewport]");
    const track = marquee.querySelector("[data-gallery-track]");
    const prev = marquee.querySelector("[data-gallery-prev]");
    const next = marquee.querySelector("[data-gallery-next]");
    if (!viewport || !track || !track.children.length) return;

    Array.from(track.children).forEach(slide => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    let singleWidth = 0;
    let pauseUntil = 0;
    let direction = -1;
    const speed = Number(marquee.dataset.gallerySpeed || .85);

    const measure = () => {
      singleWidth = track.scrollWidth / 2;
      if (singleWidth > 0 && viewport.scrollLeft === 0) viewport.scrollLeft = singleWidth;
    };

    const wrap = () => {
      if (!singleWidth) return;
      if (viewport.scrollLeft <= 0) viewport.scrollLeft += singleWidth;
      if (viewport.scrollLeft >= singleWidth) viewport.scrollLeft -= singleWidth;
    };

    const nudge = sign => {
      measure();
      const distance = Math.min(420, Math.max(240, viewport.clientWidth * .48));
      if (sign < 0 && viewport.scrollLeft < distance) viewport.scrollLeft += singleWidth;
      if (sign > 0 && viewport.scrollLeft > singleWidth - distance) viewport.scrollLeft -= singleWidth;
      direction = sign;
      pauseUntil = performance.now() + 900;
      viewport.scrollBy({ left: sign * distance, behavior: "smooth" });
      window.setTimeout(() => {
        wrap();
        direction = -1;
      }, 950);
    };

    prev?.addEventListener("click", () => nudge(-1));
    next?.addEventListener("click", () => nudge(1));
    viewport.addEventListener("mouseenter", () => { pauseUntil = performance.now() + 700; });
    viewport.addEventListener("focusin", () => { pauseUntil = performance.now() + 700; });
    window.addEventListener("resize", measure, { passive: true });

    measure();
    if (!reduceMotion) {
      const animate = time => {
        if (time > pauseUntil) {
          viewport.scrollLeft += direction * speed;
          wrap();
        }
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initReveal();
  initGalleryMarquees();

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang || "en"));
  });

  setLanguage(getLanguage());
});
