async function getAuth() {
    let res = await fetch("/imagKitauth");
    return res;
}

document.addEventListener("DOMContentLoaded", () => {
    const emojiButton = document.getElementById("emoji-button");
    const emojiPicker = document.getElementById("emoji-picker");
    const captionInput = document.getElementById("caption");
    const dataDiv = document.getElementsByClassName("image-create-post3")[0];
    const type = dataDiv.dataset.type;
    const keys = Object.keys(localStorage).filter(k => k.startsWith('uploadedFile_'));
	if (!keys.length) return;
    
	keys.forEach(key => {
		const {data:base64} = JSON.parse(localStorage.getItem(key));
		const img = type==="image"?document.createElement('img'):document.createElement('video');
		img.src = base64;
		img.id = "post-image";
        img.className = "post-image";
        dataDiv.appendChild(img);
	});

    emojiButton.addEventListener("click", () => {
        emojiPicker.style.display =
            emojiPicker.style.display === "none" ? "block" : "none";
    });

    emojiButton.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            emojiPicker.style.display =
                emojiPicker.style.display === "none" ? "none" : "none";
        }
    });

    emojiPicker.addEventListener("emoji-click", (event) => {
        captionInput.value += event.detail.unicode;
    });

    document
        .querySelector(".share-button")
        .addEventListener("click", async (e) => {
        e.preventDefault();

        const loadingOverlay = document.getElementById("loading-overlay");
        loadingOverlay.style.display = "flex"; // show loading spinner

        try {
            const caption = document.getElementById("caption").value;
            const location = document.getElementById("location").value;
            const { data: bas64File, name } = JSON.parse(keys.map(key => localStorage.getItem(key))[0]);
            
            const authResponse = await getAuth();
            const authData = await authResponse.json();

            var imagekit = new ImageKit({
                publicKey: "public_wbpheuS28ohGGR1W5QtPU+uv/z8=",
                urlEndpoint: "https://ik.imagekit.io/lidyx2zxm/",
            });

            imagekit.upload({
                file: bas64File,
                fileName: name,
                tags: ["tag1"],
                responseFields: "tags",
                token: authData.token,
                signature: authData.signature,
                expire: authData.expire,
            }, async function (err, result) {
                try {
                    if (err) {
                        console.error(err);
                        alert("Upload failed. Please try again.");
                        loadingOverlay.style.display = "none";
                        return;
                    }

                     await fetch("/shareFinalPost", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ caption, avatar: result.url, type: type === "image" ? "Img" : "Reels" }),
                        credentials: 'include'
                    });
                } catch (error) {
                    console.error(error);
                    alert("Unexpected error occurred.");
                } finally {
                    loadingOverlay.style.display = "none"; // hide spinner after completion
                }
            });

        } catch (error) {
            console.error(error);
            alert("An error occurred during upload.");
            loadingOverlay.style.display = "none";
        }

            const commentsEnabled =
                document.getElementById("toggle-comments").checked;
            alert(
                `Post shared!\nCaption: ${caption}\nLocation: ${location}\nComments: ${commentsEnabled ? "On" : "Off"
                }`
            );
        });
});