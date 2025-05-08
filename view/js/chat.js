const currentUser = document.querySelector('.me').textContent;
document.querySelector('.me').remove();
let activeUser;

const userList = document.getElementById("user-list");
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const toggleBtn = document.getElementById("toggle-theme");
const body = document.getElementById("body");
const users = document.querySelectorAll('.user');

users.forEach(user => {
  user.addEventListener('click', () => {
    activeUser = user.children[1].textContent;
    loadMessages(activeUser);
  })
})

const socket = io("http://localhost:8000", {
  withCredentials: true
});

socket.on("connect", () => {
  console.log("Connected to server");
});

function appendMessage(text, type, time) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerHTML = `<div>${text}</div><div class="timestamp">${time}</div>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function loadMessages(activeUser) {
  chatBox.innerHTML = "";
  const res = await fetch(
    `http://localhost:3000/chat/${activeUser}`,
    { method: "GET", credentials: "include", headers: { 'Content-Type': 'application/json' } }
  );
  let messages = await res.json(); console.log(messages.chats);
  messages = messages.chats;
  if (!messages.length) return;
  messages
    .filter((m) => m.from === activeUser || m.from === currentUser)
    .forEach((m) =>
      appendMessage(
        m.text,
        m.from === currentUser ? "sent" : "received",
        m.createdAt
      )
    );
}

sendBtn.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (!text) return;
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  socket.emit("sendMessage", {
    to: activeUser,
    text,
    time,
  });
  appendMessage(text, "sent", time);
  console.log(activeUser);

  messageInput.value = "";
});

socket.on("receiveMessage", (msg) => {
  if (msg.from === activeUser) {
    appendMessage(msg.text, "received", msg.time);
  }
});

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  document.querySelector(".chatList").classList.toggle("dark");
});

const emojiBtn = document.getElementById("emoji-btn");
const emojiPicker = document.getElementById("emoji-picker");

emojiBtn.addEventListener("click", () => {
  emojiPicker.style.display =
    emojiPicker.style.display === "none" ? "block" : "none";
});

emojiPicker.addEventListener("emoji-click", (e) => {
  messageInput.value += e.detail.unicode;
});