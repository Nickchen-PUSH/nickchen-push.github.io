const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((node) => {
    revealObserver.observe(node);
  });
} else {
  document.querySelectorAll(".reveal").forEach((node) => {
    node.classList.add("is-visible");
  });
}

const parallaxImage = document.querySelector("[data-parallax]");

if (parallaxImage && !prefersReducedMotion) {
  let ticking = false;

  const updateParallax = () => {
    const offset = Math.min(window.scrollY * 0.08, 52);
    parallaxImage.style.transform = `scale(1.04) translateY(${offset}px)`;
    ticking = false;
  };

  const requestParallax = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestParallax, { passive: true });
  requestParallax();
}

(() => {
  const postLinks = Array.from(document.querySelectorAll(".cv-post[data-post-modal]"));

  if (!postLinks.length) {
    return;
  }

  const focusableSelector = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "iframe",
    "object",
    "embed",
    "[contenteditable]",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  const modal = document.createElement("div");
  modal.className = "cv-post-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="cv-post-modal__panel" role="dialog" aria-modal="true" tabindex="-1">
      <button class="cv-post-modal__close" type="button" aria-label="Close article">
        <span aria-hidden="true"></span>
      </button>
      <div class="cv-post-modal__body"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const site = document.querySelector(".cv-site");
  const panel = modal.querySelector(".cv-post-modal__panel");
  const body = modal.querySelector(".cv-post-modal__body");
  const closeButton = modal.querySelector(".cv-post-modal__close");
  let activeTrigger = null;
  let closeTimer = null;
  let lockedScrollY = 0;
  let savedBodyStyles = null;
  let savedHtmlScrollBehavior = "";
  let savedSiteAriaHidden = null;

  const normalizeTemplateId = (value) => value.replace(/^#/, "");

  const getFocusableNodes = () =>
    Array.from(panel.querySelectorAll(focusableSelector)).filter((node) => {
      const style = window.getComputedStyle(node);
      return style.display !== "none" && style.visibility !== "hidden";
    });

  const lockBodyScroll = () => {
    lockedScrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    savedBodyStyles = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    document.body.classList.add("cv-post-modal-open");
    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  };

  const unlockBodyScroll = () => {
    if (!savedBodyStyles) {
      return;
    }

    document.body.classList.remove("cv-post-modal-open");
    savedHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    Object.assign(document.body.style, savedBodyStyles);

    if (Math.abs(window.scrollY - lockedScrollY) > 1) {
      window.scrollTo({ top: lockedScrollY, left: 0, behavior: "auto" });
    }

    document.documentElement.style.scrollBehavior = savedHtmlScrollBehavior;
    savedBodyStyles = null;
  };

  const setSiteHidden = (isHidden) => {
    if (!site) {
      return;
    }

    if (isHidden) {
      savedSiteAriaHidden = site.getAttribute("aria-hidden");
      site.setAttribute("aria-hidden", "true");
      site.inert = true;
      return;
    }

    if (savedSiteAriaHidden === null) {
      site.removeAttribute("aria-hidden");
    } else {
      site.setAttribute("aria-hidden", savedSiteAriaHidden);
    }

    site.inert = false;
    savedSiteAriaHidden = null;
  };

  const setDialogTitle = (trigger) => {
    const existingTitle = body.querySelector("h1, h2, h3");
    let title = existingTitle;

    if (!title) {
      const article = body.querySelector(".cv-post-modal__article");
      title = document.createElement("h1");
      title.textContent = trigger.querySelector("h3")?.textContent?.trim() || "Article";
      (article || body).prepend(title);
    }

    if (!title.id) {
      title.id = `cv-post-modal-title-${Date.now()}`;
    }

    panel.setAttribute("aria-labelledby", title.id);
  };

  const removeDuplicateContentTitle = () => {
    const headerTitle = body.querySelector(".cv-post-article__header h2");
    const contentTitle = body.querySelector(".cv-post-article__content > h1:first-child");

    if (
      headerTitle &&
      contentTitle &&
      headerTitle.textContent.trim() === contentTitle.textContent.trim()
    ) {
      contentTitle.remove();
    }
  };

  const normalizeArticleImages = () => {
    body.querySelectorAll("img").forEach((image) => {
      const rawSrc = image.getAttribute("src");

      if (!rawSrc || /^(https?:)?\/\//.test(rawSrc) || rawSrc.startsWith("/")) {
        return;
      }

      if (rawSrc.startsWith("SC25%20Travel%20Report/")) {
        image.setAttribute("src", `/assets/photos/SC25/${rawSrc.replace("SC25%20Travel%20Report/", "")}`);
      } else if (rawSrc.startsWith("SC25 Travel Report/")) {
        image.setAttribute("src", `/assets/photos/SC25/${rawSrc.replace("SC25 Travel Report/", "")}`);
      } else if (rawSrc.startsWith("../assets/")) {
        image.setAttribute("src", `/${rawSrc.replace(/^(\.\.\/)+/, "")}`);
      } else if (rawSrc.startsWith("assets/")) {
        image.setAttribute("src", `/${rawSrc}`);
      }
    });
  };

  const openPostModal = (trigger) => {
    const templateId = normalizeTemplateId(trigger.dataset.postModal || "");
    const template = document.getElementById(templateId);

    if (!(template instanceof HTMLTemplateElement)) {
      return;
    }

    window.clearTimeout(closeTimer);
    activeTrigger = trigger;
    body.replaceChildren();
    body.scrollTop = 0;

    const article = document.createElement("article");
    article.className = "cv-post-modal__article";
    article.appendChild(template.content.cloneNode(true));
    body.appendChild(article);

    removeDuplicateContentTitle();
    normalizeArticleImages();
    setDialogTitle(trigger);
    lockBodyScroll();
    setSiteHidden(true);
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    modal.classList.remove("is-closing");

    window.requestAnimationFrame(() => {
      panel.focus({ preventScroll: true });
    });
  };

  const closePostModal = () => {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    modal.classList.remove("is-open");
    modal.classList.add("is-closing");
    modal.setAttribute("aria-hidden", "true");
    unlockBodyScroll();
    setSiteHidden(false);

    closeTimer = window.setTimeout(() => {
      modal.classList.remove("is-closing");
      body.replaceChildren();
    }, prefersReducedMotion ? 0 : 260);

    if (activeTrigger) {
      activeTrigger.focus({ preventScroll: true });
      activeTrigger = null;
    }
  };

  postLinks.forEach((link) => {
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openPostModal(link);
    });
  });

  closeButton.addEventListener("click", closePostModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closePostModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closePostModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableNodes = getFocusableNodes();

    if (!focusableNodes.length) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const firstNode = focusableNodes[0];
    const lastNode = focusableNodes[focusableNodes.length - 1];

    if (event.shiftKey && document.activeElement === firstNode) {
      event.preventDefault();
      lastNode.focus();
    } else if (!event.shiftKey && document.activeElement === lastNode) {
      event.preventDefault();
      firstNode.focus();
    }
  });
})();
