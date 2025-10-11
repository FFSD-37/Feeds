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

// Update the toggleMute function in reels.js
window.toggleMute = function(button) {
    const video = button.closest('.reel-video').querySelector('video');
    const muteIcon = button.querySelector('.mute-icon');
    const unmuteIcon = button.querySelector('.unmute-icon');
    
    video.muted = !video.muted;
    
    if (video.muted) {
      muteIcon.style.display = 'block';
      unmuteIcon.style.display = 'none';
    } else {
      muteIcon.style.display = 'none';
      unmuteIcon.style.display = 'block';
    }
  };

  document.querySelectorAll('.reel-video video').forEach(video => {
    video.controls = false;
    video.addEventListener('click', () => video.paused ? video.play() : video.pause());
  });

document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.reel-video video');
    let activeVideo = null;
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        
        if (entry.isIntersecting) {
          videos.forEach(v => {
            if (v !== video) {
              v.pause();
              v.muted = true;
            }
          });
          
          video.play().catch(() => {
            video.muted = true;
            video.play();
          });
          
          activeVideo = video;
        } else if (video === activeVideo) {
          video.pause();
          video.muted = true;
          activeVideo = null;
        }
      });
    }, {
      threshold: 0.8,
      rootMargin: '0px'
    });
  
    videos.forEach(video => observer.observe(video));
  
    window.toggleMute = function(button) {
      const video = button.closest('.reel-video').querySelector('video');
      video.muted = !video.muted;
      
      const icons = button.querySelectorAll('svg');
      icons.forEach(icon => icon.style.display = 
        icon.classList.contains('mute-icon') ? 
        (video.muted ? 'block' : 'none') : 
        (video.muted ? 'none' : 'block')
      );
    };
  
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && activeVideo) {
        e.preventDefault();
        activeVideo.paused ? activeVideo.play() : activeVideo.pause();
      }
    });
  });