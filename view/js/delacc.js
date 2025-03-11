const form = document.getElementById('deleteForm');
const passwordInput = document.getElementById('password');
const confirmationInput = document.getElementById('confirmation');
const understandCheckbox = document.getElementById('understand');
const deleteButton = document.querySelector('.delete-btn');
const passwordToggle = document.getElementById('passwordToggle');

const validatePassword = (password) => {
    return password.length >= 6;
};

const validateConfirmation = (text) => {
    return text === 'DELETE';
};

const showError = (input, isValid) => {
    const formGroup = input.parentElement;
    if (!isValid) {
        formGroup.classList.add('error');
    } else {
        formGroup.classList.remove('error');
    }
};

const updateDeleteButton = () => {
    const isPasswordValid = validatePassword(passwordInput.value);
    const isConfirmationValid = validateConfirmation(confirmationInput.value);
    const isCheckboxChecked = understandCheckbox.checked;

    deleteButton.disabled = !(isPasswordValid && isConfirmationValid && isCheckboxChecked);
};

// Toggle password visibility
passwordToggle.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.textContent = '👁️‍🗨️';
    } else {
        passwordInput.type = 'password';
        passwordToggle.textContent = '👁️';
    }
});

passwordInput.addEventListener('input', () => {
    const isValid = validatePassword(passwordInput.value);
    showError(passwordInput, isValid);
    updateDeleteButton();
});

confirmationInput.addEventListener('input', () => {
    const isValid = validateConfirmation(confirmationInput.value);
    showError(confirmationInput, isValid);
    updateDeleteButton();
});

understandCheckbox.addEventListener('change', updateDeleteButton);

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isPasswordValid = validatePassword(passwordInput.value);
    const isConfirmationValid = validateConfirmation(confirmationInput.value);

    showError(passwordInput, isPasswordValid);
    showError(confirmationInput, isConfirmationValid);

    if (isPasswordValid && isConfirmationValid && understandCheckbox.checked) {
        console.log('Account deletion initiated');
    }
});

document.querySelector('.cancel-btn').addEventListener('click', () => {
    window.history.back();
});