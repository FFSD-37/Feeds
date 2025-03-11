document.addEventListener("DOMContentLoaded", function () {
  const triggers = document.querySelectorAll(".post-options");
  const menus = document.querySelectorAll(".dropdown-menu");
  const pageContent = document.getElementById("pageContent"); // Target the content, not body

  triggers.forEach((trigger, index) => {
    const menu = menus[index];

    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      let isAlreadyOpen = menu.style.display === "block";
      menus.forEach((m) => (m.style.display = "none"));

      menu.style.display = isAlreadyOpen ? "none" : "block";

      overlay.style.display = isAlreadyOpen ? "none" : "block";
    });
    menu.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", function (event) {
        event.stopPropagation();
        menu.style.display = "none";
        overlay.style.display = "none";
      });
    });
  });
  document.addEventListener("click", function () {
    menus.forEach((menu) => (menu.style.display = "none"));
    overlay.style.display = "none";
  });
});
