
document.addEventListener('DOMContentLoaded', function () {
    const loginToggle = document.getElementById('loginToggle');
    const identifierLabel = document.getElementById('identifierLabel');
    const identifier = document.getElementById('identifier');
    const identifierError = document.getElementById('identifierError');
    const passwordToggle = document.getElementById('passwordToggle');
    const password = document.getElementById('password');

    loginToggle.addEventListener('change', function () {
        if (this.checked) {
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
        e.preventDefault();

        let valid = true;
        const identifierGroup = identifier.parentElement;
        const passwordGroup = password.parentElement;

        if (loginToggle.checked) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(identifier.value)) {
                identifierGroup.classList.add('error');
                valid = false;
            } else {
                identifierGroup.classList.remove('error');
            }
        } else {
            if (identifier.value.length < 3) {
                identifierGroup.classList.add('error');
                valid = false;
            } else {
                identifierGroup.classList.remove('error');
            }
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!passwordRegex.test(password.value)) {
            passwordGroup.classList.add('error');
            valid = false;
        } else {
            passwordGroup.classList.remove('error');
        }

        if (valid) {
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';

            setTimeout(() => {
                alert('Login successful!');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }, 1500);
        }
    });
});

