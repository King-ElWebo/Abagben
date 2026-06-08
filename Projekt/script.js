// In dieser Variable speichern wir die aktuelle Adjazenzmatrix.
// Eine Adjazenzmatrix beschreibt, welche Knoten im Graphen verbunden sind.
let matrix = [];

// Wir holen die wichtigen HTML-Elemente aus der Webseite.
const csvFileInput = document.getElementById("csvFile");
const loadExampleButton = document.getElementById("loadExampleButton");
const calculateButton = document.getElementById("calculateButton");
const randomButton = document.getElementById("randomButton");
const randomNodeCountInput = document.getElementById("randomNodeCount");
const randomEdgeChanceInput = document.getElementById("randomEdgeChance");
const messageOutput = document.getElementById("message");
const matrixOutput = document.getElementById("matrixOutput");
const distanceOutput = document.getElementById("distanceOutput");
const eccentricityOutput = document.getElementById("eccentricityOutput");
const graphValuesOutput = document.getElementById("graphValuesOutput");
const componentsOutput = document.getElementById("componentsOutput");
const articulationsOutput = document.getElementById("articulationsOutput");
const bridgesOutput = document.getElementById("bridgesOutput");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

// Wenn der Benutzer eine CSV-Datei auswählt, wird diese Datei eingelesen.
csvFileInput.addEventListener("change", readCsvFile);

// Der Beispiel-Button lädt eine feste Beispielmatrix.
loadExampleButton.addEventListener("click", loadExample);

// Der Berechnen-Button startet alle Prüfungen und Berechnungen.
calculateButton.addEventListener("click", calculateGraph);

// Der Zufalls-Button erzeugt eine neue zufällige Adjazenzmatrix.
randomButton.addEventListener("click", generateRandomGraph);

// Diese Funktion liest eine CSV-Datei mit dem FileReader.
function readCsvFile() {
    const file = csvFileInput.files[0];

    if (!file) {
        showMessage("Bitte wähle zuerst eine CSV-Datei aus.", true);
        return;
    }

    const reader = new FileReader();

    // Diese Funktion wird ausgeführt, sobald der Browser die Datei gelesen hat.
    reader.onload = function(event) {
        const csvText = event.target.result;
        matrix = parseCsvText(csvText);
        clearResults();
        showMatrix(matrix, matrixOutput);
        drawGraph(matrix);
        showMessage("Datei wurde geladen. Klicke jetzt auf 'Graph berechnen'.", false);
    };

    reader.readAsText(file);
}

// Diese Funktion wandelt den CSV-Text in eine Matrix aus Zahlen um.
function parseCsvText(csvText) {
    if (csvText.trim() === "") {
        return [];
    }

    const rows = csvText.trim().split(/\r?\n/);
    const newMatrix = [];

    for (let i = 0; i < rows.length; i++) {
        const values = rows[i].split(",");
        const matrixRow = [];

        for (let j = 0; j < values.length; j++) {
            // trim() entfernt Leerzeichen vor und nach einem Wert.
            matrixRow.push(Number(values[j].trim()));
        }

        newMatrix.push(matrixRow);
    }

    return newMatrix;
}

// Diese Funktion lädt eine Beispielmatrix und berechnet direkt alle Ergebnisse.
function loadExample() {
    matrix = [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [0, 1, 1, 0]
    ];

    clearResults();
    showMatrix(matrix, matrixOutput);
    drawGraph(matrix);
    showMessage("Beispielmatrix wurde geladen.", false);
    calculateGraph();
}

