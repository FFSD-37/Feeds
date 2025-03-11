function showLogoutModal() {
  document.getElementById("logoutModal").classList.add("active");
  dropdown.classList.remove("active");
  document.body.style.overflow = "hidden";
}

function hideLogoutModal() {
  document.getElementById("logoutModal").classList.remove("active");
  document.body.style.overflow = "";
}

document.getElementById("logoutModal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    hideLogoutModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideLogoutModal();
  }
});
