document.addEventListener("DOMContentLoaded", () => {
    const emojiButton = document.getElementById("emoji-button");
    const emojiPicker = document.getElementById("emoji-picker");
    const captionInput = document.getElementById("caption");

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
        .addEventListener("click", () => {
            const caption = document.getElementById("caption").value;
            const location = document.getElementById("location").value;
            const commentsEnabled =
                document.getElementById("toggle-comments").checked;
            alert(
                `Post shared!\nCaption: ${caption}\nLocation: ${location}\nComments: ${commentsEnabled ? "On" : "Off"
                }`
            );
        });
});