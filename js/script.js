let students = [];
let currentPage = 0;

const studentsPerPage = 5;


// =========================
// ELEMENTEN
// =========================

const studentSlots = document.querySelectorAll(".student-slot");
const pageDots = document.querySelector("#pageDots");
const homescreen = document.querySelector("#homescreen");


// =========================
// STUDENTEN UIT JSON LADEN
// =========================

fetch("data/students.json")
    .then(response => response.json())
    .then(data => {

        students = data;

        createDots();
        showStudents();

    })
    .catch(error => {
        console.error("De studenten konden niet worden geladen:", error);
    });


// =========================
// STUDENTEN TONEN
// =========================

function showStudents() {

    studentSlots.forEach((slot, index) => {

        // Bepalen welke student op deze plek hoort
        const studentNumber =
            currentPage * studentsPerPage + index;

        const student = students[studentNumber];


        // Oude inhoud verwijderen
        slot.innerHTML = "";

        slot.classList.remove("empty");


        // Als er geen student meer is
        if (!student) {

            slot.classList.add("empty");

            return;
        }


        // =========================
        // FOTO
        // =========================

        const image = document.createElement("img");

        // ../ uit het JSON-pad halen
        // Bijvoorbeeld:
        // ../assets/students/ahmet.png
        // wordt:
        // assets/students/ahmet.png
        image.src = student.image.replace("../", "");

        image.alt = student.name;

        image.classList.add("student-photo");


        // =========================
        // NAAM
        // =========================

        const name = document.createElement("span");

        name.textContent = student.name;


        // =========================
        // TOEVOEGEN
        // =========================

        slot.appendChild(image);
        slot.appendChild(name);


        // =========================
        // KLIKKEN OP STUDENT
        // =========================

        slot.onclick = function () {

            window.location.href = student.link;

        };

    });


    updateDots();

}


// =========================
// PAGINA DOTS MAKEN
// =========================

function createDots() {

    pageDots.innerHTML = "";


    // Aantal pagina's berekenen
    const pageCount =
        Math.ceil(students.length / studentsPerPage);


    for (let i = 0; i < pageCount; i++) {

        const dot = document.createElement("div");

        dot.classList.add("dot");


        // Eerste pagina is actief
        if (i === 0) {
            dot.classList.add("active");
        }


        pageDots.appendChild(dot);

    }

}


// =========================
// ACTIEVE DOT AANPASSEN
// =========================

function updateDots() {

    const dots =
        document.querySelectorAll(".dot");


    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentPage
        );

    });

}


// =========================
// VOLGENDE PAGINA
// =========================

function nextPage() {

    const maxPage =
        Math.ceil(students.length / studentsPerPage) - 1;


    // Niet verder gaan dan laatste pagina
    if (currentPage >= maxPage) {
        return;
    }


    currentPage++;

    changePage("left");

}


// =========================
// VORIGE PAGINA
// =========================

function previousPage() {

    // Niet verder terug dan pagina 1
    if (currentPage <= 0) {
        return;
    }


    currentPage--;

    changePage("right");

}


// =========================
// PAGINA VERANDEREN
// =========================

function changePage(direction) {

    // Oude studenten laten wegschuiven
    homescreen.classList.add(
        direction === "left"
            ? "swipe-left"
            : "swipe-right"
    );


    // Wachten totdat de animatie klaar is
    setTimeout(() => {

        // Nieuwe studenten laden
        showStudents();


        // Nieuwe studenten laten binnenkomen
        studentSlots.forEach(slot => {

            if (!slot.classList.contains("empty")) {

                slot.classList.add(
                    direction === "left"
                        ? "student-enter-left"
                        : "student-enter-right"
                );

            }

        });


        // Animatie weer verwijderen
        setTimeout(() => {

            homescreen.classList.remove(
                "swipe-left",
                "swipe-right"
            );


            studentSlots.forEach(slot => {

                slot.classList.remove(
                    "student-enter-left",
                    "student-enter-right"
                );

            });

        }, 300);

    }, 300);

}


// =========================
// SWIPE
// =========================

let startX = 0;
let startY = 0;


// Wanneer je je vinger op het scherm zet
homescreen.addEventListener("touchstart", function(event) {

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;

});


// Wanneer je je vinger loslaat
homescreen.addEventListener("touchend", function(event) {

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;


    // Verschil berekenen
    const differenceX = endX - startX;
    const differenceY = endY - startY;


    // Geen horizontale swipe als de beweging
    // voornamelijk verticaal was
    if (Math.abs(differenceX) < Math.abs(differenceY)) {
        return;
    }


    // Swipe moet minimaal 50 pixels zijn
    if (Math.abs(differenceX) < 50) {
        return;
    }


    // Naar links swipen
    if (differenceX < 0) {

        nextPage();

    }

    // Naar rechts swipen
    else {

        previousPage();

    }

});