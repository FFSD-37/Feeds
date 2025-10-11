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

// Mute toggle & IntersectionObserver logic
window.toggleMute = function (button) {
  const video = button.closest(".reel-video").querySelector("video");
  const muteIcon = button.querySelector(".mute-icon");
  const unmuteIcon = button.querySelector(".unmute-icon");

  video.muted = !video.muted;

  if (video.muted) {
    muteIcon.style.display = "block";
    unmuteIcon.style.display = "none";
  } else {
    muteIcon.style.display = "none";
    unmuteIcon.style.display = "block";
  }
};

document.querySelectorAll(".reel-video video").forEach((video) => {
  video.controls = false;
  video.addEventListener("click", () => (video.paused ? video.play() : video.pause()));
});

document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll(".reel-video video");
  let activeVideo = null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          videos.forEach((v) => {
            if (v !== video) {
              v.pause();
              v.muted = true;
            }
          });

          video
            .play()
            .catch(() => {
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
    },
    {
      threshold: 0.8,
      rootMargin: "0px",
    }
  );

  videos.forEach((video) => observer.observe(video));

  window.toggleMute = function (button) {
    const video = button.closest(".reel-video").querySelector("video");
    video.muted = !video.muted;

    const icons = button.querySelectorAll("svg");
    icons.forEach((icon) =>
      icon.style.display = icon.classList.contains("mute-icon")
        ? video.muted
          ? "block"
          : "none"
        : video.muted
        ? "none"
        : "block"
    );
  };

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && activeVideo) {
      e.preventDefault();
      activeVideo.paused ? activeVideo.play() : activeVideo.pause();
    }
  });

  // --- Like / Comment / Share handlers ---
  const likeButtons = document.querySelectorAll(".like-button");
  const commentButtons = document.querySelectorAll(".comment-button");
  const shareButtons = document.querySelectorAll(".share-button");

  likeButtons.forEach((btn) => btn.addEventListener("click", handleLikeClick));
  commentButtons.forEach((btn) => btn.addEventListener("click", handleCommentClick));
  shareButtons.forEach((btn) => btn.addEventListener("click", handleShareClick));

  // --------- Like logic ----------
  async function handleLikeClick(e) {
    const btn = e.currentTarget;
    const countEl = btn.querySelector(".like-count");
    let current = parseInt(countEl.textContent || "0", 10);

    // Optimistic UI update
    btn.classList.toggle("liked");
    const liked = btn.classList.contains("liked");
    // countEl.textContent = liked ? current + 1 : Math.max(0, current - 1);
    // console.log(document.getElementById("reel-id").value);

    try {
      const res = await fetch(`/posts/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reel_id: document.getElementById("reel-id").value })
      });
      if (!res.ok) {
        throw new Error("Failed to update like");
      }
      const data = await res.json();
      // sync UI with server count
      console.log(data.likes);
      countEl.textContent = data.likes;
    } catch (err) {
      // Revert on error
      console.error(err);
      btn.classList.toggle("liked");
      countEl.textContent = current;
      alert("Could not update like. Try again.");
    }
  }

  // --------- Comment modal logic ----------
  const commentModal = document.getElementById("comment-modal");
  const commentsList = document.getElementById("comments-list");
  const commentForm = document.getElementById("comment-form");
  const commentTextarea = document.getElementById("comment-text");
  const closeModalBtn = document.getElementById("close-comment-modal");
  // Assume you also have a modal backdrop with class 'comment-modal-backdrop'
  let activePostIdForComment = null;
  let commentCountEl = null;

  function openCommentModal(postId, countEl) {
    activePostIdForComment = postId;
    commentCountEl = countEl;
    commentsList.innerHTML = "<div class='loading'>Loading comments...</div>";
    commentTextarea.value = "";
    commentModal.style.display = "block";
    document.body.style.overflow = "hidden";

    fetch(`/posts/${postId}`)
      .then((r) => r.json())
      .then((post) => {
        renderComments(post.comments || []);
      })
      .catch((err) => {
        console.error(err);
        commentsList.innerHTML = "<div class='error'>Could not load comments.</div>";
      });
  }

  function closeCommentModal() {
    commentModal.style.display = "none";
    document.body.style.overflow = "";
    activePostIdForComment = null;
    commentsList.innerHTML = "";
  }

  function renderComments(comments) {
    if (!comments.length) {
      commentsList.innerHTML = "<div class='no-comments'>No comments yet. Be the first!</div>";
      return;
    }
    commentsList.innerHTML = "";
    comments.forEach((c) => {
      const item = document.createElement("div");
      item.className = "comment-item";
      item.innerHTML =
        `<div class="comment-author">${escapeHtml(c.author || "User")}</div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
        <div class="comment-time">${new Date(c.createdAt).toLocaleString()}</div>`;
      commentsList.appendChild(item);
    });
  }

  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = commentTextarea.value.trim();
    if (!text || !activePostIdForComment) return;

    // optimistic: append comment locally
    const optimistic = { author: "You", text, createdAt: new Date().toISOString() };
    // Prepare previous comments to restore on failure
    const prev = commentsList.innerHTML;

    // Collect current items from DOM
    const prevComments = Array.from(commentsList.children)
      .filter((c) => c.classList.contains("comment-item"))
      .map((c) => ({
        author: c.querySelector(".comment-author")?.textContent || "",
        text: c.querySelector(".comment-text")?.textContent || "",
        createdAt: c.querySelector(".comment-time")?.textContent || ""
      }));

    renderComments([optimistic, ...prevComments]);

    try {
      const res = await fetch(`/posts/${activePostIdForComment}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      const data = await res.json();
      // update UI with server comments & count
      renderComments(data.comments || []);
      if (commentCountEl) commentCountEl.textContent = data.comments.length;
      commentTextarea.value = "";
    } catch (err) {
      console.error(err);
      alert("Could not post comment. Try again.");
      // revert optimistic view
      commentsList.innerHTML = prev;
    }
  });

  closeModalBtn.addEventListener("click", closeCommentModal);
  document.querySelector(".comment-modal-backdrop").addEventListener("click", closeCommentModal);

  function handleCommentClick(e) {
    const btn = e.currentTarget;
    const postId = btn.dataset.postId;
    const countEl = btn.querySelector(".comment-count");
    openCommentModal(postId, countEl);
  }

  // --------- Share logic ----------
  async function handleShareClick(e) {
    const btn = e.currentTarget;
    const postId = btn.dataset.postId;
    const postUrl = btn.dataset.postUrl || `${location.origin}/posts/${postId}`;

    // Try Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this reel",
          text: "Seen this? Thought you'd like it.",
          url: postUrl,
        });
      } catch (err) {
        // user canceled or share failed
        console.log("Share canceled or failed", err);
      }
      return;
    }

    // fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(postUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Clipboard failed", err);
      // fallback 2: open new window with link
      window.open(postUrl, "_blank");
    }
  }

  // helper: escape HTML to avoid XSS when inserting innerHTML
  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
