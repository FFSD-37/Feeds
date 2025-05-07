function openpostdropdown(e) {
  document.getElementById("socialDropdown").style.display = "block";
}

function postOverlay(e) {
  document.getElementById("socialDropdown").style.display = "none";
  document.getElementById("maindiv").style.display = "grid";
  document.getElementById("maindiv").style.opacity = "1";
}

// document.getElementById("comment-button-post").addEventListener("click", (e) => {
//   document.getElementById("message-input").focus();
// });

document.addEventListener('keydown', (e) => {
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
  document.getElementById("report-modal").classList.add("show");
}

function closeReportModal(e) {
  document.getElementById("report-modal").classList.remove("show");
}

function selectReason(reason) {
  alert("You selected: " + reason);
  closeReportModal();
}

// async function postDisplay(createdAt){
//   const post=await fetch(`/post/suggestedPost/get?createdAt=${createdAt}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     credentials: 'include'
//   })
//   const postData=await post.json();
//   console.log(postData);
//   return postData;
// }

//  // flag so we don’t double‑fetch
//  let isLoading = false;
//  // if server tells us there are no more posts, we can turn off scrolling
//  let noMorePosts = false;

//  window.addEventListener('scroll', () => {
//    if (isLoading || noMorePosts) return;

//    // when scrolled within 100px of bottom
//    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
//      isLoading = true;

//      // find the last .post element’s data-createdat
//      const posts = document.querySelectorAll('.post');
//      if (!posts.length) {
//        isLoading = false;
//        return;
//      }
//      const last = posts[posts.length - 1];
//      const lastCreatedAt = last.getAttribute('data-createdat');

//      // call your function
//      postDisplay(lastCreatedAt)
//        .then(newPosts => {
//          if (!newPosts || newPosts.length === 0) {
//            noMorePosts = true;
//            return;
//          }
//          const container = document.getElementById('posts-container');
//          newPosts.forEach(p => {
//            const div = document.createElement('div');
//            div.classList.add('post');
//            div.setAttribute('data-createdat', p.createdAt);
//            div.innerHTML = `
//              <h2>${p.title}</h2>
//              <p>${p.body}</p>
//              <small>Posted at ${new Date(p.createdAt).toLocaleString()}</small>
//            `;
//            container.appendChild(div);
//          });
//        })
//        .catch(err => console.error('fetch error', err))
//        .finally(() => {
//          isLoading = false;
//        });
//    }
//  });

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
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
    if (count >= 1) return `${count}${unit.charAt(0)}`; // e.g. 3m, 2h, 7d, 3w
  }
  return 'just now';
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('postsContainer');
  let isLoading = false;
  let noMorePosts = false;

  async function fetchPosts(afterCreatedAt) {
    const res = await fetch(
      `/post/suggestedPost/get?createdAt=${encodeURIComponent(afterCreatedAt)}`,
      { method: 'GET', credentials: 'include' }
    );
    const { posts } = await res.json();
    return posts;
  }

  container.addEventListener('scroll', async () => {
    if (isLoading || noMorePosts) return;
    if (container.scrollTop + container.clientHeight < container.scrollHeight - 100) return;

    isLoading = true;
    const postsEls = container.querySelectorAll('.post');
    if (postsEls.length === 0) { isLoading = false; return; }

    const lastCreatedAt = postsEls[postsEls.length - 1].dataset.createdat;
    try {
      const newPosts = await fetchPosts(lastCreatedAt);
      if (!newPosts || newPosts.length === 0) {
        noMorePosts = true;
        return;
      }
      newPosts.forEach(p => {
        const div = document.createElement('div');
        div.classList.add('post');
        // keep the same data attribute for pagination
        div.dataset.createdat = new Date(p.createdAt).toISOString();

        div.innerHTML = `
          <div class="post-header">
            <div class="user-avatar"></div>
            <a href="/profile/${p.author}" style="text-decoration:none;color:black">
              <span class="username">${p.author}</span>
            </a>
            <span class="post-time">• ${timeAgo(new Date(p.createdAt))}</span>
            <div class="post-options" onclick="openpostdropdown()">
              <a style="text-decoration:none;color:black">•••</a>
            </div>
            <div class="dropdown-menu" id="socialDropdown">
              <div class="menu-item danger" onclick="openReportModal()">
                Report
              </div>
              <div class="menu-item normal">Add to favorites</div>
              <div class="menu-item normal" onclick="postOverlay()">
                Go to post
              </div>
              <div class="menu-item normal">Share to...</div>
              <div class="menu-item normal">Copy link</div>
              <div class="menu-item normal">About this account</div>
              <div class="menu-item normal" onclick="closepostdropdown()">
                Cancel
              </div>
            </div>
          </div>
          <% if(post.type === "Img") { %>
          <div class="post-content" onclick="postOverlay()">
            <img
              class="post-on-home-page"
              src="<%= post.url %>&&tr=w-640,h-640"
            />
          </div>
        <% } else { %>
          <div class="post-content" onclick="postOverlay()">
            <video
              class="post-on-home-page"
              src="<%= post.url %>&&tr=w-640,h-640"
              muted
              loop
              preload="metadata"
            ></video>
          </div>          
        <% } %>
          <div class="post-actions">
            <div class="action-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path
                  d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Zm-38-543q-29-41-62-62.5T300-774q-60 0-100 40t-40 100q0 52 37 110.5T285.5-410q51.5 55 106 103t88.5 79q34-31 88.5-79t106-103Q726-465 763-523.5T800-634q0-60-40-100t-100-40q-47 0-80 21.5T518-690q-7 10-17 15t-21 5q-11 0-21-5t-17-15Zm38 189Z"
                />
              </svg>
            </div>
            <div
              class="action-icon"
              onclick="postOverlay()"
              id="comment-button-post"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path
                  d="m240-240-92 92q-19 19-43.5 8.5T80-177v-623q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240Zm-34-80h594v-480H160v525l46-45Zm-46 0v-480 480Z"
                />
              </svg>
            </div>
            <div class="action-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path
                  d="M792-443 176-183q-20 8-38-3.5T120-220v-520q0-22 18-33.5t38-3.5l616 260q25 11 25 37t-25 37ZM200-280l474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"
                />
              </svg>
            </div>
            <div class="last-action-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path
                  d="m480-240-168 72q-40 17-76-6.5T200-241v-519q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v519q0 43-36 66.5t-76 6.5l-168-72Zm0-88 200 86v-518H280v518l200-86Zm0-432H280h400-200Z"
                />
              </svg>
            </div>
          </div>
        `;
        container.appendChild(div);
      });
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      isLoading = false;
    }
  });
});

document.querySelectorAll('.post-on-home-page').forEach(video => {
  video.addEventListener('mouseenter', () => video.play());
  video.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0; // optional: reset to start
  });
});