// Sidebar Toggle Functionality
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");
const overlay = document.getElementById('userOverlay');
const fetchUserBtn = document.getElementById('fetchUserOverlay');
const closeBtn = document.getElementById('closeOverlayBtn');

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

        const id = this.id;
        if (id === "menuDashboard") {
            document.getElementById("dashboardSection").style.display = "grid";
            document.getElementById("reviewSection").style.display = "none";
            document.getElementById("usersSection").style.display = "none";
            document.getElementById("reportSection").style.display = "none";
        } else if (id === "menuUsers") {
            document.getElementById("dashboardSection").style.display = "none";
            document.getElementById("reviewSection").style.display = "none";
            document.getElementById("usersSection").style.display = "block";
            document.getElementById("reportSection").style.display = "none";
        } else if (id === "menuReports") { // ✅ Check for the menu item, not the section
            document.getElementById("dashboardSection").style.display = "none";
            document.getElementById("reviewSection").style.display = "none";
            document.getElementById("usersSection").style.display = "none";
            document.getElementById("reportSection").style.display = "block";
        }
        else if (id === "menuReviews") {
            document.getElementById("dashboardSection").style.display = "none";
            document.getElementById("reviewSection").style.display = "block";
            document.getElementById("usersSection").style.display = "none";
            document.getElementById("reportSection").style.display = "none";
        }
    });
});

const userProfile = document.querySelector(".user-profile");
userProfile.addEventListener("click", function () {
    alert("User profile settings coming soon!");
});

document.querySelectorAll('.manage-user-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const userId = this.dataset.id;
        const username = this.dataset.username;
        const email = this.dataset.email;

        fetch('/fetchUserOverlay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, username, email })
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error('Error:', err));
    });
});
