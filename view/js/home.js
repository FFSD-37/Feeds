function openpostdropdown(e){
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

function closepostdropdown(e){
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

document.addEventListener('DOMContentLoaded', () => {console.log("hello");

  const container = document.getElementById('postsContainer');  // match your HTML
  let isLoading = false;
  let noMorePosts = false;

  async function postDisplay(createdAt) {
    const res = await fetch(
      `/post/suggestedPost/get?createdAt=${createdAt}`,
      { method: 'GET', credentials: 'include' }
    );
    const { posts } = await res.json();
    return posts;
  }

  container.addEventListener('scroll', async () => {console.log("hello2");
  
    if (isLoading || noMorePosts) return;
    if (container.scrollTop + container.clientHeight < container.scrollHeight - 100) {
      return;
    }

    isLoading = true;
    const posts = container.querySelectorAll('.post');
    if (posts.length === 0) {
      isLoading = false;
      return;
    }

    const lastCreatedAt = posts[posts.length - 1].dataset.createdat;
    try {
      const newPosts = await postDisplay(lastCreatedAt);
      if (!newPosts || newPosts.length === 0) {
        noMorePosts = true;
        return;
      }
      newPosts.forEach(p => {
        const div = document.createElement('div');
        div.classList.add('post');
        div.dataset.createdat = new Date(p.createdAt).toISOString();
        div.innerHTML = `
          <img src="${p.url}&&tr=w-640,h-640" alt="Post image" />
          <p>${p.content}</p>
          <p>${p.author}</p>
          <small>Posted at ${new Date(p.createdAt).toLocaleString()}</small>
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
