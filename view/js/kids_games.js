document.querySelectorAll('.game-card').forEach(card => {
    const video = card.querySelector('video');

    card.addEventListener('mouseenter', () => {
        video.play();
    });

    card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });

    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'translateY(-5px)';
        }, 200);
    });
});

const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.game-card').forEach(card => {
        const gameTitle = card.dataset.game.toLowerCase();
        card.style.display = gameTitle.includes(searchTerm) ? 'block' : 'none';
    });
});