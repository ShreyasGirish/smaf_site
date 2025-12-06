/* assets/js/main.js
   Small client router for smooth page transitions + helpers
*/

(function () {
  // helpers
  const fetchPage = async (url) => {
    const res = await fetch(url, {cache: "no-store"});
    if (!res.ok) throw new Error("Network response not ok");
    return res.text();
  };

  // replace main content with fade transitions
  async function navigateTo(url, addToHistory = true) {
    try {
      const main = document.getElementById("main-content");
      if (!main) { location.href = url; return; }

      // start leave transition
      main.classList.add("page-fade-leave");
      main.classList.add("page-fade-leave-active");

      // wait for transition
      await new Promise(r => setTimeout(r, 260));

      const html = await fetchPage(url);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const newMain = doc.getElementById("main-content");

      if (!newMain) {
        location.href = url;
        return;
      }

      // swap
      main.innerHTML = newMain.innerHTML;
      // update title
      const newTitle = doc.querySelector("title");
      if (newTitle) document.title = newTitle.textContent;

      // run entrance animations
      main.classList.remove("page-fade-leave", "page-fade-leave-active");
      main.classList.add("page-fade-enter", "page-fade-enter-active");
      requestAnimationFrame(()=> {
        main.classList.remove("page-fade-enter");
      });

      // update focus
      main.setAttribute("tabindex", "-1");
      main.focus();

      // observe reveals and gallery wiring
      wireReveals();
      wireGallery();
      if (addToHistory) history.pushState({path: url}, "", url);
    } catch (err) {
      console.error("Navigation failed", err);
      location.href = url; // fallback
    }
  }

  // intercept internal link clicks
  function interceptLinks() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      // ignore external, anchors, mailto, tel
      if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;
      // only intercept same origin relative links
      e.preventDefault();
      navigateTo(href, true);
    });
  }

  // reveal on scroll
  const wireReveals = () => {
    const reveals = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          io.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    reveals.forEach(r => io.observe(r));
  };

  // gallery lightbox
  function wireGallery() {
    const gallery = document.querySelectorAll(".gallery img");
    const lightbox = document.querySelector(".lightbox");
    const lbImg = lightbox ? lightbox.querySelector("img") : null;
    if (!gallery || !lightbox || !lbImg) return;
    gallery.forEach(img => {
      img.removeEventListener("click", img._lbClick);
      const handler = () => {
        lbImg.src = img.src;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      };
      img.addEventListener("click", handler);
      img._lbClick = handler;
    });
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target === lbImg) {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        lbImg.src = "";
      }
    });
    window.addEventListener("keydown", (ev) => { if (ev.key === "Escape") { lightbox.classList.remove("open"); lightbox.setAttribute("aria-hidden", "true"); }});
  }

  // initial wiring
  document.addEventListener("DOMContentLoaded", () => {
    interceptLinks();
    wireReveals();
    wireGallery();

    // handle back/forward
    window.addEventListener("popstate", (e) => {
      if (e.state && e.state.path) navigateTo(location.pathname, false);
    });
  });

})();
