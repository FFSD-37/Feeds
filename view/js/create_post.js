// Initialize imagefile as an array
var imagefile = [];

function showPreview(event) {
    if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        var preview = document.getElementById("file-ip-1-preview");
        imagefile.push(event.target.files[0]);
        preview.src = src;
        preview.style.display = "block";

        const lines = document.querySelectorAll(".grid-line");
        lines.forEach((line) => {
            line.style.display = "none";
        });
        const manipulation_buttons = document.querySelector(
            ".post-manipulation-buttons"
        );
        manipulation_buttons.style.display = "flex";
    }
}

async function getAuth() {
    let res = await fetch("/imagKitauth");
    return res;
}

function continueEditing() {
    async function handleUpload() {
        try {
            // Check if we have any images to upload
            if (!imagefile || imagefile.length === 0) {
                console.error("No image selected");
                return;
            }

            const authResponse = await getAuth();
            const authData = await authResponse.json();

            var imagekit = new ImageKit({
                publicKey: "public_wnJ6iUhf4XCA3x6A/XV68fTEU4Y=",
                urlEndpoint: "https://ik.imagekit.io/FFSD0037/",
            });
            const file = imagefile[imagefile.length - 1];

            imagekit.upload(
                {
                    file: file,
                    fileName: file.name || "sample-file.jpg",
                    tags: ["tag1"],
                    responseFields: "tags",
                    token: authData.token,
                    signature: authData.signature,
                    expire: authData.expire,
                },
                function (err, result) {
                    if (err) {
                        console.log("Upload error:", err);
                    } else {
                        document.getElementById("profileImageUrl").value = result.url;
                        document.getElementById("createPostForm").submit();
                    }
                }
            );
        } catch (error) {
            console.error("Auth or upload failed:", error);
        }
    }
    
    // Prevent default action in case this is triggered by a form submission
    event.preventDefault();
    handleUpload();
}

document.getElementById("continueBtn").addEventListener("click", function (event) {
    // Prevent the default form submission
    event.preventDefault();
    continueEditing();
});