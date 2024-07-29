let currentNoteId = null;

function addNewNote() {
  const ueber = document.getElementById("ueberschrift").value;
  const notiz = document.getElementById("notiz").value;
  const lastUpdated = new Date().toISOString();

  if (ueber && notiz) {
    if (currentNoteId === null) {
      const id = Math.random();
      const speichern = {
        id: id,
        notizenUeberschrift: ueber,
        notiz: notiz,
        lastUpdated: lastUpdated,
      };

      saveToLocalStorage(speichern);
    } else {
      updateNoteInLocalStorage(currentNoteId, ueber, notiz, lastUpdated);
    }

    document.getElementById("ueberschrift").value = "";
    document.getElementById("notiz").value = "";
    currentNoteId = null;

    displayNotes();
  } else {
    alert(
      "Speichern nicht möglich, Bitte geben Sie eine Überschrift und eine Notiz ein."
    );
  }
}

function saveToLocalStorage(speichern) {
  let gespeicherteNotizen = JSON.parse(localStorage.getItem("notizen")) || [];
  gespeicherteNotizen.push(speichern);
  localStorage.setItem("notizen", JSON.stringify(gespeicherteNotizen));
}

function updateNoteInLocalStorage(id, ueber, notiz, lastUpdated) {
  let gespeicherteNotizen = JSON.parse(localStorage.getItem("notizen")) || [];
  gespeicherteNotizen = gespeicherteNotizen.map((note) => {
    if (note.id === id) {
      note.notizenUeberschrift = ueber;
      note.notiz = notiz;
      note.lastUpdated = lastUpdated;
    }
    return note;
  });
  localStorage.setItem("notizen", JSON.stringify(gespeicherteNotizen));
}

function loeschen() {
  if (currentNoteId !== null) {
    loescheNoteFromLocalStorage(currentNoteId);
    document.getElementById("ueberschrift").value = "";
    document.getElementById("notiz").value = "";
    currentNoteId = null;
    displayNotes();
  } else {
    alert("Keine Notiz zum Löschen ausgewählt.");
  }
}

function loescheNoteFromLocalStorage(id) {
  let gespeicherteNotizen = JSON.parse(localStorage.getItem("notizen")) || [];
  gespeicherteNotizen = gespeicherteNotizen.filter((note) => note.id !== id);
  localStorage.setItem("notizen", JSON.stringify(gespeicherteNotizen));
}

function displayNotes() {
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  let gespeicherteNotizen = JSON.parse(localStorage.getItem("notizen")) || [];

  gespeicherteNotizen.forEach((note) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.onclick = (event) => {
      event.stopPropagation();
      editNote(note.id);
    };

    noteDiv.innerHTML = `
            <p class="usbsr">Überschrift: ${escapeHtml(
              note.notizenUeberschrift
            )}</p>
            <p class="usbsr">Notiz: ${escapeHtml(note.notiz)}</p>
            <div class="datum">Zuletzt aktualisiert: ${new Date(
              note.lastUpdated
            ).toLocaleString()}</div>
          `;

    notesList.appendChild(noteDiv);
  });
}

function editNote(id) {
  let gespeicherteNotizen = JSON.parse(localStorage.getItem("notizen")) || [];
  const noteToEdit = gespeicherteNotizen.find((note) => note.id === id);

  if (noteToEdit) {
    document.getElementById("ueberschrift").value =
      noteToEdit.notizenUeberschrift;
    document.getElementById("notiz").value = noteToEdit.notiz;
    currentNoteId = id;
  }
}

function createNewNote() {
  document.getElementById("ueberschrift").value = "";
  document.getElementById("notiz").value = "";
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

function unescapeHtml(safe) {
  return safe
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}
