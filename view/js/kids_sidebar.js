
function showLogoutModal() {
  const modal = document.getElementById("logoutModal");
  const dropdown = document.getElementById('menu-dropdown');


  if (modal) {
    modal.classList.add("active");
  }

 
  if (dropdown) {
    dropdown.classList.remove('show');
  }


  document.body.style.overflow = "hidden";
}

function hideLogoutModal() {
  const modal = document.getElementById("logoutModal");

  if (modal) {
    modal.classList.remove("active");
  }
  
  document.body.style.overflow = "";
}


const logoutModal = document.getElementById("logoutModal");
if (logoutModal) {
  
  logoutModal.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      hideLogoutModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && logoutModal && logoutModal.classList.contains("active")) {
    hideLogoutModal();
  }
});


const toggle = document.getElementById('menu-toggle');
const dropdown = document.getElementById('menu-dropdown');

if (toggle && dropdown) {
  toggle.addEventListener('click', function (e) {
    e.preventDefault(); 
    dropdown.classList.toggle('show'); 
  });

  document.addEventListener('click', function (e) {
    
    if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
     
      dropdown.classList.remove('show');
    }
  });
}