document.addEventListener('keydown', (e) => {
  e.preventDefault();
  if (e.key === "Escape"){
    document.getElementById("socialDropdown").style.display = "none";
    document.getElementById("report-modal").classList.remove("show");
  }
});

function openpostdropdown(e){
  document.getElementById("socialDropdown").style.display = "block";
}

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
