let currentNoteId = null;

function addNewNote() {
  const headline = document.getElementById("headline").value;
  const noteContent = document.getElementById("noteAreaText").value;
  const lastUpdated = new Date().toISOString();

  if (headline && noteContent) {
    if (currentNoteId === null) {
      const id = Math.random();
      const save = {
        id: id,
        noteHeadline: headline,
        note: noteContent,
        lastUpdated: lastUpdated,
      };

      saveToLocalStorage(save);
    } else {
      updateNoteInLocalStorage(
        currentNoteId,
        headline,
        noteContent,
        lastUpdated
      );
    }

    document.getElementById("headline").value = "";
    document.getElementById("noteAreaText").value = "";
    currentNoteId = null;

    displayNotes();
  } else {
    alert(
      "Speichern nicht möglich, bitte geben Sie eine Überschrift und eine Notiz ein."
    );
  }
}

function saveToLocalStorage(save) {
  const saveNotes = JSON.parse(localStorage.getItem("notes")) || [];
  saveNotes.push(save);
  localStorage.setItem("notes", JSON.stringify(saveNotes));
}

function updateNoteInLocalStorage(id, headline, noteContent, lastUpdated) {
  const saveNotes = JSON.parse(localStorage.getItem("notes")) || [];
  const updatedNotes = saveNotes.map((note) => {
    if (note.id === id) {
      return {
        ...note,
        noteHeadline: headline,
        note: noteContent,
        lastUpdated: lastUpdated,
      };
    }
    return note;
  });
  localStorage.setItem("notes", JSON.stringify(updatedNotes));
}

function deleteButton() {
  if (currentNoteId !== null) {
    deleteNoteFromLocalStorage(currentNoteId);
    currentNoteId = null;
    displayNotes();
  } else {
    alert("Keine Notiz zum Löschen ausgewählt.");
  }
}

function deleteNoteFromLocalStorage(id) {
  const saveNotes = JSON.parse(localStorage.getItem("notes")) || [];
  const updatedNotes = saveNotes.filter((note) => note.id !== id);
  localStorage.setItem("notes", JSON.stringify(updatedNotes));
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
  document.getElementById("headline").value = "";
  document.getElementById("noteAreaText").value = "";
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
