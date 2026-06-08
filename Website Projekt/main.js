"use strict";

// 1. DOM-Elemente holen
const taskForm = document.querySelector("#taskForm");
const taskTitle = document.querySelector("#taskTitle");
const taskCategory = document.querySelector("#taskCategory");
const taskPriority = document.querySelector("#taskPriority");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const totalCount = document.querySelector("#totalCount");
const openCount = document.querySelector("#openCount");
const doneCount = document.querySelector("#doneCount");
const progressBar = document.querySelector("#progressBar");
const filterButtons = document.querySelectorAll(".filter-btn");
const activeFilterText = document.querySelector("#activeFilterText");
const themeButton = document.querySelector("#themeButton");
const resetButton = document.querySelector("#resetButton");

// 2. State-Objekt
const state = {
  tasks: [],
  filter: "all",
  theme: "light"
};

const STORAGE_KEY = "wmcLernplanerState";

// 3. Start der App
function initApp() {
  loadState();
  addEventListeners();
  render();
}

// 4. State in Local Storage speichern und laden
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY);

  if (savedState === null) {
    state.tasks = [
      createTask("Semantische HTML-Struktur prüfen", "HTML", "Wichtig"),
      createTask("State-Objekt erklären können", "JavaScript", "Sehr wichtig"),
      createTask("CSS für mobile Ansicht testen", "CSS", "Normal")
    ];
    saveState();
    return;
  }

  const parsedState = JSON.parse(savedState);
  state.tasks = parsedState.tasks || [];
  state.filter = parsedState.filter || "all";
  state.theme = parsedState.theme || "light";
}

// 5. Ereignisbehandlungen registrieren
function addEventListeners() {
  taskForm.addEventListener("submit", handleAddTask);
  themeButton.addEventListener("click", handleThemeChange);
  resetButton.addEventListener("click", handleReset);

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => handleFilterChange(button.dataset.filter));
  });
}

// 6. Eingaben auswerten
function handleAddTask(event) {
  event.preventDefault();

  const title = taskTitle.value.trim();

  if (title.length === 0) {
    taskTitle.classList.add("is-invalid");
    taskTitle.focus();
    return;
  }

  taskTitle.classList.remove("is-invalid");
  state.tasks.push(createTask(title, taskCategory.value, taskPriority.value));
  taskForm.reset();
  saveState();
  render();
}

function createTask(title, category, priority) {
  return {
    id: createId(),
    title: title,
    category: category,
    priority: priority,
    done: false
  };
}

function createId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

// 7. State verändern
function handleFilterChange(filter) {
  state.filter = filter;
  saveState();
  render();
}

function toggleTask(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);

  if (task) {
    task.done = !task.done;
    saveState();
    render();
  }
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter((item) => item.id !== taskId);
  saveState();
  render();
}

function handleThemeChange() {
  state.theme = state.theme === "light" ? "dark" : "light";
  saveState();
  render();
}

function handleReset() {
  state.tasks = [];
  state.filter = "all";
  saveState();
  render();
}

// 8. Rendern und DOM verändern
function render() {
  renderTheme();
  renderFilterButtons();
  renderTasks();
  renderSummary();
}

function renderTheme() {
  document.body.classList.toggle("dark-theme", state.theme === "dark");
  themeButton.innerHTML = state.theme === "dark"
    ? '<i class="bi bi-sun me-2"></i>Theme wechseln'
    : '<i class="bi bi-moon-stars me-2"></i>Theme wechseln';
}

function renderFilterButtons() {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.filter);
  });

  const filterTexts = {
    all: "Alle Aufgaben werden angezeigt.",
    open: "Nur offene Aufgaben werden angezeigt.",
    done: "Nur erledigte Aufgaben werden angezeigt."
  };

  activeFilterText.textContent = filterTexts[state.filter];
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = "";
  emptyState.classList.toggle("d-none", visibleTasks.length > 0);

  visibleTasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.className = `task-item ${task.done ? "is-done" : ""}`;

    listItem.innerHTML = `
      <div class="task-main">
        <button class="task-check" type="button" aria-label="Aufgabe erledigt umschalten">
          <i class="bi ${task.done ? "bi-check-circle-fill" : "bi-circle"}"></i>
        </button>
        <div>
          <h3>${escapeHtml(task.title)}</h3>
          <div class="task-meta">
            <span>${escapeHtml(task.category)}</span>
            <span>${escapeHtml(task.priority)}</span>
          </div>
        </div>
      </div>
      <button class="btn btn-sm btn-outline-danger" type="button">
        <i class="bi bi-trash"></i>
      </button>
    `;

    const checkButton = listItem.querySelector(".task-check");
    const deleteButton = listItem.querySelector(".btn-outline-danger");

    checkButton.addEventListener("click", () => toggleTask(task.id));
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    taskList.appendChild(listItem);
  });
}

function renderSummary() {
  const doneTasks = state.tasks.filter((task) => task.done).length;
  const openTasks = state.tasks.length - doneTasks;
  const percent = state.tasks.length === 0 ? 0 : Math.round((doneTasks / state.tasks.length) * 100);

  totalCount.textContent = state.tasks.length;
  openCount.textContent = openTasks;
  doneCount.textContent = doneTasks;
  progressBar.style.width = `${percent}%`;
  progressBar.textContent = `${percent}%`;
}

function getVisibleTasks() {
  if (state.filter === "open") {
    return state.tasks.filter((task) => !task.done);
  }

  if (state.filter === "done") {
    return state.tasks.filter((task) => task.done);
  }

  return state.tasks;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

if (taskForm) {
  initApp();
}

// Bestehende Galerie-Funktion für gallery.html
const galleryButtons = document.querySelectorAll(".filter-btn[data-filter]");
const galleryItems = document.querySelectorAll(".gallery-item");

if (!taskForm && galleryButtons.length && galleryItems.length) {
  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      galleryButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;
      galleryItems.forEach((item) => {
        const category = item.dataset.category;
        item.classList.toggle("is-hidden", filter !== "all" && category !== filter);
      });
    });
  });
}

const imageModal = document.getElementById("imgModal");

if (imageModal) {
  imageModal.addEventListener("show.bs.modal", (event) => {
    const trigger = event.relatedTarget;
    const imageUrl = trigger?.getAttribute("data-img");
    const title = trigger?.getAttribute("data-title") || "Bild";

    document.getElementById("imgModalTitle").textContent = title;
    document.getElementById("imgModalImg").src = imageUrl;
    document.getElementById("imgModalImg").alt = title;
  });
}
