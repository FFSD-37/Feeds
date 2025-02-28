document.addEventListener("DOMContentLoaded", function () {
    const otpSection = document.getElementById("otp-section");
    const newPasswordSection = document.getElementById("new-password-section");

    window.sendOTP = function () {
        const email = document.getElementById("email").value;
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert("Please enter a valid email address.");
            return;
        }

        alert("OTP sent to your email!");
        otpSection.classList.remove("hidden");
    };

    window.verifyOTP = function () {
        const otp = document.getElementById("otp").value;
        if (otp.length !== 6 || isNaN(otp)) {
            alert("Invalid OTP. Please enter a 6-digit number.");
            return;
        }

        alert("OTP Verified!");
        newPasswordSection.classList.remove("hidden");
    };

    window.resetPassword = function () {
        const newPassword = document.getElementById("new-password").value;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

        if (!passwordRegex.test(newPassword)) {
            alert("Password must have at least 6 characters, an uppercase letter, a number, and a special character.");
            return;
        }

        alert("Password reset successful! Redirecting to login...");
        window.location.href = "/login";
    };
});