// Diese Funktion erzeugt einen zufälligen ungerichteten Graphen.
function generateRandomGraph() {
    const nodeCount = Number(randomNodeCountInput.value);
    const edgeChance = Number(randomEdgeChanceInput.value);

    if (nodeCount < 2 || nodeCount > 12) {
        showMessage("Bitte wähle zwischen 2 und 12 Knoten.", true);
        return;
    }

    if (edgeChance < 0 || edgeChance > 100) {
        showMessage("Die Kantendichte muss zwischen 0 und 100 Prozent liegen.", true);
        return;
    }

    matrix = [];

    // Zuerst erstellen wir eine leere Matrix mit lauter Nullen.
    for (let i = 0; i < nodeCount; i++) {
        matrix[i] = [];

        for (let j = 0; j < nodeCount; j++) {
            matrix[i][j] = 0;
        }
    }

    // Danach entscheiden wir für jede mögliche Kante zufällig,
    // ob sie im Graphen vorkommen soll.
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            const randomNumber = Math.random() * 100;

            if (randomNumber < edgeChance) {
                // Bei einem ungerichteten Graphen müssen beide Einträge gleich sein.
                matrix[i][j] = 1;
                matrix[j][i] = 1;
            }
        }
    }

    clearResults();
    showMatrix(matrix, matrixOutput);
    drawGraph(matrix);
    showMessage("Zufallsgraph wurde erzeugt.", false);
    calculateGraph();
}

// Diese Funktion startet die komplette Berechnung.
function calculateGraph() {
    clearResults();

    if (matrix.length === 0) {
        showMessage("Bitte lade zuerst eine CSV-Datei oder das Beispiel.", true);
        clearCanvas();
        return;
    }

    const errorMessage = checkMatrix(matrix);

    if (errorMessage !== "") {
        showMessage(errorMessage, true);
        showMatrix(matrix, matrixOutput);
        clearCanvas();
        return;
    }

    showMessage("Matrix ist gültig. Die Ergebnisse wurden berechnet.", false);
    showMatrix(matrix, matrixOutput);

    const distanceMatrix = calculateDistanceMatrix(matrix);
    showMatrix(distanceMatrix, distanceOutput);

    const eccentricities = calculateEccentricities(distanceMatrix);
    showEccentricities(eccentricities);
    showRadiusDiameterCenter(eccentricities);
    const centerNodes = calculateCenterNodes(eccentricities);

    const components = calculateComponents(matrix, -1);
    showComponents(components);

    const articulations = calculateArticulations(matrix);
    showArticulations(articulations);

    const bridges = calculateBridges(matrix);
    showBridges(bridges);

    // Beim Zeichnen geben wir die besonderen Knoten und Kanten mit.
    // Dadurch kann der Graph farbig markiert werden.
    drawGraph(matrix, centerNodes, articulations, bridges);
}

// Diese Funktion prüft, ob die Matrix für einen ungerichteten Graphen gültig ist.
function checkMatrix(testMatrix) {
    const size = testMatrix.length;

    // Eine Matrix darf nicht leer sein.
    if (size === 0) {
        return "Die Matrix ist leer.";
    }

    for (let i = 0; i < size; i++) {
        // Quadratisch bedeutet: Anzahl Zeilen = Anzahl Spalten.
        if (testMatrix[i].length !== size) {
            return "Die Matrix ist nicht quadratisch.";
        }

        for (let j = 0; j < size; j++) {
            // In einer einfachen Adjazenzmatrix sollen nur 0 und 1 vorkommen.
            if (testMatrix[i][j] !== 0 && testMatrix[i][j] !== 1) {
                return "Die Matrix darf nur die Werte 0 und 1 enthalten.";
            }
        }
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            // Bei einem ungerichteten Graphen muss die Matrix symmetrisch sein.
            // Das heißt: matrix[i][j] ist gleich matrix[j][i].
            if (testMatrix[i][j] !== testMatrix[j][i]) {
                return "Die Matrix ist nicht symmetrisch. Der Graph wäre dann gerichtet.";
            }
        }
    }

    return "";
}

