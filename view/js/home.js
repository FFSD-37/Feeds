function openpostdropdown(e) {
  document.getElementById("socialDropdown").style.display = "block";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const reportModal = document.getElementById("report-modal");
    if (reportModal.classList.contains("show")) {
      reportModal.classList.remove("show");
      return;
    }
    const overlay = document.getElementById("maindiv");
    if (overlay.style.display === "grid") {
      overlay.style.display = "none";
      document.body.style.overflow = "";
      return;
    }
    const dropdown = document.getElementById("socialDropdown");
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
      return;
    }
  }
});

function closepostdropdown(e) {
  document.getElementById("socialDropdown").style.display = "none";
}

function openReportModal(e) {
  console.log("Event: " + e);
  document.getElementById("report-modal").classList.add("show");
  document.getElementById("postIdForReportPost").value = e;
}

function closeReportModal(e) {
  document.getElementById("report-modal").classList.remove("show");
  document.getElementById("postIdForReportPost").value = "";
}

async function selectReason(reason) {
  await fetch("/report_post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      reason,
      post_id: document.getElementById("postIdForReportPost").value
    })
  }).then((res) => {
    return res.json();
  }).then((data) => {
      alert("Your report has been received successfully. We'll review it shortly.");
  })
  closeReportModal();
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = {
    year: 31536000,
    mon: 2592000,
    w: 604800,
    d: 86400,
    h: 3600,
    m: 60,
  };
  for (const [unit, sec] of Object.entries(intervals)) {
    const count = Math.floor(seconds / sec);
    if (count >= 1) return `${count} ${unit}`;
  }
  return "just now";
}

async function reelOpen(id){
  window.location.href = "/reels";
  // implementation of particular reel open
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("postsContainer");
  let isLoading = false;
  let noMorePosts = false;

  async function fetchPosts(afterCreatedAt) {
    const res = await fetch(
      `/post/suggestedPost/get?createdAt=${encodeURIComponent(afterCreatedAt)}`,
      { method: "GET", credentials: "include" }
    );
    const { posts } = await res.json();
    return posts;
  }

  container.addEventListener("scroll", async () => {
    if (isLoading || noMorePosts) return;
    if (
      container.scrollTop + container.clientHeight <
      container.scrollHeight - 100
    )
      return;

    isLoading = true;
    const postsEls = container.querySelectorAll(".post");
    if (postsEls.length === 0) {
      isLoading = false;
      return;
    }

    const lastCreatedAt = postsEls[postsEls.length - 1].dataset.createdat;
    try {
      const newPosts = await fetchPosts(lastCreatedAt);
      if (!newPosts || newPosts.length === 0) {
        noMorePosts = true;
        return;
      }
      newPosts.forEach((p) => {
        let div = document.createElement("div");
        div.classList.add("post");
        div.dataset.createdat = new Date(p.createdAt).toISOString();
        let html = `
          <div class="post-header">
            <a href="/profile/${p.author}" style="text-decoration:none;color:black">
              <span class="username">${p.author}</span>
            </a>
            <span class="post-time">• ${timeAgo(new Date(p.createdAt))}</span>
            <div class="post-options" onclick="openpostdropdown()">
              <a style="text-decoration:none;color:black">•••</a>
            </div>
            <div class="dropdown-menu" id="socialDropdown">
              <div class="menu-item danger" onclick="openReportModal('<%= post.id %>')">
                Report
              </div>
              <div class="menu-item normal" onclick="postOverlay('${p.url}','${p.id}', '${p.content}', '${p.createdAt}', '${p.author}', '${p.saved}', '${p.saved}', '${p.currUser}')">
                Go to post
              </div>
              <div class="menu-item normal" id="btnShareProfile" onclick="shareTo('${p.id}')">
                Share to...
              </div>
              <div class="menu-item normal" onclick="copyURL('${p.author}')">
                Copy link
              </div>
              <div class="menu-item normal">
                <a href="/settings" style="text-decoration: none; color: white">
                  About this account
                </a>
              </div>
              <div class="menu-item normal" onclick="closepostdropdown()">
                Cancel
              </div>
            </div>
          </div>`;
        
        if (p.type === "Img") {
          html += `
            <div class="post-content" onclick="postOverlay('${p.url}','${p.id}', '${p.content}', '${p.createdAt}', '${p.author}', '${p.saved}', '${p.saved}', '${p.currUser}')">
              <img class="post-on-home-page" src="${p.url}" />
            </div>`;
        } else {
          html += `
            <div class="post-content" onclick="reelOpen('${p.url}')">
              <video class="post-on-home-page" src="${p.url}" loop preload="metadata"></video>
            </div>`;
        }
        
        if ('<%- type %>' !== "Kids" && '<%- type %>' !== "Student") {
          html += `
            <div class="post-actions">
              <div class="action-icon">`
          
          if (p.liked){
            html += `<i class="fas fa-heart" onclick="likePost('${p.id}', this)"></i></div>`;
          }else{
            html +=
                `<i class="far fa-heart" onclick="likePost('${p.id}', this)"></i>
              </div>`;
          }
          if (p.type === "Img") {
            html += `
              <div class="action-icon" onclick="postOverlay('${p.url}','${p.id}', '${p.content}', '${p.createdAt}', '${p.author}', '${p.saved}', '${p.saved}', '${p.currUser}')" id="comment-button-post">
                <i class="far fa-comment"></i>
              </div>`;
          }
          
          html += `
              <div class="action-icon">
                <i class="fas fa-share" onclick="shareTo('${p.id}')"></i>
              </div>
            </div>`;
        }
        
        div.innerHTML = html;
        container.appendChild(div);
    });      
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      isLoading = false;
    }
  });
});

