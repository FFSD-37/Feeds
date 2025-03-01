function showLogoutModal() {
  document.getElementById("logoutModal").classList.add("active");
  dropdown.classList.remove("active");
  document.body.style.overflow = "hidden";
}

function hideLogoutModal() {
  document.getElementById("logoutModal").classList.remove("active");
  document.body.style.overflow = "";
}

function confirmLogout() {
  const logoutBtn = document.querySelector(".logout-btn");
  logoutBtn.innerHTML = "Logging out...";
  logoutBtn.disabled = true;

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
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