// Diese Funktion berechnet die kürzesten Wege zwischen allen Knoten.
// Floyd-Warshall probiert jeden Knoten als möglichen Zwischenknoten aus.
// Wenn der Weg über diesen Zwischenknoten kürzer ist, wird die Distanz verbessert.
function calculateDistanceMatrix(adjacencyMatrix) {
    const size = adjacencyMatrix.length;
    const distances = [];

    for (let i = 0; i < size; i++) {
        distances[i] = [];

        for (let j = 0; j < size; j++) {
            if (i === j) {
                distances[i][j] = 0;
            } else if (adjacencyMatrix[i][j] === 1) {
                distances[i][j] = 1;
            } else {
                distances[i][j] = Infinity;
            }
        }
    }

    for (let middle = 0; middle < size; middle++) {
        for (let start = 0; start < size; start++) {
            for (let end = 0; end < size; end++) {
                const newDistance = distances[start][middle] + distances[middle][end];

                if (newDistance < distances[start][end]) {
                    distances[start][end] = newDistance;
                }
            }
        }
    }

    return distances;
}

// Die Exzentrizität eines Knotens ist die größte Entfernung zu einem erreichbaren Knoten.
function calculateEccentricities(distanceMatrix) {
    const eccentricities = [];

    for (let i = 0; i < distanceMatrix.length; i++) {
        let biggestDistance = 0;

        for (let j = 0; j < distanceMatrix[i].length; j++) {
            const distance = distanceMatrix[i][j];

            // Infinity bedeutet: Dieser Knoten ist nicht erreichbar.
            // Laut Aufgabenstellung betrachten wir nur erreichbare Knoten.
            if (distance !== Infinity && distance > biggestDistance) {
                biggestDistance = distance;
            }
        }

        eccentricities.push(biggestDistance);
    }

    return eccentricities;
}

// Diese Funktion gibt alle Knoten zurück, die im Zentrum liegen.
function calculateCenterNodes(eccentricities) {
    let radius = eccentricities[0];
    const centerNodes = [];

    for (let i = 0; i < eccentricities.length; i++) {
        if (eccentricities[i] < radius) {
            radius = eccentricities[i];
        }
    }

    for (let i = 0; i < eccentricities.length; i++) {
        if (eccentricities[i] === radius) {
            centerNodes.push(i);
        }
    }

    return centerNodes;
}

// Diese Funktion findet die Zusammenhangskomponenten.
// removedNode gibt an, ob ein Knoten gedanklich entfernt wird.
// Wenn kein Knoten entfernt wird, verwenden wir den Wert -1.
function calculateComponents(adjacencyMatrix, removedNode) {
    const size = adjacencyMatrix.length;
    const visited = [];
    const components = [];

    for (let i = 0; i < size; i++) {
        visited[i] = false;
    }

    for (let start = 0; start < size; start++) {
        if (start === removedNode) {
            visited[start] = true;
        }

        if (!visited[start]) {
            const component = [];
            const stack = [start];
            visited[start] = true;

            // Wir verwenden hier einen Stack.
            // Solange noch Knoten im Stack liegen, suchen wir ihre Nachbarn.
            while (stack.length > 0) {
                const node = stack.pop();
                component.push(node);

                for (let neighbor = 0; neighbor < size; neighbor++) {
                    const isConnected = adjacencyMatrix[node][neighbor] === 1;
                    const isRemoved = neighbor === removedNode;

                    if (isConnected && !isRemoved && !visited[neighbor]) {
                        visited[neighbor] = true;
                        stack.push(neighbor);
                    }
                }
            }

            components.push(component);
        }
    }

    return components;
}

// Diese Funktion sucht Artikulationen.
// Dafür wird jeder Knoten einmal testweise entfernt.
function calculateArticulations(adjacencyMatrix) {
    const articulations = [];
    const normalComponentCount = calculateComponents(adjacencyMatrix, -1).length;

    for (let node = 0; node < adjacencyMatrix.length; node++) {
        const newComponentCount = calculateComponents(adjacencyMatrix, node).length;

        if (newComponentCount > normalComponentCount) {
            articulations.push(node);
        }
    }

    return articulations;
}

