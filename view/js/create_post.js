// Initialize imagefile as an array
const buttonSpan = document.getElementsByClassName("button-text");
const lodingSpinner = document.getElementsByClassName("loading-spinner");
const continueBtn = document.getElementById('continueBtn');

var imagefile = [];

function storeFilesInLocalStorage(files) {
    // clear previous stored images
    Object.keys(localStorage).forEach(k => {
        if (k.startsWith("uploadedFile_")) localStorage.removeItem(k);
    });

    Array.from(files).forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = e => {
        localStorage.setItem(`uploadedFile_${i}`, JSON.stringify({ name:file.name, data:e.target.result}));
        };
        reader.readAsDataURL(file);
    });
    }

async function getAuth() {
let res = await fetch("/imagKitauth");
return res;
}

async function showPreview(event) {
    if (event.target.files.length > 0) {
        const postTypeInput = document.getElementById('postType');
        storeFilesInLocalStorage(event.target.files);

        if(postTypeInput.value==='story'){
            const authResponse = await getAuth();
            const authData = await authResponse.json();

            var imagekit = new ImageKit({
                publicKey: "public_wbpheuS28ohGGR1W5QtPU+uv/z8=",
                urlEndpoint: "https://ik.imagekit.io/lidyx2zxm/",
            });
            const keys = Object.keys(localStorage).filter(k => k.startsWith('uploadedFile_'));
            const array=keys.map(key => {
                const {data:base64,name} = JSON.parse(localStorage.getItem(key));
                return {base64,name};
            });
            document.querySelector('.loading-spinner').style.display = 'inline-flex';

            imagekit.upload({
                file: array[0].base64,
                fileName: array[0].name,
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
                    document.querySelector('.loading-spinner').style.display = 'none';
                }
            });
        }
    
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

function continueEditing() {
        try {

            if (!imagefile || imagefile.length === 0) {
                console.error("No image selected");
                return;
            }
            
            document.getElementById("createPostForm").submit();
        } catch (error) {
            console.error("Auth or upload failed:", error);
        }
}

continueBtn.addEventListener("click", function (event) {
    // Prevent the default form submission
    event.preventDefault();
    this.classList.add('loading');
    this.querySelector('.button-text').style.display = 'none';
    this.querySelector('.loading-spinner').style.display = 'inline-flex';
    continueEditing();
});