document
    .getElementById("searchInput")
    .addEventListener("keyup", function () {
        let filter = this.value.toLowerCase();
        let people = document.querySelectorAll("#peopleList li");

        people.forEach((person) => {
            let name = person
                .querySelector(".info strong")
                .textContent.toLowerCase();
            if (name.includes(filter)) {
                person.style.display = "flex";
            } else {
                person.style.display = "none";
            }
        });
    });