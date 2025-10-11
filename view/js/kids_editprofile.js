async function getAuth() {
    try {
        let res = await fetch('/imagKitauth');
        return res;
    } catch (error) {
        console.error("Error fetching ImageKit authentication:", error);
    }
}

async function handleImageUpload() {
    const fileInput = document.getElementById("photoInput");
    if (!fileInput || !fileInput.files[0]) {
        console.log("No file selected for upload.");
        return;
    }

    const authResponse = await getAuth();

    if (!authResponse || !authResponse.ok) {
        alert("Could not connect to the server to upload the image. Please try again later.");
        throw new Error("Failed to fetch auth details");
    }

    const authData = await authResponse.json();
    
    var imagekit = new ImageKit({
        publicKey: "public_wbpheuS28ohGGR1W5QtPU+uv/z8=",
        urlEndpoint: "https://ik.imagekit.io/lidyx2zxm/",
    });

    const file = fileInput.files[0];

    imagekit.upload({
        file: file,
        fileName: file.name || "kid-profile-pic.jpg",
        tags: ["kids-profile"],
        token: authData.token,
        signature: authData.signature,
        expire: authData.expire,
    }, function (err, result) {
        if (err) {
            console.error("ImageKit upload error:", err);
            alert("There was an error uploading your photo. Please try again.");
        } else {
            document.getElementById("profileImageUrl").value = result.url;
            console.log("Image successfully uploaded:", result.url);
        }
    });
}

const imageUploadInput = document.getElementById("photoInput");

if (imageUploadInput) {
    imageUploadInput.addEventListener('change', handleImageUpload);
}