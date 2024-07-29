let currentNoteId = null;

function addNewNote() {
  const headline = document.getElementById("headline").value;
  const note = document.getElementById("noteAreaText").value;
  const lastUpdated = new Date().toISOString();

  if (headline && note) {
    if (currentNoteId === null) {
      const id = Math.random();
      const save = {
        id: id,
        noteHeadline: headline,
        note: note,
        lastUpdated: lastUpdated,
      };

      saveToLocalStorage(save);
    } else {
      updateNoteInLocalStorage(currentNoteId, headline, note, lastUpdated);
    }

    document.getElementById("headline").value = "";
    document.getElementById("noteAreaText").value = "";
    currentNoteId = null;

    displayNotes();
  } else {
    alert(
      "Speichern nicht möglich, Bitte geben Sie eine Überschrift und eine Notiz ein."
    );
  }
}

function saveToLocalStorage(save) {
  const saveNotes = JSON.parse(localStorage.getItem("notes")) || [];
  saveNotes.push(save);
  localStorage.setItem("notes", JSON.stringify(saveNotes));
}

function updateNoteInLocalStorage(id, headline, note, lastUpdated) {
  const saveNotes = JSON.parse(localStorage.getItem("notes")) || [];
  saveNotes = saveNotes.map((note) => {
    if (note.id === id) {
      note.noteHeadline = headline;
      note.note = note;
      note.lastUpdated = lastUpdated;
    }
    return note;
  });
  localStorage.setItem("notes", JSON.stringify(saveNotes));
}

function deleteButton() {
  if (currentNoteId !== null) {
    deleteoteFromLocalStorage(currentNoteId);
    headlineValue;
    noteValue;
    currentNoteId = null;
    displayNotes();
  } else {
    alert("Keine Notiz zum Löschen ausgewählt.");
  }
}

function deleteoteFromLocalStorage(id) {
  const saveNotes = JSON.parse(localStorage.getItem("notes")) || [];
  saveNotes = saveNotes.filter((note) => note.id !== id);
  localStorage.setItem("notes", JSON.stringify(saveNotes));
}

function displayNotes() {
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  const saveNotes = JSON.parse(localStorage.getItem("notes")) || [];

  saveNotes.forEach((note) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.onclick = (event) => {
      event.stopPropagation();
      editNote(note.id);
    };

    noteDiv.innerHTML = `
            <p class="usbsr">Überschrift: ${escapeHtml(note.noteHeadline)}</p>
            <p class="usbsr">Notiz: ${escapeHtml(note.note)}</p>
            <div class="datum">Zuletzt aktualisiert: ${new Date(
              note.lastUpdated
            ).toLocaleString()}</div>
          `;

    notesList.appendChild(noteDiv);
  });
}

function editNote(id) {
  const saveNotes = JSON.parse(localStorage.getItem("notes")) || [];
  const noteToEdit = saveNotes.find((note) => note.id === id);

  if (noteToEdit) {
    document.getElementById("headline").value = noteToEdit.noteHeadline;
    document.getElementById("noteAreaText").value = noteToEdit.note;
    currentNoteId = id;
  }
}

function createNewNote() {
  headlineValue;
  noteValue;
  currentNoteId = null;
}

document.addEventListener("DOMContentLoaded", () => {
  displayNotes();
});

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
