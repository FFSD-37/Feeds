let currentStories = [];
let currentUsername = null;
let currentStoryIndex = 0;
let progressInterval;
let progressDuration = 5000;

function updateLikeButtonUI(btn, liked) {
    if (!btn) return;
    if (liked) {
        btn.classList.add('liked');
        btn.setAttribute('aria-pressed', 'true');
        btn.title = 'Liked';
        // reveal filled heart via CSS
    } else {
        btn.classList.remove('liked');
        btn.setAttribute('aria-pressed', 'false');
        btn.title = 'Like';
    }
}

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
console.log(currentStories);

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
    container.dataset.storyId = story._id;
    const type=story.url.split("/")[4]==='Reels'?'video':'image';
    let storyElement;

    if(type === 'image'){
        storyElement = document.createElement('img');
        storyElement.src = story.url;
        storyElement.className = 'story-media';
    }

    else{
        storyElement = document.createElement('video');
        storyElement.src = story.url;
        storyElement.className = 'story-media';
        storyElement.controls = false;
        storyElement.autoplay = true;
        storyElement.muted = true;
        storyElement.playsInline = true;
        storyElement.loop = false;
        
        // Add storyElement play/pause controls
        storyElement.addEventListener('click', function() {
            if (storyElement.paused) {
                storyElement.play();
            } else {
                storyElement.pause();
            }
        });

        // Auto-play when metadata loaded
        storyElement.addEventListener('loadedmetadata', function() {
            storyElement.play().catch(error => {
                console.log('Video autoplay failed:', error);
            });
        });
    };
    
    container.appendChild(storyElement);

    const likeBtn = document.createElement('button');
    likeBtn.className = 'story-like-button';
    likeBtn.type = 'button';
    likeBtn.dataset.liking = 'false';
    const isLiked = !!story.liked;
    if (isLiked) likeBtn.classList.add('liked');

    likeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" class="heart-icon" width="20" height="20" aria-hidden="true" focusable="false">
        <path class="heart-outline" d="M12.1 8.64l-.1.1-.11-.11C10.14 6.7 7.35 6.7 5.8 8.25 4.23 9.82 4.23 12.6 5.8 14.17L12 20.36l6.2-6.19c1.57-1.57 1.57-4.35 0-5.92-1.55-1.55-4.34-1.55-5.9 0z" fill="none" stroke="currentColor" stroke-width="1.2" />
        <path class="heart-filled" d="M12 21s-7.5-5.5-9-8.4C1.9 9.1 4 6 7 6c1.7 0 3 1 4 2.3C12.9 7 14.3 6 16 6c3 0 5.1 3.1 4 6.6-1.5 2.9-9 8.4-9 8.4z" fill="currentColor" opacity="0"/>
      </svg>
    `;

    likeBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (likeBtn.dataset.liking === 'true') return;

        const storyId = container.dataset.storyId;
        if (!storyId) return console.warn('Story id missing for like request');

        const currentlyLiked = likeBtn.classList.contains('liked');
        const newLike = !currentlyLiked;

        updateLikeButtonUI(likeBtn, newLike);

        likeBtn.dataset.liking = 'true';
        likeBtn.disabled = true;

        try {
            const res = await fetch(`/stories/liked/${storyId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            });

            if (!res.ok) {
                throw new Error(`Server returned ${res.status}`);
            }

            const data = await res.json();
            const finalLiked = typeof data.liked !== 'undefined' ? !!data.liked : newLike;

            const sIndex = currentStories.findIndex(s => (s._id || s.id) == storyId);
            if (sIndex !== -1) currentStories[sIndex].liked = finalLiked;

            updateLikeButtonUI(likeBtn, finalLiked);
        } catch (err) {
            console.error('Like request failed', err);
            updateLikeButtonUI(likeBtn, currentlyLiked);
        } finally {
            likeBtn.dataset.liking = 'false';
            likeBtn.disabled = false;
        }
    });

    container.appendChild(likeBtn);

    return container;
}

function getTimeAgo(date) {console.log(date);

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