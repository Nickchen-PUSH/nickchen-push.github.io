(() => {
  window.decorateCVArticle = (article) => {
    const content = article.querySelector(".cv-post-article__content");
    if (!content || article.querySelector(".cv-article-toc")) return;

    const headings = Array.from(content.querySelectorAll("h2"));
    if (headings.length < 4) return;

    const toc = document.createElement("details");
    toc.className = "cv-article-toc";
    const summary = document.createElement("summary");
    summary.textContent = "On this page";
    const list = document.createElement("ol");

    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `article-section-${index + 1}`;
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.addEventListener("click", (event) => {
        if (article.closest(".cv-post-modal")) {
          event.preventDefault();
          heading.scrollIntoView({ behavior: "auto", block: "start" });
        }
      });
      item.appendChild(link);
      list.appendChild(item);
    });

    toc.append(summary, list);
    content.before(toc);
  };

  document.querySelectorAll(".cv-post-shell").forEach(window.decorateCVArticle);
})();
