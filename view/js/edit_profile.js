document.getElementById('photoInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profilePic').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function editField(fieldId) {
    let field = document.getElementById(fieldId);

    if (field.tagName === "SELECT") {
        field.disabled = false;
    } else if (field.tagName === "TEXTAREA" || field.tagName === "INPUT") {
        field.readOnly = false;
        field.style.backgroundColor = "#fff";
        field.focus();
    } else if (fieldId === "linksContainer") {
        let links = document.querySelectorAll(".profile-link");
        links.forEach(link => link.readOnly = false);
    }
}

function addLink() {
    const linksContainer = document.getElementById('linksContainer');
    const existingLinks = document.querySelectorAll('.profile-link').length;

    if (existingLinks < 3) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('field-container');

        const newInput = document.createElement('input');
        newInput.type = 'url';
        newInput.className = 'profile-link';
        newInput.placeholder = 'Enter link';
        newInput.readOnly = true;

        const newButton = document.createElement('a');
        newButton.innerText = 'EDIT';
        newButton.onclick = function () { editField('linksContainer'); };

        newDiv.appendChild(newInput);
        newDiv.appendChild(newButton);
        linksContainer.appendChild(newDiv);
    } else {
        alert("You can only add up to 3 links.");
    }
}

function openOverlay() {
    event.preventDefault();
    document.getElementById("overlay").classList.add("show-overlay");
}

function closeOverlay(event) {
    const overlay = document.getElementById("overlay");
    const overlayContent = document.querySelector(".overlay-content");
    if (event.target === overlay) {
        overlay.classList.remove("show-overlay");
    }
}

document.getElementById("overlay").addEventListener("click", closeOverlay);

const showError2 = (input, isValid) => {
    const errorele = input.closest(".checkbox-group").querySelector(".error-message");

    if (!isValid) {
        errorele.style.display = "block";
        input.classList.add("error");
    } else {
        errorele.style.display = "none";
        input.classList.remove("error");
    }
};

async function getAuth() {
    let res = await fetch('/imagKitauth')
    return res;
}

const imageupload = document.getElementById("photoInput");

imageupload.addEventListener('change', handleUpload);
async function handleUpload() {
    const authResponse = await getAuth();

    if (!authResponse.ok) throw new Error("Failed to fetch auth details");

    const authData = await authResponse.json();
    var imagekit = new ImageKit({
        publicKey: "public_wnJ6iUhf4XCA3x6A/XV68fTEU4Y=",
        urlEndpoint: "https://ik.imagekit.io/FFSD0037/",
    });

    var file = document.getElementById("photoInput");
    imagekit.upload({
        file: file.files[0],
        fileName: file.files[0].name || "sample-file.jpg",
        tags: ["tag1"],
        responseFields: "tags",
        token: authData.token,
        signature: authData.signature,
        expire: authData.expire,
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            document.getElementById("profileImageUrl").value = result.url;
            console.log(result);
        }
    });
}