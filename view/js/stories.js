let currentStories = [];
let currentUsername = null;
let currentStoryIndex = 0;
let progressInterval;
let progressDuration = 5000;

function openStory(username) {
    currentUsername = username;
    currentStoryIndex = 0;
    
    const allStories = [
        ...storiesData.userStories
    ];console.log(allStories);
    

    currentStories = allStories.filter(story => story.username === username);
    
    if (currentStories.length === 0) return;

    const storyViewer = document.getElementById('story-viewer');
    const storyProgressContainer = document.getElementById('story-progress-container');
    const storyViewContainer = document.getElementById('story-view-container');
    const storyUserAvatar = document.getElementById('story-user-avatar');
    const storyUsername = document.getElementById('story-username');
    const storyTime = document.getElementById('story-time');

    storyProgressContainer.innerHTML = '';
    storyViewContainer.innerHTML = '';

    storyUserAvatar.src = currentStories[0].avatarUrl;
    storyUsername.textContent = username;
    storyTime.textContent = getTimeAgo(currentStories[0].createdAt);

    currentStories.forEach((_, index) => {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `<div class="progress-bar-fill" id="progress-${index}"></div>`;
        storyProgressContainer.appendChild(progressBar);
    });

    currentStories.forEach((story, index) => {
        const storyElement = createStoryElement(story);
        storyElement.className = index === 0 ? 'story-image active-story' : 'story-image inactive-story';
        storyElement.id = `story-image-${index}`;
        storyViewContainer.appendChild(storyElement);
    });

    storyViewer.style.display = 'block';
    startProgress(0);
}

function createStoryElement(story) {

    const container = document.createElement('div');
    container.className = 'story-media-container';

        const video = document.createElement('video');
        video.src = story.url;
        video.className = 'story-media';
        video.controls = false;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.loop = false;
        
        // Add video play/pause controls
        video.addEventListener('click', function() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        // Auto-play when metadata loaded
        video.addEventListener('loadedmetadata', function() {
            video.play().catch(error => {
                console.log('Video autoplay failed:', error);
            });
        });

        container.appendChild(video);

    return container;
}

function getTimeAgo(date) {
    const seconds = Math.floor((Date.now() -new Date(date).getTime()) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (const [unit, sec] of Object.entries(intervals)) {
      const count = Math.floor(seconds / sec);
      if (count >= 1) return `${count}${unit.charAt(0)}`;
    }
    return "just now";
  }

function closeStory() {
    const storyViewer = document.getElementById('story-viewer');
    storyViewer.style.display = 'none';

    clearInterval(progressInterval);

    document.getElementById('options-menu').classList.remove('show');
}

function toggleOptionsMenu() {
    const optionsMenu = document.getElementById('options-menu');
    optionsMenu.classList.toggle('show');

    event.stopPropagation();
}

function startProgress(storyIndex) {
    clearInterval(progressInterval);

    for (let i = 0; i < users[currentUsername].stories.length; i++) {
        const progressBar = document.getElementById(`progress-${i}`);
        if (i < storyIndex) {
            progressBar.style.width = '100%';
        } else if (i > storyIndex) {
            progressBar.style.width = '0%';
        }
    }

    const progressBar = document.getElementById(`progress-${storyIndex}`);
    let width = 0;

    progressInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(progressInterval);
            nextStory();
        } else {
            width += 0.5;
            progressBar.style.width = width + '%';
        }
    }, progressDuration / 200);
}

function showStory(index) {
    document.getElementById('story-time').textContent = getTimeAgo(currentStories[index].createdAt);
    for (let i = 0; i < users[currentUsername].stories.length; i++) {
        document.getElementById(`story-image-${i}`).className = 'story-image inactive-story';
    }

    const currentStoryElement = document.getElementById(`story-image-${index}`);
    currentStoryElement.className = 'story-image active-story fade-in';

    document.getElementById('options-menu').classList.remove('show');

    startProgress(index);
}

function nextStory() {
    if (currentStoryIndex < currentStories.length - 1) {
        currentStoryIndex++;
        showStory(currentStoryIndex);
    } else {
        closeStory();
    }
}

function previousStory() {
    const userData=Object.keys(users);
    if (currentStoryIndex > 0) {
        currentStoryIndex--;
        showStory(currentStoryIndex);
    } else {
        const userIds = userData;
        const currentUserIndex = userIds.indexOf(currentUsername);

        if (currentUserIndex > 0) {
            const prevUserId = userIds[currentUserIndex - 1];
            currentUsername = prevUserId;
            currentStoryIndex = users[prevUserId].stories.length - 1;

            openStory(prevUserId);

            currentStoryIndex = users[prevUserId].stories.length - 1;
            showStory(currentStoryIndex);
        }
    }
}

function handleMute() {
    alert(`${users[currentUsername].username} has been muted`);
    document.getElementById('options-menu').classList.remove('show');
}

function handleReport() {
    alert(`Story reported`);
    document.getElementById('options-menu').classList.remove('show');
}

function shareStory() {
    alert(`Story shared`);
}

document.addEventListener('click', function () {
    const optionsMenu = document.getElementById('options-menu');

    if (optionsMenu.classList.contains('show') ) {
        optionsMenu.classList.remove('show');
    }
});