document.getElementById("sendotp")?.addEventListener("submit", function(event){
    localStorage.setItem("userEmail", document.getElementById("email").value);
});

document.getElementById("verifyotp")?.addEventListener("submit", function(event) {
    let storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
        document.getElementById("foremail").value = storedEmail;
    }
});

document.getElementById("updatepass")?.addEventListener("submit", function(event){
    let storedEmail = localStorage.getItem("userEmail");
    if(storedEmail){
        document.getElementById("foremail").value = storedEmail;
    }
});