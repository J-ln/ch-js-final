const pageContent = document.getElementById("content");

//NavBar

const navbar = document.getElementById("navbar");
const settingsBtn = document.getElementById("settingsBtn");
settingsBtn.addEventListener("click", function () {
    navbar.classList.toggle("collapsed");
    pageContent.classList.toggle("resize-settings");
});

// settingsBtn.addEventListener("click", function () {
//     navbar.classList.add("collapsed");
// });

//Modal

const modal = document.getElementById("modal");

const newPatternBtn = document.getElementById("addPattern");

newPatternBtn.addEventListener("click", function () {
    if (modal.innerHTML == "") {
        modal.innerHTML = `
                    <form class="modal_form">
                        <div class="modal_nameP">
                            <label for="name">Name </label>
                            <input class="modal_input--text" type="text" />
                        </div>
                        <div class="modal_colorP">
                            <label for="color">Color </label>
                            <div id="modal_pickerContainer"></div>
                        </div>
                        <div class="modal_sizeP">
                            <label for="size">Size </label>
                            <input class="modal_input--text" type="" />
                        </div>
                        <div class="modal_formP">
                            <label for="form">Form </label>
                            <input class="modal_input--text" type="text" />
                        </div>

                        <button
                            id="modal_newPatBtn"
                            class="modal_btn"
                            type="submit"
                        >
                            Create New Pattern
                        </button>
                    </form> `;

        modal.style.visibility = "visible";

        modal.classList.toggle("modal--close");
    }
});
