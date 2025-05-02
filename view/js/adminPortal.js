// Sidebar Toggle Functionality
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");

sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("sidebar-hidden");
    mainContent.classList.toggle("content-full");
});

// Check screen size on load and resize
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

// Menu Item Click
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
    });
});

// Initialize Charts
const ctx = document.getElementById("salesChart").getContext("2d");

// Sample data for different time periods
const weekData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
        {
            label: "Sales",
            data: [18, 25, 30, 22, 17, 29, 32],
            backgroundColor: "rgba(67, 97, 238, 0.2)",
            borderColor: "rgba(67, 97, 238, 1)",
            borderWidth: 2,
            tension: 0.4,
        },
    ],
};

const monthData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
        {
            label: "Sales",
            data: [120, 190, 145, 210],
            backgroundColor: "rgba(67, 97, 238, 0.2)",
            borderColor: "rgba(67, 97, 238, 1)",
            borderWidth: 2,
            tension: 0.4,
        },
    ],
};

const yearData = {
    labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
    datasets: [
        {
            label: "Sales",
            data: [
                540, 620, 750, 890, 960, 1020, 980, 1100, 1250, 1380, 1500, 1650,
            ],
            backgroundColor: "rgba(67, 97, 238, 0.2)",
            borderColor: "rgba(67, 97, 238, 1)",
            borderWidth: 2,
            tension: 0.4,
        },
    ],
};

// Chart configuration
const chartConfig = {
    type: "line",
    data: weekData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    },
};

// Create chart
const salesChart = new Chart(ctx, chartConfig);

// Chart period buttons
const weekBtn = document.getElementById("weekBtn");
const monthBtn = document.getElementById("monthBtn");
const yearBtn = document.getElementById("yearBtn");

weekBtn.addEventListener("click", function () {
    salesChart.data = weekData;
    salesChart.update();

    // Update active button state
    weekBtn.style.fontWeight = "bold";
    monthBtn.style.fontWeight = "normal";
    yearBtn.style.fontWeight = "normal";
});

monthBtn.addEventListener("click", function () {
    salesChart.data = monthData;
    salesChart.update();

    // Update active button state
    weekBtn.style.fontWeight = "normal";
    monthBtn.style.fontWeight = "bold";
    yearBtn.style.fontWeight = "normal";
});

yearBtn.addEventListener("click", function () {
    salesChart.data = yearData;
    salesChart.update();

    // Update active button state
    weekBtn.style.fontWeight = "normal";
    monthBtn.style.fontWeight = "normal";
    yearBtn.style.fontWeight = "bold";
});

// Set week as default active view
weekBtn.style.fontWeight = "bold";

// Task checkbox functionality
const taskCheckboxes = document.querySelectorAll(".task-checkbox");
taskCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
        const taskLabel = this.nextElementSibling;

        if (this.checked) {
            taskLabel.style.textDecoration = "line-through";
            taskLabel.style.color = "#6c757d";
        } else {
            taskLabel.style.textDecoration = "none";
            taskLabel.style.color = "inherit";
        }
    });
});

// Task delete functionality
const deleteButtons = document.querySelectorAll(
    ".task-action:nth-child(2)"
);
deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const taskItem = this.closest(".task-item");
        taskItem.style.opacity = "0";
        setTimeout(() => {
            taskItem.remove();
        }, 300);
    });
});

// Notification handling
const notificationItems = document.querySelectorAll(".navbar-item");
notificationItems.forEach((item) => {
    item.addEventListener("click", function () {
        alert("Notifications feature coming soon!");
    });
});

// User profile dropdown functionality
const userProfile = document.querySelector(".user-profile");
userProfile.addEventListener("click", function () {
    alert("User profile settings coming soon!");
});