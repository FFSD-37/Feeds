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
const chatControls = document.getElementById("chat-controls");

users.forEach(user => {
  user.addEventListener('click', () => {
    users.forEach(u => u.classList.remove('active'));
    user.classList.add('active');
    activeUser = user.children[1].textContent;
    chatControls.style.display = "block";
    loadMessages(activeUser);
  });
});

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

  let messages = await res.json();
  messages = messages.chats;

  if (!messages.length) {
    chatBox.innerHTML = `
      <div style="text-align: center; margin-top: 50px; color: var(--fg); opacity: 0.5;">
        No messages yet. Start the conversation!
      </div>`;
    return;
  }

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
  if (!text || !activeUser) return;

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
  messageInput.value = "";
});


socket.on("receiveMessage", (msg) => {
  if (msg.from === activeUser) {
    appendMessage(msg.text, "received", msg.time);
  }
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && emojiPicker.style.display === "block") {
    emojiPicker.style.display = "none";
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