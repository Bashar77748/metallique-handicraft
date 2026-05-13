const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = [...document.querySelectorAll(".nav a")];
const revealItems = [...document.querySelectorAll(".reveal")];
const parallaxTarget = document.querySelector("[data-parallax]");

if (menuToggle && topbar) {
  menuToggle.addEventListener("click", () => {
    topbar.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", topbar.classList.contains("is-open") ? "true" : "false");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (topbar) {
      topbar.classList.remove("is-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

if (revealItems.length) {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

if (parallaxTarget) {
  let ticking = false;

  const updateParallax = () => {
    const shift = Math.min(26, window.scrollY * 0.03);
    parallaxTarget.style.setProperty("--hero-shift", `${shift}px`);

    document.querySelectorAll(".hero-tile").forEach((tile, index) => {
      const depth = 0.018 + index * 0.005;
      tile.style.setProperty("--mosaic-shift", `${Math.min(18, window.scrollY * depth)}px`);
    });

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
}

const gmailComposeUrl = (to, subject = "", body = "") => {
  const params = new URLSearchParams({ view: "cm", fs: "1", to });
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
};

document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  const rawHref = link.getAttribute("href") || "";
  const mailto = rawHref.replace(/^mailto:/i, "");
  const [recipient, query = ""] = mailto.split("?");
  const params = new URLSearchParams(query);
  const subject = params.get("subject") || params.get("su") || "";
  const body = params.get("body") || "";
  link.setAttribute("href", gmailComposeUrl(recipient, subject, body));
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noreferrer");
});

document.querySelectorAll("[data-gmail-form], form[action^='mailto:']").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const action = form.getAttribute("action") || "";
    const recipient = form.getAttribute("data-gmail-to")
      || action.replace(/^mailto:/i, "").split("?")[0];
    const fields = new FormData(form);
    const body = [...fields.entries()]
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    const subject = form.getAttribute("data-gmail-subject") || "Metallique Handicraft inquiry";
    window.open(gmailComposeUrl(recipient, subject, body), "_blank", "noopener");
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.getAttribute("data-copy") || "";
    try {
      await navigator.clipboard.writeText(text);
      const label = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => (button.textContent = label), 1200);
    } catch {
      button.textContent = "Copy failed";
      setTimeout(() => (button.textContent = "Copy"), 1200);
    }
  });
});
