const commentHeart = document.querySelectorAll(".comment-heart");
const commentInput = document.getElementById("message-input");
const postButton = document.querySelector(".overlaypost-button");
currentPostID = null;

async function postOverlay(
  url,
  id,
  caption,
  time,
  author,
  liked,
  saved,
  currUser
) {
  // console.log(liked, saved);
  currentPostID = id;

  document.getElementById("socialDropdown").style.display = "none";
  document.getElementById("maindiv").style.display = "grid";
  document.getElementById("maindiv").style.opacity = "1";
  const savedBtn = document.getElementById("savedBtn");
  const likedBtn = document.getElementById("likedBtn");
  if (saved === "false") {
    savedBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>`;
    savedBtn.setAttribute("data-saved", "false");
  } else {
    savedBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/></svg>`;
    savedBtn.setAttribute("data-saved", "true");
  }
  if (liked === "false") {
    likedBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>`;
    likedBtn.setAttribute("data-liked", "false");
  } else {
    likedBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>`;
    likedBtn.setAttribute("data-liked", "true");
  }

  // checking ...
  document.getElementById("check123").value = id;
  document.getElementById("userLogged").value = currUser;

  const overlayImage = document.getElementById("overlayImage");
  if (overlayImage) {
    overlayImage.src = url;
  }

  const postAuthor = document.getElementById("postAuthor");
  postAuthor.innerHTML = `<a href="/profile/${author}" style="text-decoration: none; color: white;">${author}</a>`;
  const overlayPostCaption = document.getElementById("overlayPostCaption");
  if (caption) {
    overlayPostCaption.innerHTML = caption;
  } else {
    overlayPostCaption.innerHTML = "";
  }
  const overlayPostTime = document.getElementById("overlayPostTime");
  overlayPostTime.innerHTML = timeAgo(new Date(time));
  fetch_comment(id);
}

commentInput.addEventListener("input", function () {
  if (this.value.trim() !== "") {
    postButton.classList.remove("disabled");
  } else {
    postButton.classList.add("disabled");
  }
});

const emojiBtn = document.getElementById("emoji-btn");
const emojiPicker = document.getElementById("emoji-picker");
const messageInput = document.getElementById("message-input");

emojiBtn.addEventListener("click", () => {
  emojiPicker.style.display =
    emojiPicker.style.display === "none" ? "block" : "none";
});

emojiPicker.addEventListener("emoji-click", (e) => {
  messageInput.value += e.detail.unicode;
  postButton.classList.remove("disabled");
});

emojiPicker.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    emojiPicker.style.display = "none";
  }
});

