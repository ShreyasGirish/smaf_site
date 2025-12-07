/* ---------------------------------------------
    SMAF WEBSITE — FINAL REFINED JS
    Mobile Menu • Scroll Reveal • Smooth Scroll
----------------------------------------------*/

// ========== MOBILE MENU TOGGLE ==========
function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.classList.toggle("show");
}

// ========== CLOSE MENU ON OUTSIDE CLICK ==========
document.addEventListener("click", function (event) {
    const menu = document.getElementById("mobileMenu");
    const hamburger = document.querySelector(".hamburger");

    // If menu is open AND click is outside both menu + hamburger
    if (menu.classList.contains("show") &&
        !menu.contains(event.target) &&
        !hamburger.contains(event.target)) 
    {
        menu.classList.remove("show");
    }
});

// ========== SMOOTH SCROLL FOR INTERNAL LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
        const targetID = this.getAttribute("href");
        if (targetID.length > 1) {
            const targetElement = document.querySelector(targetID);
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
});

// ========== SCROLL REVEAL ANIMATION ==========
(function () {
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    document
        .querySelectorAll(".reveal")
        .forEach((element) => observer.observe(element));
})();

// ========== SIMPLE CONTACT FORM HANDLER ==========
const form = document.getElementById("contactForm");
const notice = document.getElementById("contactNote");

if (form && notice) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        notice.textContent = "Thanks! Your message was received.";
        form.reset();
    });
}

/* ===========================
   STEP 2 — Sticky Header + Mobile Menu
=========================== */

// Sticky header on scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  if (window.scrollY > 30) {
    header.classList.add("scrolled-header");
  } else {
    header.classList.remove("scrolled-header");
  }
});

// Mobile menu toggle
function toggleMobileMenu() {
  const nav = document.querySelector(".mobile-nav");
  nav.classList.toggle("show");
}

window.toggleMobileMenu = toggleMobileMenu;
