document
.getElementById("searchInput")
.addEventListener("keyup", async function () {
  let filter = this.value.toLowerCase();
  let response = await fetch(`/search/${filter}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include'
  });
  
  let {users} = await response.json();
  let peopleList = document.getElementById("peopleList");

  peopleList.innerHTML = '';

  users.forEach((user) => {
    let li = document.createElement('li');
    li.innerHTML = `
      <div class="profile">
        <img src="${user.avatarUrl}" alt="Profile" />
        <div class="info">
          <a href="/profile/${user.username}" 
             style="text-decoration: none; color: black">
            <div><strong>${user.display_name}</strong></div>
            <div>@${user.username}</div>
          </a>
          <div>Followers: ${user.followers}</div>
          <div>Following: ${user.following}</div>
        </div>
      </div>
    `;
    peopleList.appendChild(li);
  });
});