document.querySelectorAll(".action-icon").forEach((ele) => {
  const trig = ele.getAttribute("name");
  ele.addEventListener("click", async function () {
    if (trig === "like") {
      const post_id = document.getElementById("check123").value;
      const liked = this.getAttribute("data-liked") === "true";
      await fetch(`/post/liked/${post_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            if (!liked) {
                this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>`;
                this.setAttribute("data-liked", "true");
            } else {
                this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>`;
                this.setAttribute("data-liked", "false");
            }
          }
        });
      // fetch request for like for the backend part is pending
    }
    if (trig === "comment") {
      commentInput.focus();
    }
    if (trig === "share") {
      const post_id = document.getElementById("check123").value;
      shareTo(post_id);
    }
    if (trig === "save") {
      const post_id = document.getElementById("check123").value;
      const liked = this.getAttribute("data-saved") === "true";
      await fetch("/post/saved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: post_id }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data) {
            if (!liked) {
              this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/></svg>`;
              this.setAttribute("data-saved", "true");
            } else {
              this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>`;
              this.setAttribute("data-saved", "false");
            }
          }
        });
    }
  });
});

async function likeComment(post_id, commUser, cid) {
  const p = document.getElementById("check123").value;
  const d = document.getElementById(`${cid}-${p}`);
  const liked = d.getAttribute("data-liked") === "true";
  await fetch(`/comment/like/${cid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post_id: post_id,
      commUser: commUser,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data) {
        if (!liked) {
          d.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M480-219.5 468-231q-95.13-86.18-157.07-146.09Q249-437 214.22-480.9q-34.79-43.9-48-78.48Q153-593.95 153-628.5q0-64.5 45.5-110t110-45.5q49.47 0 93.98 27.5Q447-729 480-675.5q33.5-53.5 77.75-81T651.5-784q64.5 0 110 45.44Q807-693.11 807-628.69q0 34.73-12.72 68.31-12.71 33.58-47.46 76.92-34.75 43.35-96.9 104.37Q587.77-318.07 490-229l-10 9.5Z"/></svg>`;
          d.setAttribute("data-liked", "true");
        } else {
          d.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M480-219.5 468-231q-95.13-86.18-157.07-146.09Q249-437 214.22-480.9q-34.79-43.9-48-78.48Q153-593.95 153-628.5q0-64.5 45.5-110t110-45.5q49.47 0 93.98 27.5Q447-729 480-675.5q33.5-53.5 77.75-81T651.5-784q64.5 0 110 45.44Q807-693.11 807-628.69q0 34.73-12.72 68.31-12.71 33.58-47.46 76.92-34.75 43.35-96.9 104.37Q587.77-318.07 490-229l-10 9.5Zm0-23.5q91.82-83.57 151.35-141.98t94.84-101.72q35.31-43.3 49.31-76.59 14-33.28 14-65.07 0-58.64-39.86-98.39t-97.89-39.75q-36.25 0-67 15.5t-75.25 60l-35 41h11l-35-41q-45.5-45.5-76.75-60.5t-65.5-15q-57.03 0-97.39 39.75t-40.36 98.44q0 31.82 13.07 63.64t47.25 74.49Q265-447.5 325-388.75 385-330 480-243Zm0-262.5Z"/></svg>`;
          d.setAttribute("data-liked", "false");
        }
      }
    });
}

// --- POST COMMENT FUNCTION ---
async function postComment(postID) {
  const input = document.getElementById("message-input");
  const commentText = input.value.trim();

  if (!commentText) return;

  try {
    const res = await fetch("/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postID, commentText }),
    });

    const data = await res.json();

    if (data.success) {
      input.value = "";

      const commentSection = document.querySelector(".comment-section");

      // Remove "No comments yet..." if it exists
      const emptyMsg = commentSection.querySelector("p");
      if (emptyMsg) emptyMsg.remove();

      // Create a new comment element
      const newComment = document.createElement("div");
      newComment.classList.add("comment");
      newComment.innerHTML = `
        <div class="comment-profile">${data.comment.username
          .charAt(0)
          .toUpperCase()}</div>
        <div class="comment-content">
            <div>
                <p class="comment-username"><a href="/profile/${
                  data.comment.username
                }" style="text-decoration: none; color: white">${
        data.comment.username
      }</a></p>
                <p class="comment-text">${data.comment.text}</p>
            </div>
            <div class="comment-info" data-comment-id="${data.comment._id}">
                <span class="comment-time">${timeAgo(new Date())}</span>
                <span class="comment-reply onclick="replayComment('${
                  data.comment._id
                }', '${postID}')">Replay</span>
                <span id="${
                  data.comment._id
                }-${postID}" class="comment-heart" name="heart-comment" data-liked="false" onclick="likeComment('${postID}','${
        data.comment.username
      }','${data.comment._id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M480-219.5 468-231q-95.13-86.18-157.07-146.09Q249-437 214.22-480.9q-34.79-43.9-48-78.48Q153-593.95 153-628.5q0-64.5 45.5-110t110-45.5q49.47 0 93.98 27.5Q447-729 480-675.5q33.5-53.5 77.75-81T651.5-784q64.5 0 110 45.44Q807-693.11 807-628.69q0 34.73-12.72 68.31-12.71 33.58-47.46 76.92-34.75 43.35-96.9 104.37Q587.77-318.07 490-229l-10 9.5Zm0-23.5q91.82-83.57 151.35-141.98t94.84-101.72q35.31-43.3 49.31-76.59 14-33.28 14-65.07 0-58.64-39.86-98.39t-97.89-39.75q-36.25 0-67 15.5t-75.25 60l-35 41h11l-35-41q-45.5-45.5-76.75-60.5t-65.5-15q-57.03 0-97.39 39.75t-40.36 98.44q0 31.82 13.07 63.64t47.25 74.49Q265-447.5 325-388.75 385-330 480-243Zm0-262.5Z"/></svg>
                </span>
            </div>
        </div>
      `;
      commentSection.appendChild(newComment);
    } else {
      alert(data.message || "Failed to post comment.");
    }
  } catch (err) {
    console.error("Error posting comment:", err);
    alert("Something went wrong while posting your comment.");
  }
}

function replyComment(commentId, postID) {
  // Select the comment-info div of the clicked comment
  const div = document.querySelector(
    `.comment-info[data-comment-id="${commentId}"]`
  );
  if (!div || div.querySelector(".reply-input")) return; // Prevent multiple inputs

  // Create input field
  const replyInput = document.createElement("input");
  replyInput.type = "text";
  replyInput.placeholder = "Reply to this comment...";
  replyInput.className = "reply-input";

  // Create reply button
  const replyButton = document.createElement("button");
  replyButton.textContent = "Reply";
  replyButton.className = "reply-button";

  // Create cancel button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.className = "cancel-button";

  // Handle Reply
  replyButton.onclick = () => {
    const replyText = replyInput.value.trim();
    if (replyText === "") return; // prevent empty replies
    replyToComment(commentId, replyText, postID);
    cleanup();
  };

  // Handle Cancel
  cancelButton.onclick = cleanup;

  // Helper to remove input + buttons
  function cleanup() {
    replyInput.remove();
    replyButton.remove();
    cancelButton.remove();
  }

  // Append elements to comment div
  div.appendChild(replyInput);
  div.appendChild(replyButton);
  div.appendChild(cancelButton);

  // Autofocus on input
  replyInput.focus();
}

function replyToComment(commentId, reply, postID) {
  fetch("/userpost_reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commentId: commentId,
      reply: reply,
      postID: postID,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data) {
        // console.log(data);
        fetch_comment(postID);
      }
    });
}

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
    if (count >= 1) return `${count}${unit.slice(0, 2)}`;
  }
  return "just now";
}

