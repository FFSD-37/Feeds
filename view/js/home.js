function openpostdropdown(e){
  document.getElementById("socialDropdown").style.display = "block";
}

function postOverlay(e) {
  document.getElementById("socialDropdown").style.display = "none";
  document.getElementById("maindiv").style.display = "grid";
  document.getElementById("maindiv").style.opacity = "1";
}

document.getElementById("comment-button-post").addEventListener("click", (e) => {
  document.getElementById("message-input").focus();
});

document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    const reportModal = document.getElementById("report-modal");
    if (reportModal.classList.contains("show")) {
      reportModal.classList.remove("show");
      return;
    }
    const overlay = document.getElementById("maindiv");
    if (overlay.style.display === "grid") {
      overlay.style.display = "none";
      document.body.style.overflow = "";
      return;
    }

    const dropdown = document.getElementById("socialDropdown");
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
      return;
    }
  }
});

function closepostdropdown(e){
  document.getElementById("socialDropdown").style.display = "none";
}

function openReportModal(e) {
  document.getElementById("report-modal").classList.add("show");
}

function closeReportModal(e) {
  document.getElementById("report-modal").classList.remove("show");
}

function selectReason(reason) {
  alert("You selected: " + reason);
  closeReportModal();
}
