const pageContent = document.getElementById("content");

//NavBar

const navbar = document.getElementById("navbar");
navbar.addEventListener("mouseenter", function () {
    navbar.classList.remove("collapsed");
});

navbar.addEventListener("mouseleave", function () {
    navbar.classList.add("collapsed");
});

//Modal
function generateModal() {
    pageContent.innerHTML += '<div id="modal" class="content_modal">Hola</div>';
    const modal = document.getElementById("modal");
}

const newPatternBtn = document.getElementById("addPattern");

// newPatternBtn.addEventListener("click", function () {
//     generateModal();
//     modal.innerHTML = `
//                     <div class="modal_form">
//                         <label for="name">Name: </label>
//                         <input type="text" />
//                         <label for="color">Color: </label>
//                         <div id="pickerContainer"></div>
//                         <label for="size">Size: </label>
//                         <input type="" />
//                         <label for="form">Form: </label>
//                         <input type="text" />
//                         <button type="submit">Create New Pattern</button>
//                     </div> `;
//     let color_pickers = [
//         new ColorPickerControl({
//             container: document.getElementById("pickerContainer"),
//         }),
//     ];
// });

let color_pickers = [
    new ColorPickerControl({
        container: document.getElementById("pickerContainer"),
    }),
];