// Diese Funktion sucht Brücken.
// Dafür wird jede vorhandene Kante einmal testweise entfernt.
function calculateBridges(adjacencyMatrix) {
    const bridges = [];
    const normalComponentCount = calculateComponents(adjacencyMatrix, -1).length;

    for (let i = 0; i < adjacencyMatrix.length; i++) {
        for (let j = i + 1; j < adjacencyMatrix.length; j++) {
            if (adjacencyMatrix[i][j] === 1) {
                const copiedMatrix = copyMatrix(adjacencyMatrix);

                // Da der Graph ungerichtet ist, entfernen wir beide Richtungen.
                copiedMatrix[i][j] = 0;
                copiedMatrix[j][i] = 0;

                const newComponentCount = calculateComponents(copiedMatrix, -1).length;

                if (newComponentCount > normalComponentCount) {
                    bridges.push([i, j]);
                }
            }
        }
    }

    return bridges;
}

// Diese Hilfsfunktion kopiert eine Matrix.
// Das ist wichtig, damit wir die echte Matrix nicht verändern.
function copyMatrix(originalMatrix) {
    const copiedMatrix = [];

    for (let i = 0; i < originalMatrix.length; i++) {
        copiedMatrix[i] = [];

        for (let j = 0; j < originalMatrix[i].length; j++) {
            copiedMatrix[i][j] = originalMatrix[i][j];
        }
    }

    return copiedMatrix;
}

// Diese Funktion zeigt eine Matrix als HTML-Tabelle an.
function showMatrix(anyMatrix, outputElement) {
    if (anyMatrix.length === 0) {
        outputElement.innerHTML = "";
        return;
    }

    let html = "<table>";

    for (let i = 0; i < anyMatrix.length; i++) {
        html += "<tr>";

        for (let j = 0; j < anyMatrix[i].length; j++) {
            let value = anyMatrix[i][j];

            if (value === Infinity) {
                value = "&infin;";
            }

            html += "<td>" + value + "</td>";
        }

        html += "</tr>";
    }

    html += "</table>";
    outputElement.innerHTML = html;
}

// Diese Funktion zeigt die Exzentrizitäten der Knoten an.
function showEccentricities(eccentricities) {
    let html = "<div class='result-list'>";

    for (let i = 0; i < eccentricities.length; i++) {
        html += "Knoten " + (i + 1) + ": " + eccentricities[i] + "<br>";
    }

    html += "</div>";
    eccentricityOutput.innerHTML = html;
}

// Diese Funktion berechnet und zeigt Radius, Durchmesser und Zentrum.
function showRadiusDiameterCenter(eccentricities) {
    let radius = eccentricities[0];
    let diameter = eccentricities[0];
    const center = [];

    for (let i = 0; i < eccentricities.length; i++) {
        if (eccentricities[i] < radius) {
            radius = eccentricities[i];
        }

        if (eccentricities[i] > diameter) {
            diameter = eccentricities[i];
        }
    }

    for (let i = 0; i < eccentricities.length; i++) {
        if (eccentricities[i] === radius) {
            center.push("Knoten " + (i + 1));
        }
    }

    graphValuesOutput.innerHTML =
        "<div class='result-list'>" +
        "Radius: " + radius + "<br>" +
        "Durchmesser: " + diameter + "<br>" +
        "Zentrum: " + center.join(", ") +
        "</div>";
}

// Diese Funktion zeigt alle Komponenten an.
function showComponents(components) {
    let html = "<div class='result-list'>";

    for (let i = 0; i < components.length; i++) {
        const nodeNames = [];

        for (let j = 0; j < components[i].length; j++) {
            nodeNames.push("Knoten " + (components[i][j] + 1));
        }

        html += "Komponente " + (i + 1) + ": " + nodeNames.join(", ") + "<br>";
    }

    html += "</div>";
    componentsOutput.innerHTML = html;
}

// Diese Funktion zeigt alle Artikulationen an.
function showArticulations(articulations) {
    if (articulations.length === 0) {
        articulationsOutput.innerHTML = "Keine Artikulationen gefunden.";
        return;
    }

    const nodeNames = [];

    for (let i = 0; i < articulations.length; i++) {
        nodeNames.push("Knoten " + (articulations[i] + 1));
    }

    articulationsOutput.innerHTML = nodeNames.join(", ");
}

