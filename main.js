(function () {
  "use strict";

  let currentLang = localStorage.getItem("forest-lang") || "fr";

  function getNested(obj, key) {
    return key.split(".").reduce(function (o, k) {
      return o && o[k];
    }, obj);
  }

  function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      const value = getNested(t, key);
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = getNested(t, key);
      if (value !== undefined) {
        el.placeholder = value;
      }
    });

    document.documentElement.lang = lang;
    currentLang = lang;
    localStorage.setItem("forest-lang", lang);

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  function initLangSwitcher() {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTranslations(btn.dataset.lang);
      });
    });
    applyTranslations(currentLang);
  }

  function initMobileNav() {
    const toggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (!toggle || !navLinks) return;

    toggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
      });
    });
  }

  function initHeaderScroll() {
    const header = document.querySelector(".header");
    if (!header) return;

    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  function initActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;

    document.querySelectorAll(".nav-links a").forEach(function (link) {
      if (link.dataset.page === page) {
        link.classList.add("active");
      }
    });
  }

  function initMenuTabs() {
    const tabs = document.querySelectorAll(".menu-tab");
    const categories = document.querySelectorAll(".menu-category");
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const target = tab.dataset.tab;

        tabs.forEach(function (t) {
          t.classList.toggle("active", t === tab);
        });

        categories.forEach(function (cat) {
          cat.classList.toggle("active", cat.dataset.category === target);
        });
      });
    });
  }

  function initReservationForm() {
    const form = document.getElementById("reservation-form");
    if (!form) return;

    const dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.min = today;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const success = document.getElementById("form-success");
      if (success) {
        success.classList.add("show");
        form.reset();
        success.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  function initGallery() {
    const items = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");

    if (!items.length || !lightbox) return;

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        const img = item.querySelector("img");
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add("open");
          document.body.style.overflow = "hidden";
        }
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitcher();
    initMobileNav();
    initHeaderScroll();
    initActiveNav();
    initMenuTabs();
    initReservationForm();
    initGallery();
  });
})();
