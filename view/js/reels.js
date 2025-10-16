document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll(".reel-video video");
  const container = document.querySelector(".reels-container");
  const commentsPanel = document.getElementById("comments-panel");
  const commentsList = document.getElementById("comments-list");
  const commentForm = document.getElementById("comment-form");
  const commentTextarea = document.getElementById("comment-text");
  const commentsBackdrop = document.getElementById("comments-backdrop");
  const closeBtn = document.getElementById("close-comments");
  const commentsCountSmall = document.getElementById("comments-count-small");

  let activeVideo = null;
  let activePostId = null;

  // --- IntersectionObserver for auto play/pause ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        videos.forEach(v => { if (v !== video) { v.pause(); v.muted = true; } });
        video.play().catch(() => { video.muted = true; video.play(); });
        activeVideo = video;
      } else if (video === activeVideo) {
        video.pause();
        video.muted = true;
        activeVideo = null;
      }
    });
  }, { threshold: 0.8 });

  videos.forEach(v => {
    v.controls = false;
    v.addEventListener("click", () => v.paused ? v.play() : v.pause());
    observer.observe(v);
  });

  // --- Mute toggle ---
  window.toggleMute = function (button) {
    const video = button.closest(".reel-video").querySelector("video");
    const muteIcon = button.querySelector(".mute-icon");
    const unmuteIcon = button.querySelector(".unmute-icon");

    video.muted = !video.muted;
    muteIcon.style.display = video.muted ? "block" : "none";
    unmuteIcon.style.display = video.muted ? "none" : "block";
  };

  // --- Keyboard navigation ---
  function isUserTyping() {
    const active = document.activeElement;
    if (!active) return false;
    const tag = (active.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || active.isContentEditable;
  }

  document.addEventListener("keydown", (e) => {
    if (isUserTyping()) return;

    const reelsFeed = document.querySelector(".reels-feed");
    const height = reelsFeed.clientHeight;

    if (e.key === "ArrowDown") reelsFeed.scrollBy(0, height);
    else if (e.key === "ArrowUp") reelsFeed.scrollBy(0, -height);
    else if (e.code === "Space" && activeVideo) {
      e.preventDefault();
      activeVideo.paused ? activeVideo.play() : activeVideo.pause();
    } else if (e.key === "Escape") {
      closeCommentsPanel();
    }
  });

  // --- Like logic ---
  async function handleLikeClick(e) {
    const btn = e.currentTarget;
    const countEl = btn.querySelector(".like-count");
    const postId = btn.dataset.postId;

    btn.classList.toggle("liked");
    const liked = btn.classList.contains("liked");
    let count = parseInt(countEl.textContent || "0");
    countEl.textContent = liked ? count + 1 : Math.max(0, count - 1);

    try {
      const res = await fetch(`/posts/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reel_id: postId }),
      });
      const data = await res.json();
      if (data.likes !== undefined) countEl.textContent = data.likes;
    } catch (err) {
      console.error(err);
      btn.classList.toggle("liked");
      countEl.textContent = count;
      alert("Failed to update like.");
    }
  }

  // --- Comments panel logic ---
  async function openComments(postId) {
    activePostId = postId;
    container.classList.add("comments-open");
    commentsPanel.setAttribute("aria-hidden", "false");
    commentsBackdrop.setAttribute("aria-hidden", "false");

    commentsList.innerHTML = `<div class="loading">Loading comments...</div>`;

    if (activeVideo) activeVideo.pause();

    try {
      const res = await fetch(`/posts/${postId}`);
      const post = await res.json();
      renderComments(post.comments || []);
      commentsCountSmall.textContent = (post.comments || []).length;
      setTimeout(() => commentTextarea.focus(), 200);
    } catch (err) {
      commentsList.innerHTML = `<div class="error">Failed to load comments</div>`;
    }
  }

  function closeCommentsPanel() {
    activePostId = null;
    container.classList.remove("comments-open");
    commentsPanel.setAttribute("aria-hidden", "true");
    commentsBackdrop.setAttribute("aria-hidden", "true");
    commentsList.innerHTML = "";
    commentTextarea.value = "";
  }

  function renderComments(comments) {
    if (!comments || comments.length === 0) {
      commentsList.innerHTML = `<div class="no-comments">No comments yet. Be the first!</div>`;
      return;
    }

    commentsList.innerHTML = "";
    comments.forEach((c) => {
      const div = document.createElement("div");
      div.className = "comment-item";
      div.innerHTML = `
        <div class="comment-author">${escapeHtml(c.author || "User")}</div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
        <div class="comment-time">${new Date(c.createdAt || Date.now()).toLocaleString()}</div>`;
      commentsList.appendChild(div);
    });
  }

  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = commentTextarea.value.trim();
    if (!text || !activePostId) return;

    const optimistic = { author: "You", text, createdAt: new Date().toISOString() };
    const prevHTML = commentsList.innerHTML;
    renderComments([optimistic, ...Array.from(commentsList.children).map((el) => ({
      author: el.querySelector(".comment-author")?.textContent || "",
      text: el.querySelector(".comment-text")?.textContent || "",
      createdAt: el.querySelector(".comment-time")?.textContent || "",
    }))]);

    try {
      const res = await fetch(`/posts/${activePostId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      renderComments(data.comments || []);
      updateCommentCountInFeed(activePostId, (data.comments || []).length);
      commentTextarea.value = "";
    } catch (err) {
      console.error(err);
      commentsList.innerHTML = prevHTML;
      alert("Failed to post comment.");
    }
  });

  commentsBackdrop.addEventListener("click", closeCommentsPanel);
  closeBtn.addEventListener("click", closeCommentsPanel);

  function updateCommentCountInFeed(postId, newCount) {
    const countEl = document.querySelector(`.comment-button[data-post-id="${postId}"] .comment-count`);
    if (countEl) countEl.textContent = newCount;
    if (commentsCountSmall) commentsCountSmall.textContent = newCount;
  }

  async function handleShareClick(e) {
    const btn = e.currentTarget;
    const postUrl = btn.dataset.postUrl || `${location.origin}/posts/${btn.dataset.postId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Check this reel!", url: postUrl });
      } else {
        await navigator.clipboard.writeText(postUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
      window.open(postUrl, "_blank");
    }
  }

  // --- Event delegation ---
  document.addEventListener("click", (ev) => {
    const commentBtn = ev.target.closest(".comment-button");
    const likeBtn = ev.target.closest(".like-button");
    const shareBtn = ev.target.closest(".share-button");

    if (commentBtn) return openComments(commentBtn.dataset.postId);
    if (likeBtn) return handleLikeClick({ currentTarget: likeBtn });
    if (shareBtn) return handleShareClick({ currentTarget: shareBtn });
  });

  // --- Utility ---
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
    );
  }
});
