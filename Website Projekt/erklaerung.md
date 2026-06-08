# Erklärung zur Website: WMC Lernplaner

## Thema der Webapplikation

Die Website ist ein kleiner Lernplaner für das WMC-Projekt. Man kann damit Aufgaben für das Projekt erstellen, erledigen, filtern und löschen. Der Fortschritt wird automatisch berechnet und angezeigt.

## Was die Website macht

Auf der Startseite gibt es ein Formular, mit dem neue Aufgaben hinzugefügt werden können. Eine Aufgabe besteht aus:

- Titel
- Kategorie, zum Beispiel HTML, CSS oder JavaScript
- Priorität, zum Beispiel Normal oder Sehr wichtig

Nach dem Hinzufügen erscheint die Aufgabe in der Aufgabenliste. Dort kann man sie als erledigt markieren oder wieder auf offen setzen. Außerdem kann man einzelne Aufgaben löschen.

## Interaktionen

Die Website hat mehrere Interaktionen:

1. Eine Aufgabe hinzufügen
   Beim Absenden des Formulars wird eine neue Aufgabe erstellt und in der Liste angezeigt.

2. Aufgabe erledigen
   Durch Klick auf das Kreis-Symbol wird eine Aufgabe als erledigt markiert. Dadurch ändert sich die Darstellung und der Fortschritt wird neu berechnet.

3. Aufgaben filtern
   Mit den Buttons "Alle", "Offen" und "Erledigt" kann man auswählen, welche Aufgaben angezeigt werden.

4. Theme wechseln
   Mit dem Button "Theme wechseln" kann man zwischen hellem und dunklem Design wechseln.

5. Aufgaben zurücksetzen
   Mit dem Button "Zurücksetzen" werden alle Aufgaben gelöscht.

## DOM-Modifikation

Die Aufgabenliste wird mit JavaScript dynamisch erzeugt. Das bedeutet, dass die Aufgaben nicht fest im HTML stehen, sondern durch JavaScript in das Dokument eingefügt werden.

Beispiele für DOM-Modifikationen:

- Neue Listenelemente werden mit `document.createElement()` erstellt.
- Die Aufgabenliste wird mit `taskList.innerHTML = ""` geleert und danach neu aufgebaut.
- Der Fortschrittsbalken wird über `progressBar.style.width` verändert.
- Texte wie die Anzahl der offenen Aufgaben werden mit `textContent` aktualisiert.

## State-Objekt

Im JavaScript gibt es ein State-Objekt:

```js
const state = {
  tasks: [],
  filter: "all",
  theme: "light"
};
```

Dieses Objekt speichert den aktuellen Zustand der App:

- `tasks`: alle Aufgaben
- `filter`: welcher Filter gerade aktiv ist
- `theme`: ob das helle oder dunkle Theme aktiv ist

Wenn sich etwas ändert, wird zuerst der State verändert. Danach wird die Seite mit der Funktion `render()` neu dargestellt.

## Local Storage

Der State wird im Local Storage gespeichert. Dadurch bleiben Aufgaben, Filter und Theme erhalten, auch wenn man die Seite neu lädt.

Dafür werden diese Funktionen verwendet:

```js
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY);
}
```

Da Local Storage nur Texte speichern kann, wird das State-Objekt mit `JSON.stringify()` in einen Text umgewandelt. Beim Laden wird es mit `JSON.parse()` wieder zu einem JavaScript-Objekt.

## JavaScript-Struktur mit 8 Punkten

Die Datei `main.js` ist in acht Bereiche gegliedert:

1. DOM-Elemente holen
2. State-Objekt
3. Start der App
4. State in Local Storage speichern und laden
5. Ereignisbehandlungen registrieren
6. Eingaben auswerten
7. State verändern
8. Rendern und DOM verändern

Diese Struktur macht den Code übersichtlich und leichter erklärbar.

## Verwendete Dateien

- `index.html`: Struktur der Webapp
- `style.css`: Gestaltung und Layout
- `main.js`: Logik, Interaktionen, State und Local Storage
- `about.html`: zusätzliche Seite über das Projekt oder die Person
- `gallery.html`: zusätzliche Galerie-Seite

## Zusammenfassung

Der WMC Lernplaner erfüllt die Anforderungen, weil er semantisches HTML, CSS-Styling und JavaScript-Interaktionen verwendet. Die App besitzt ein State-Objekt, speichert den Zustand im Local Storage und verändert den DOM dynamisch.
