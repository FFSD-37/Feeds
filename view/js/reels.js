document.addEventListener("keydown", function (event) {
    const reelsFeed = document.querySelector(".reels-feed");
    const height = reelsFeed.clientHeight;

    if (event.key === "ArrowDown") {
        reelsFeed.scrollBy(0, height);
    } else if (event.key === "ArrowUp") {
        reelsFeed.scrollBy(0, -height);
    }
});

document.querySelectorAll(".nav-arrow").forEach((arrow, index) => {
    arrow.addEventListener("click", function () {
        const reelsFeed = document.querySelector(".reels-feed");
        const height = reelsFeed.clientHeight;
        if (index === 0) {
            reelsFeed.scrollBy(0, -height);
        } else {
            reelsFeed.scrollBy(0, height);
        }
    });
});