async function fetch_comment(postID) {
  await fetch("/userpost_comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postID }),
  })
    .then((res) => res.json())
    .then((data) => {
      const commentSection = document.querySelector(".comment-section");
      commentSection.innerHTML = "";
      const currUser = document.getElementById("userLogged").value;

      data.forEach((comment) => {
        const [mainComment, replies] = comment;

        let heartIcon = mainComment.likes.includes(currUser)
          ? `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M480-219.5 468-231q-95.13-86.18-157.07-146.09Q249-437 214.22-480.9q-34.79-43.9-48-78.48Q153-593.95 153-628.5q0-64.5 45.5-110t110-45.5q49.47 0 93.98 27.5Q447-729 480-675.5q33.5-53.5 77.75-81T651.5-784q64.5 0 110 45.44Q807-693.11 807-628.69q0 34.73-12.72 68.31-12.71 33.58-47.46 76.92-34.75 43.35-96.9 104.37Q587.77-318.07 490-229l-10 9.5Z"/></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="m480-243-10-9.5q-95-87-155-145.5T214-481q-34-43-47-77.5t-13-69.5q0-59 40-99t97-40q36 0 67 15.5t76 61.5l46 51 46-51q45-46 76-61.5t67-15.5q57 0 97 40t40 99q0 35-13.5 70T745-481q-34 42-94 100.5T490-252l-10 9Zm0-53q91-83 149-140.5t93-99.5q34-42 47-74t13-63q0-49-32-81t-79-32q-33 0-61 14t-64 57l-48 55-48-55q-36-43-64.5-57T323-786q-47 0-79 32t-32 81q0 31 13 63t47 74q35 42 93 99.5T480-296Z"/></svg>`;

        const repliesHTML = replies
          .map(
            (reply) => `
                <div class="comment-reply-block">
                    <span class="reply-profile">
                        <a href="/profile/${
                          reply.username
                        }" style="text-decoration: none;">${reply.username}</a>
                    </span>
                    <span>${reply.text}</span>
                    <span>${timeAgo(new Date(reply.createdAt))}</span>
                </div>
            `
          )
          .join("");

        const commentHTML = `
                <div class="comment-profile">${mainComment.username
                  .charAt(0)
                  .toUpperCase()}</div>
                <div class="comment-content">
                    <div>
                        <p class="comment-username">
                            <a href="/profile/${
                              mainComment.username
                            }" style="text-decoration: none; color: white">
                                ${mainComment.username}
                            </a>
                        </p>
                        <p class="comment-text">${mainComment.text}</p>
                    </div>
                    <div class="comment-info" data-comment-id="${
                      mainComment._id
                    }">
                        <span class="comment-time">${timeAgo(
                          new Date(mainComment.createdAt)
                        )}</span>
                        <span class="comment-reply" onclick="replyComment('${
                          mainComment._id
                        }', '${postID}')">Reply</span>
                        <span id="${
                          mainComment._id
                        }-${postID}" class="comment-heart" name="heart-comment" data-liked="${mainComment.likes.includes(
          currUser
        )}" onclick="likeComment('${postID}','${mainComment.username}','${
          mainComment._id
        }')">
                            ${heartIcon}
                        </span>
                    </div>
                    <div class="comment-replies">${repliesHTML}</div>
                </div>
            `;

        let newComment = document.createElement("div");
        newComment.className = "comment";
        newComment.innerHTML = commentHTML;

        commentSection.appendChild(newComment);
      });
    });
}

// window.onload = function () {
//     const postID = document.getElementById("check123").value;
//     console.log(postID);
//     fetch_comment(postID);
// }
