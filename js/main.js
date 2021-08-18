class Patern {
    constructor(name, color, size, form) {
        this.name = name;
        this.color = color;
        this.size = parseInt(size);
        this.form = form;
    }

    changeColor() {
        this.color = prompt(
            "Ingrese un color: (Rojo / Azul / Verde)"
        ).toLowerCase();
        console.log(this.color);
        if (
            this.color == "rojo" ||
            this.color == "verde" ||
            this.color == "azul"
        ) {
            alert("Ha seleccionado el color " + this.color);
        } else {
            alert("Ha ingresado una opcion incorrecta");
        }
    }

    changeSize() {
        this.size = parseInt(
            prompt(
                "Elija uno de los siguentes tamaños: (32 / 64 / 128 / 256 / 512 / 1024 / 2048 / 4086)"
            )
        );
        if (
            this.size == 32 ||
            this.size == 64 ||
            this.size == 128 ||
            this.size == 256 ||
            this.size == 512 ||
            this.size == 1024 ||
            this.size == 2048 ||
            this.size == 4086
        ) {
            alert("Ha seleccionado el tamaño " + this.size);
        } else {
            alert("Ha ingresado una opcion incorrecta");
        }
    }

    changeForm() {
        this.form = prompt(
            "Ingrese una forma: (Rectangulo, Circulo)"
        ).toLowerCase();
        console.log(this.form);
        if (this.form == "circulo" || this.form == "rectangulo") {
            alert("Ha seleccionado la forma " + this.form);
        } else {
            alert("Ha ingresado una opcion incorrecta");
        }
    }
    changeName() {
        this.name = prompt("Ingrese un nombre para su patron:");
        alert("El nuevo nombre de su patron es:" + this.name);
    }
}

let userPatterns = [
    new Patern("x-blue-cir", "azul", 64, "circulo"),
    new Patern("red-rec", "rojo", 32, "rectangulo"),
];
let currentPattern;

function createPatern() {
    let res = prompt("Quiere crear un nuevo patron? (Si/No)");
    res = res.toLowerCase();
    if (res == "si") {
        const patern = new Patern("", "", "", "");
        patern.changeName();
        patern.changeColor();
        patern.changeSize();
        patern.changeForm();
        console.log(patern);
        userPatterns.push(patern);
        console.log(userPatterns);
    }
}

function setCurrentPatern() {
    let patternList = [];
    userPatterns.forEach((pattern) => {
        patternList.push(pattern.name);
    });
    let choice = prompt("Elija un patron: " + patternList.join(", "));
    if (userPatterns.find((pattern) => pattern.name === choice) !== undefined) {
        currentPattern = userPatterns.find(
            (pattern) => pattern.name === choice
        );
    } else {
        alert("Ha ingresado una opcion invalida");
    }
}

function sortPaternsByName(a, b) {
    return a.name.localeCompare(b.name);
}

function sortPatterns() {
    let ans = prompt("Quiere ordenar su patrones: si/no");
    if (ans == "si") {
        userPatterns.sort(sortPaternsByName);
        console.log(userPatterns);
    }
}

alert("Bienvenido");
createPatern();
sortPatterns();
setCurrentPatern();

console.log(currentPattern);

// Dejo este codigo esta parte del codigo, solo porque lo uso para ver el estilo de la navbar.

const navbar = document.getElementById("navbar");
navbar.addEventListener("mouseenter", function () {
    navbar.classList.remove("collapsed");
});

navbar.addEventListener("mouseleave", function () {
    navbar.classList.add("collapsed");
});
