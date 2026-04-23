// Stufe 1: Einfaches Promise
function holeBrief(inhalt) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(inhalt);
        }, 1000); // 1 Sekunde Verzögerung
    });
}

// Stufe 2: Promise Chaining
function stempelBrief(brief) {
    return new Promise((resolve) => {
        resolve(brief + " [Gestempelt]");
    });
}

function versendeBrief(brief) {
    return new Promise((resolve) => {
        resolve(brief + " -> Versendet!");
    });
}

// Beispiel für Promise Chaining
holeBrief("Mein Briefinhalt")
    .then(stempelBrief)
    .then(versendeBrief)
    .then(result => {
        console.log("Endergebnis:", result);
    })
    .catch(error => {
        console.error("Fehler:", error);
    });