document.querySelectorAll(".post-on-home-page").forEach((video) => {
  video.addEventListener("mouseenter", () => video.play());
  video.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".post-time").forEach((el) => {
    const createdAt = el.dataset.created;
    el.textContent = `• ${timeAgo(new Date(createdAt))}`;
  });
});

async function likePost(postId, el) {
  const icon = el.tagName === "I" ? el : el.querySelector("i");

  try {
    const res = await fetch(`/post/liked/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await res.json();

    if (data.success) {
      icon.classList.toggle("far");       // Outline heart
      icon.classList.toggle("fas");       // Solid heart
      icon.classList.toggle("text-red");
    } else {
      alert(data.err || "Unable to like post.");
    }
  } catch (error) {
    console.error("Like error:", error);
  }
}

async function savePost(postId, el) {
  try {
    const res = await fetch(`/saved/${postId}`, {
      method: 'POST',
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      const icon = el.tagName === "I" ? el : el.querySelector("i");
      icon.classList.toggle("saved"); // You can define this class in CSS
    } else {
      alert(data.err || "Unable to save post.");
    }
  } catch (err) {
    console.error("Save error:", err);
  }
}

async function RenderAds() {
  try {
    const res = await fetch("/ads", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();

    const leftSection = document.querySelector(".left-section");
    if (!leftSection) return;

    const footer = leftSection.querySelector(".footer");
    if (!footer) return;

    // Remove old ads if already rendered
    leftSection.querySelectorAll(".ads-grid").forEach(el => el.remove());

    if (data.allAds && data.allAds.length > 0) {
      const gridContainer = document.createElement("div");
      gridContainer.classList.add("ads-grid");

      data.allAds.forEach(ad => {
        const adDiv = document.createElement("div");
        adDiv.classList.add("ad-card");
        adDiv.innerHTML = `
          <a href="${ad.url}" target="_blank" style="text-decoration:none;color:inherit">
            <video class="ad-video" src="${ad.ad_url}" muted loop autoplay playsinline></video>
          </a>
        `;
        gridContainer.appendChild(adDiv);
      });

      leftSection.insertBefore(gridContainer, footer);
    } else {
      console.warn("No ads found in response.");
    }
  } catch (err) {
    console.error("Error loading ads:", err);
  }
}

window.onload = () => {
  const isPremium = document.getElementById("premiumFlag").value;
  if (!isPremium) {
    RenderAds();
  }
}