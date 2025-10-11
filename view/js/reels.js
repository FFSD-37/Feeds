// public/js/reels.js (fixed: allows spaces in textarea)

document.addEventListener("DOMContentLoaded", () => {
  // Basic existing video + intersection logic (kept)
  const videos = document.querySelectorAll(".reel-video video");
  let activeVideo = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        videos.forEach(v => { if (v !== video) { v.pause(); v.muted = true; } });
        video.play().catch(() => { video.muted = true; video.play(); });
        activeVideo = video;
      } else if (video === activeVideo) {
        video.pause(); video.muted = true; activeVideo = null;
      }
    });
  }, { threshold: 0.8, rootMargin: '0px' });

  videos.forEach(v => {
    v.controls = false;
    v.addEventListener('click', () => v.paused ? v.play() : v.pause());
    observer.observe(v);
  });

  // Helper: detect if the user is typing in an input/textarea/contenteditable
  function isUserTyping(evt) {
    const active = document.activeElement;
    if (!active) return false;
    const tag = (active.tagName || "").toLowerCase();
    if (tag === 'input' || tag === 'textarea') return true;
    if (active.isContentEditable) return true;
    // also allow if some element has role="textbox"
    if (active.getAttribute && active.getAttribute('role') === 'textbox') return true;
    return false;
  }

  document.addEventListener('keydown', (e) => {
    // If user is typing into an input/textarea/contenteditable, do not intercept the key.
    if (isUserTyping(e)) return;

    if (e.code === 'Space' && activeVideo) {
      e.preventDefault(); // keep preventing default only when not typing
      activeVideo.paused ? activeVideo.play() : activeVideo.pause();
    }
    if (e.key === 'Escape') {
      closeCommentsPanel();
    }
  });

  window.toggleMute = function(button) {
    const video = button.closest('.reel-video').querySelector('video');
    video.muted = !video.muted;
    const icons = button.querySelectorAll('svg');
    icons.forEach((icon) => icon.style.display = icon.classList.contains('mute-icon') ? (video.muted ? 'block' : 'none') : (video.muted ? 'none' : 'block'));
  };

  // --- comment panel logic ---
  const container = document.querySelector('.reels-container');
  const reelsWrap = document.querySelector('.reels-wrap');
  const commentsPanel = document.getElementById('comments-panel');
  const commentsList = document.getElementById('comments-list');
  const commentForm = document.getElementById('comment-form');
  const commentTextarea = document.getElementById('comment-text');
  const commentsBackdrop = document.getElementById('comments-backdrop');
  const closeBtn = document.getElementById('close-comments');
  const commentsCountSmall = document.getElementById('comments-count-small');

  let activePostId = null;

  // Open comments for a post id
  async function openComments(postId) {
    if (!postId) return;
    activePostId = postId;

    // pause active video and clear it so Space won't be captured for play/pause
    if (activeVideo && !activeVideo.paused) {
      try { activeVideo.pause(); } catch(_) {}
    }
    activeVideo = null;

    // shift layout
    container.classList.add('comments-open');
    commentsPanel.setAttribute('aria-hidden', 'false');
    commentsBackdrop.setAttribute('aria-hidden', 'false');

    // show loading state
    commentsList.innerHTML = `<div class="loading" style="padding:12px;color:rgba(255,255,255,0.7)">Loading comments…</div>`;

    try {
      const res = await fetch(`/posts/${postId}`);
      if (!res.ok) throw new Error('Failed to load comments');
      const post = await res.json();
      renderComments(post.comments || []);
      commentsCountSmall.textContent = (post.comments || []).length;
      // focus textarea for convenience (but allow browser to finish animation)
      setTimeout(() => commentTextarea.focus(), 200);
    } catch (err) {
      commentsList.innerHTML = `<div class="error">Could not load comments</div>`;
      console.error(err);
    }
  }

  function closeCommentsPanel() {
    activePostId = null;
    container.classList.remove('comments-open');
    commentsPanel.setAttribute('aria-hidden', 'true');
    commentsBackdrop.setAttribute('aria-hidden', 'true');
    commentsList.innerHTML = '';
    commentTextarea.value = '';
  }

  function renderComments(comments) {
    if (!comments || comments.length === 0) {
      commentsList.innerHTML = `<div class="no-comments" style="padding:12px;color:rgba(255,255,255,0.6)">No comments yet. Be the first to comment!</div>`;
      return;
    }

    // create nodes
    commentsList.innerHTML = '';
    comments.forEach(c => {
      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = `
        <div class="avatar" aria-hidden="true"></div>
        <div class="comment-main">
          <div class="comment-author">${escapeHtml(c.author || 'User')}</div>
          <div class="comment-text">${escapeHtml(c.text)}</div>
          <div class="comment-time">${new Date(c.createdAt || Date.now()).toLocaleString()}</div>
        </div>
      `;
      commentsList.appendChild(item);
    });

    // scroll to top (newest first)
    commentsList.scrollTop = 0;
  }

  // helper to escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // Event delegation for comment-button clicks
  document.addEventListener('click', (ev) => {
    const commentBtn = ev.target.closest('.comment-button');
    if (commentBtn) {
      const pid = commentBtn.dataset.postId;
      openComments(pid);
      ev.preventDefault();
      return;
    }

    const likeBtn = ev.target.closest('.like-button');
    if (likeBtn) {
      handleLikeClick(likeBtn);
      return;
    }

    const shareBtn = ev.target.closest('.share-button');
    if (shareBtn) {
      handleShareClick(shareBtn);
      return;
    }
  });

  // backdrop and close button
  commentsBackdrop.addEventListener('click', closeCommentsPanel);
  closeBtn.addEventListener('click', closeCommentsPanel);

  // posting a comment
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = commentTextarea.value.trim();
    if (!text || !activePostId) return;

    // optimistic UI: push temporary comment
    const optimistic = { author: 'You', text, createdAt: new Date().toISOString() };
    const prevHTML = commentsList.innerHTML;
    // show optimistic at top
    renderComments([optimistic, ...Array.from(commentsList.children).map(el => ({
      author: el.querySelector('.comment-author')?.textContent || '',
      text: el.querySelector('.comment-text')?.textContent || '',
      createdAt: new Date().toISOString()
    }))]);

    try {
      const res = await fetch(`/posts/${activePostId}/comment`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('Failed to post comment');
      const data = await res.json();
      // data.comments expected (server returns updated comments list)
      renderComments(data.comments || []);
      // also update the comment count badge in the reels feed for that post
      updateCommentCountInFeed(activePostId, (data.comments || []).length);
      commentTextarea.value = '';
    } catch (err) {
      console.error(err);
      alert('Could not post comment. Try again.');
      // revert optimistic UI
      commentsList.innerHTML = prevHTML;
    }
  });

  // update comment count shown in feed for a given post id
  function updateCommentCountInFeed(postId, newCount) {
    const selector = `.comment-button[data-post-id="${postId}"] .comment-count`;
    const countEl = document.querySelector(selector);
    if (countEl) countEl.textContent = newCount;
    if (commentsCountSmall) commentsCountSmall.textContent = newCount;
  }

  // simple like handler (if you don't have one - keeps optimistic UX)
  async function handleLikeClick(btn) {
    const postId = btn.dataset.postId;
    const countEl = btn.querySelector('.like-count');
    const currentlyLiked = btn.classList.contains('liked');

    // optimistic toggle
    btn.classList.toggle('liked');
    let current = parseInt(countEl.textContent || '0', 10);
    countEl.textContent = currentlyLiked ? Math.max(0, current - 1) : current + 1;

    try {
      const res = await fetch('/posts/like', { // change to your real endpoint if different
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ reel_id: postId })
      });
      if (!res.ok) throw new Error('like request failed');
      const data = await res.json();
      // sync UI if server returns likes
      if (data.likes !== undefined) countEl.textContent = data.likes;
      if (data.liked !== undefined) {
        if (data.liked) btn.classList.add('liked'); else btn.classList.remove('liked');
      }
    } catch (err) {
      console.error(err);
      // revert
      btn.classList.toggle('liked');
      countEl.textContent = currentlyLiked ? current : Math.max(0, current);
    }
  }

  // simple share handler fallback
  async function handleShareClick(btn) {
    const postUrl = btn.dataset.postUrl || `${location.origin}/posts/${btn.dataset.postId}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Check this reel', url: postUrl }); return; } catch(e) { console.log(e); }
    }
    try {
      await navigator.clipboard.writeText(postUrl);
      alert('Link copied to clipboard');
    } catch (err) {
      window.open(postUrl, '_blank');
    }
  }

}); // DOMContentLoaded end