// Diese Funktion zeigt alle Brücken an.
function showBridges(bridges) {
    if (bridges.length === 0) {
        bridgesOutput.innerHTML = "Keine Brücken gefunden.";
        return;
    }

    const bridgeNames = [];

    for (let i = 0; i < bridges.length; i++) {
        const start = bridges[i][0] + 1;
        const end = bridges[i][1] + 1;
        bridgeNames.push("Kante " + start + " - " + end);
    }

    bridgesOutput.innerHTML = bridgeNames.join("<br>");
}

// Diese Funktion zeichnet den Graphen auf das Canvas.
function drawGraph(adjacencyMatrix, centerNodes = [], articulations = [], bridges = []) {
    clearCanvas();

    if (adjacencyMatrix.length === 0) {
        return;
    }

    const size = adjacencyMatrix.length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 140;
    const nodeRadius = 18;
    const positions = [];

    // Wir verteilen die Knoten gleichmäßig auf einem Kreis.
    for (let i = 0; i < size; i++) {
        const angle = (2 * Math.PI * i) / size - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        positions.push({ x: x, y: y });
    }

    // Zuerst zeichnen wir die Kanten, damit sie hinter den Knoten liegen.
    for (let i = 0; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
            if (adjacencyMatrix[i][j] === 1) {
                const bridge = isBridge(i, j, bridges);

                ctx.beginPath();
                ctx.moveTo(positions[i].x, positions[i].y);
                ctx.lineTo(positions[j].x, positions[j].y);
                ctx.strokeStyle = bridge ? "#d62828" : "#555";
                ctx.lineWidth = bridge ? 5 : 2;
                ctx.stroke();
            }
        }
    }

    // Danach zeichnen wir die Knoten als Kreise.
    for (let i = 0; i < size; i++) {
        const isCenterNode = centerNodes.includes(i);
        const isArticulationNode = articulations.includes(i);
        let nodeColor = "#e76f51";
        let borderColor = "#222";
        let borderWidth = 2;

        // Zentrum und Artikulationen werden farbig hervorgehoben.
        if (isCenterNode) {
            nodeColor = "#2a9d8f";
        }

        if (isArticulationNode) {
            nodeColor = "#457b9d";
        }

        // Falls ein Knoten Zentrum und Artikulation ist, bleibt er grün,
        // bekommt aber einen blauen dicken Rand.
        if (isCenterNode && isArticulationNode) {
            nodeColor = "#2a9d8f";
            borderColor = "#457b9d";
            borderWidth = 5;
        }

        ctx.beginPath();
        ctx.arc(positions[i].x, positions[i].y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = nodeColor;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.stroke();

        // Die Knotennummer schreiben wir in den Kreis.
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(i + 1, positions[i].x, positions[i].y);
    }
}

// Diese Hilfsfunktion prüft, ob eine Kante in der Brücken-Liste steht.
function isBridge(start, end, bridges) {
    for (let i = 0; i < bridges.length; i++) {
        const bridgeStart = bridges[i][0];
        const bridgeEnd = bridges[i][1];

        if (bridgeStart === start && bridgeEnd === end) {
            return true;
        }
    }

    return false;
}

// Diese Funktion löscht das Canvas.
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Diese Funktion zeigt Meldungen für den Benutzer an.
function showMessage(text, isError) {
    messageOutput.textContent = text;

    if (isError) {
        messageOutput.className = "message error";
    } else {
        messageOutput.className = "message success";
    }
}

// Diese Funktion löscht alle alten Ergebnisse.
function clearResults() {
    distanceOutput.innerHTML = "";
    eccentricityOutput.innerHTML = "";
    graphValuesOutput.innerHTML = "";
    componentsOutput.innerHTML = "";
    articulationsOutput.innerHTML = "";
    bridgesOutput.innerHTML = "";
}
