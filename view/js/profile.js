function showTab(tabName) {
    document.querySelectorAll('.posts-grid').forEach(grid => {
        grid.classList.add('hidden');
    });
    document.querySelectorAll('.nav-item2').forEach(header => {
        header.classList.remove('active');
    });
    document.getElementById(tabName).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

}

function openSettings() {
    window.location.href = '/settings';
}

function followUser(uname){
    fetch(`/follow/${uname}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}
    })
    .then(res => res.json())
    .then(data => {
        if (data.success){
            console.log("follow success!!");
            location.reload();
        }
        else {
            alert(data.message || "Follow Failed");
        }
    })
    .catch(err => console.log(err));
}

function unfollowUser(uname){
    fetch(`/unfollow/${uname}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"}
    })
    .then(res => res.json())
    .then(data => {
        if (data.success){
            console.log("unfollow success!!");
            location.reload();
        }
        else {
            alert(data.message || "unfollow failed");
        }
    })
    .catch(err => console.log(err));
}