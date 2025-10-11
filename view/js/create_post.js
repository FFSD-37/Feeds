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

function showPreview(event) {
    if (event.target.files.length > 0) {console.log(event.target.files[0]);
    
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
        storeFilesInLocalStorage(event.target.files);
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