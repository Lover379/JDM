import './style.css';

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav a").forEach(link => {
  const href = link.getAttribute("href");

  if (!href || href === "#") return;

  const linkPage = href.split("/").pop();

  if (
    (currentPage === "" || currentPage === "index.html") &&
    (linkPage === "" || linkPage === "index.html")
  ) {
    link.classList.add("active");
  } else if (linkPage === currentPage) {
    link.classList.add("active");
  }
});