function showTab(tabName) {
    document.querySelectorAll('.posts-grid').forEach(grid => {
        grid.classList.add('hidden');
    });
    document.getElementById(tabName).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

function openSettings() {
    window.location.href = 'settings.html';
}