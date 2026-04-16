import persons from "./persons.json" with { type: "json" };
console.log(persons);

// "id": 6,
// "name": "Sophie Dubois",
// "groesse": 168,
// "geburtsdatum": "1994-03-10",
// "herkunft": "Frankreich",
// "gewicht": 59.5 -->

const sortDirections = {
    id: 1,
    name: 1,
    groesse: 1,
    geburtsdatum: 1,
    herkunft: 1,
    gewicht: 1
};

function sortPersons(key, direction) {
    persons.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        if (typeof valA === 'string') {
            return direction * valA.localeCompare(valB);
        } else {
            return direction * (valA - valB);
        }
    });
}

function renderPersons() {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";
    for (const person of persons) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${person.id}</td>
            <td>${person.name}</td>
            <td>${person.groesse}</td>
            <td>${person.geburtsdatum}</td>
            <td>${person.herkunft}</td>
            <td>${person.gewicht}</td>
        `;
        tbody.appendChild(tr);
    }
}

// Event listeners for sorting
const thId = document.querySelector("#id");
thId.addEventListener("click", () => {
    sortDirections.id *= -1;
    sortPersons('id', sortDirections.id);
    renderPersons();
});

const thName = document.querySelector("#name");
thName.addEventListener("click", () => {
    sortDirections.name *= -1;
    sortPersons('name', sortDirections.name);
    renderPersons();
});

const thHeight = document.querySelector("#height");
thHeight.addEventListener("click", () => {
    sortDirections.groesse *= -1;
    sortPersons('groesse', sortDirections.groesse);
    renderPersons();
});

const thBirthdate = document.querySelector("#birthdate");
thBirthdate.addEventListener("click", () => {
    sortDirections.geburtsdatum *= -1;
    sortPersons('geburtsdatum', sortDirections.geburtsdatum);
    renderPersons();
});

const thOrigin = document.querySelector("#origin");
thOrigin.addEventListener("click", () => {
    sortDirections.herkunft *= -1;
    sortPersons('herkunft', sortDirections.herkunft);
    renderPersons();
});

const thWeight = document.querySelector("#weight");
thWeight.addEventListener("click", () => {
    sortDirections.gewicht *= -1;
    sortPersons('gewicht', sortDirections.gewicht);
    renderPersons();
});

window.renderPersons = renderPersons;

renderPersons();
