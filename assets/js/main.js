/* ============================================================
   LumiChrom — comportamente comune
   Tema, meniu mobil, progres la derulare, animații de apariție,
   contoare, parallax discret și tranziții între pagini.
   ============================================================ */

(function () {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Anul curent în footer ---------- */
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* ---------- Tema lumină / întuneric ---------- */
  const themeToggle = document.querySelector(".theme-toggle");

  function setTheme(theme, persist) {
    root.dataset.theme = theme;

    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Comută la modul luminos" : "Comută la modul întunecat"
      );
    }

    if (persist) {
      try {
        localStorage.setItem("lumichrom-theme", theme);
      } catch (error) {
        /* Tema funcționează și fără memorare. */
      }
    }
  }

  setTheme(root.dataset.theme === "dark" ? "dark" : "light", false);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme, true);
    });
  }

  /* ---------- Meniu mobil ---------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navScrim = document.createElement("div");
  navScrim.className = "nav-scrim";
  document.body.appendChild(navScrim);

  function closeMenu() {
    body.classList.remove("menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Deschide meniul");
    }
  }

  function openMenu() {
    body.classList.add("menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Închide meniul");
    }
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      if (body.classList.contains("menu-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navScrim.addEventListener("click", closeMenu);

    mainNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!body.classList.contains("menu-open")) return;
      if (!event.target.closest(".site-header")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && body.classList.contains("menu-open")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1180) {
        closeMenu();
      }
    });
  }

  /* ---------- Evidențierea paginii curente ---------- */
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".main-nav a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("is-active");
    } else {
      link.classList.remove("is-active");
    }
  });

  /* ---------- Bară de progres + parallax ---------- */
  const progressBar = document.querySelector(".scroll-progress");
  const header = document.querySelector(".site-header");
  const parallaxElements = Array.from(document.querySelectorAll("[data-parallax]"));
  let scrollQueued = false;

  function updateScrollEffects() {
    scrollQueued = false;
    const scrollTop = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    if (header) {
      header.classList.toggle("is-scrolled", scrollTop > 12);
    }

    if (!reduceMotion) {
      /* Formele decorative se mișcă puțin mai încet decât pagina. */
      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.dataset.parallax) || 0.08;
        const shift = scrollTop * speed;
        element.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      });
    }
  }

  function queueScrollUpdate() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateScrollEffects);
  }

  window.addEventListener("scroll", queueScrollUpdate, { passive: true });
  window.addEventListener("resize", queueScrollUpdate);
  updateScrollEffects();

  /* ---------- Apariția elementelor la derulare ---------- */
  const revealElements = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-revealed"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* ---------- Numere care cresc animat ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const numberFormatter = (decimals) =>
    new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

  function animateCounter(element) {
    const target = parseFloat(element.dataset.count);
    if (Number.isNaN(target)) return;

    const decimals = parseInt(element.dataset.decimals || "0", 10);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";
    const duration = parseInt(element.dataset.duration || "1500", 10);
    const formatter = numberFormatter(decimals);

    if (reduceMotion) {
      element.textContent = `${prefix}${formatter.format(target)}${suffix}`;
      return;
    }

    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      element.textContent = `${prefix}${formatter.format(value)}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        element.textContent = `${prefix}${formatter.format(target)}${suffix}`;
      }
    }

    window.requestAnimationFrame(tick);
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    counters.forEach((counter) => animateCounter(counter));
  } else {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* ---------- Tranziție lină între pagini ---------- */
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }

    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname && destination.hash) return;

    if (reduceMotion) return;

    event.preventDefault();
    body.classList.add("page-leaving");

    window.setTimeout(() => {
      window.location.href = destination.href;
    }, 220);
  });

  window.addEventListener("pageshow", () => {
    body.classList.remove("page-leaving");
  });
})();
