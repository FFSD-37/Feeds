// Sidebar Toggle Functionality
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");

sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("sidebar-hidden");
    mainContent.classList.toggle("content-full");
});

function checkScreenSize() {
    if (window.innerWidth < 992) {
        sidebar.classList.add("sidebar-hidden");
        mainContent.classList.add("content-full");
    } else {
        sidebar.classList.remove("sidebar-hidden");
        mainContent.classList.remove("content-full");
    }
}

window.addEventListener("load", checkScreenSize);
window.addEventListener("resize", checkScreenSize);

// Menu item active state and section toggling
const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach((item) => {
    item.addEventListener("click", function () {
        menuItems.forEach((i) => i.classList.remove("active"));
        this.classList.add("active");

        // On mobile, close sidebar after selection
        if (window.innerWidth < 992) {
            sidebar.classList.add("sidebar-hidden");
            mainContent.classList.add("content-full");
        }

        // Section toggling logic
        const id = this.id;

        // Show/hide based on which menu is clicked
        if (id === "menuDashboard") {
            document.getElementById("dashboardSection").style.display = "grid";
            document.getElementById("usersSection").style.display = "none";
            document.getElementById("reportSection").style.display = "none";
        } else if (id === "menuUsers") {
            document.getElementById("dashboardSection").style.display = "none";
            document.getElementById("usersSection").style.display = "block";
            document.getElementById("reportSection").style.display = "none";
        } else if (id === "menuReports") { // ✅ Check for the menu item, not the section
            document.getElementById("dashboardSection").style.display = "none";
            document.getElementById("usersSection").style.display = "none";
            document.getElementById("reportSection").style.display = "block";
        }        
    });
});

// User profile dropdown functionality
const userProfile = document.querySelector(".user-profile");
userProfile.addEventListener("click", function () {
    alert("User profile settings coming soon!");
});