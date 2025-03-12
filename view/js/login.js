const loginToggle = document.getElementById('loginToggle');
const identifierLabel = document.getElementById('identifierLabel');
const identifier = document.getElementById('identifier');
const identifierError = document.getElementById('identifierError');
const passwordToggle = document.getElementById('passwordToggle');
const password = document.getElementById('password');
const toggle = document.getElementById('identifykro');

loginToggle.addEventListener('change', function () {
    if (!this.checked) {
        identifierLabel.textContent = 'Email';
        identifier.type = 'email';
        identifier.placeholder = 'Enter your email address';
        identifierError.textContent = 'Please enter a valid email address';
    } else {
        identifierLabel.textContent = 'Username';
        identifier.type = 'text';
        identifier.placeholder = 'Enter your username';
        identifierError.textContent = 'Please enter a valid username';
    }
});

passwordToggle.addEventListener('click', function () {
    if (password.type === 'password') {
        password.type = 'text';
        this.textContent = '👁️‍🗨️';
    } else {
        password.type = 'password';
        this.textContent = '👁️';
    }
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
    if (identifier.type == 'text') {
        toggle.value = "username"
    }
    else {
        toggle.value = "email";
    }
});