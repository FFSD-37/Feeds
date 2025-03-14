document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    this.reset();
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
});