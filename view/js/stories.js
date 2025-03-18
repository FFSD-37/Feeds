const users = {
    user1: {
        username: "user_one",
        avatar: "/api/placeholder/160/160",
        stories: [
            "/api/placeholder/800/1200",
            "/api/placeholder/800/1200"
        ]
    },
    user2: {
        username: "travel_lover",
        avatar: "/api/placeholder/160/160",
        stories: [
            "/api/placeholder/800/1200",
            "/api/placeholder/800/1200",
            "/api/placeholder/800/1200"
        ]
    },
    user3: {
        username: "photo_pro",
        avatar: "/api/placeholder/160/160",
        stories: [
            "/api/placeholder/800/1200"
        ]
    },
    user4: {
        username: "food_blogger",
        avatar: "/api/placeholder/160/160",
        stories: [
            "/api/placeholder/800/1200",
            "/api/placeholder/800/1200"
        ]
    }
};

let currentUser = null;
let currentStoryIndex = 0;
let progressInterval;
let progressDuration = 5000;
let storyLikes = {};

function generateStoryCircles() {
    const storiesGrid = document.getElementById('stories-grid');
    storiesGrid.innerHTML = '';

    Object.keys(users).forEach(userId => {
        const user = users[userId];

        const storyCircle = document.createElement('div');
        storyCircle.className = 'story-circle';
        storyCircle.onclick = () => openStory(userId);

        storyCircle.innerHTML = `
            <div class="story-avatar-border">
                <img src="${user.avatar}" alt="${user.username}" class="story-avatar">
            </div>
            <div class="story-username">${user.username}</div>
        `;

        storiesGrid.appendChild(storyCircle);
    });
}

window.addEventListener('load', generateStoryCircles);

function openStory(userId) {
    currentUser = userId;
    currentStoryIndex = 0;

    const user = users[userId];
    const storyViewer = document.getElementById('story-viewer');
    const storyProgressContainer = document.getElementById('story-progress-container');
    const storyViewContainer = document.getElementById('story-view-container');
    const storyUserAvatar = document.getElementById('story-user-avatar');
    const storyUsername = document.getElementById('story-username');
    const optionsMenu = document.getElementById('options-menu');
    const likeButton = document.getElementById('like-button');

    optionsMenu.classList.remove('show');

    storyProgressContainer.innerHTML = '';
    storyViewContainer.innerHTML = '';

    storyUserAvatar.src = user.avatar;
    storyUsername.textContent = user.username;

    for (let i = 0; i < user.stories.length; i++) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `<div class="progress-bar-fill" id="progress-${i}"></div>`;
        storyProgressContainer.appendChild(progressBar);
    }

    for (let i = 0; i < user.stories.length; i++) {
        const storyImage = document.createElement('img');
        storyImage.src = user.stories[i];
        storyImage.alt = `${user.username}'s story`;
        storyImage.className = i === 0 ? 'story-image active-story' : 'story-image inactive-story';
        storyImage.id = `story-image-${i}`;
        storyViewContainer.appendChild(storyImage);
    }

    storyViewer.style.display = 'block';

    const storyKey = `${userId}-${currentStoryIndex}`;
    if (storyLikes[storyKey]) {
        likeButton.classList.add('active');
    } else {
        likeButton.classList.remove('active');
    }

    startProgress(0);
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

    for (let i = 0; i < users[currentUser].stories.length; i++) {
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
    for (let i = 0; i < users[currentUser].stories.length; i++) {
        document.getElementById(`story-image-${i}`).className = 'story-image inactive-story';
    }

    const currentStoryElement = document.getElementById(`story-image-${index}`);
    currentStoryElement.className = 'story-image active-story fade-in';

    document.getElementById('options-menu').classList.remove('show');

    const storyKey = `${currentUser}-${index}`;
    const likeButton = document.getElementById('like-button');
    if (storyLikes[storyKey]) {
        likeButton.classList.add('active');
    } else {
        likeButton.classList.remove('active');
    }

    startProgress(index);
}

function nextStory() {
    if (currentStoryIndex < users[currentUser].stories.length - 1) {
        currentStoryIndex++;
        showStory(currentStoryIndex);
    } else {
        const userIds = Object.keys(users);
        const currentUserIndex = userIds.indexOf(currentUser);

        if (currentUserIndex < userIds.length - 1) {
            openStory(userIds[currentUserIndex + 1]);
        } else {
            closeStory();
        }
    }
}

function previousStory() {
    if (currentStoryIndex > 0) {
        currentStoryIndex--;
        showStory(currentStoryIndex);
    } else {
        const userIds = Object.keys(users);
        const currentUserIndex = userIds.indexOf(currentUser);

        if (currentUserIndex > 0) {
            const prevUserId = userIds[currentUserIndex - 1];
            currentUser = prevUserId;
            currentStoryIndex = users[prevUserId].stories.length - 1;

            openStory(prevUserId);

            currentStoryIndex = users[prevUserId].stories.length - 1;
            showStory(currentStoryIndex);
        }
    }
}

function handleMute() {
    alert(`${users[currentUser].username} has been muted`);
    document.getElementById('options-menu').classList.remove('show');
}

function handleReport() {
    alert(`Story reported`);
    document.getElementById('options-menu').classList.remove('show');
}

function toggleLike() {
    const likeButton = document.getElementById('like-button');
    const storyKey = `${currentUser}-${currentStoryIndex}`;

    if (storyLikes[storyKey]) {
        storyLikes[storyKey] = false;
        likeButton.classList.remove('active');
    } else {
        storyLikes[storyKey] = true;
        likeButton.classList.add('active');

        likeButton.style.transform = 'scale(1.2)';
        setTimeout(() => {
            likeButton.style.transform = 'scale(1)';
        }, 200);
    }
}

function handleMessageSend(event) {
    if (event.key === 'Enter') {
        const messageInput = event.target;
        const message = messageInput.value.trim();

        if (message) {
            alert(`Message sent to ${users[currentUser].username}: "${message}"`);
            messageInput.value = '';
        }
    }
}

function shareStory() {
    alert(`Story shared`);
}

document.addEventListener('click', function (event) {
    const optionsMenu = document.getElementById('options-menu');
    const storyActions = document.querySelector('.story-actions');

    if (optionsMenu.classList.contains('show') && event.target !== storyActions && !storyActions.contains(event.target)) {
        optionsMenu.classList.remove('show');
    }
});