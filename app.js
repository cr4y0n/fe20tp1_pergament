let quill = new Quill('#editor', {
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      ['link'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  },
  placeholder: 'Write your note here...',
  theme: 'bubble'
});

let Delta = Quill.import('delta');

const saveNoteButton = document.querySelector('#saveBtn');
const createNoteButton = document.querySelector('#newNote-btn');
const noteList = document.querySelector('#note-list');
const content = document.querySelector('#content');
const editor = document.querySelector('#editor');
const CLS = document.querySelector('.localStorage');
const search = document.querySelector('#search-field');
const favBtn = document.querySelector('#fav-notes');

let notesArr = [];
let activeNoteID;
 

document.addEventListener('DOMContentLoaded', initialize);

 
function initialize() {
    document.querySelector('#fav-notes').addEventListener('click', function (evt) {
        renderNotesList(searchNotes('', favNotes));
    });
 
    search.addEventListener('input', function (evt) {
 
        evt.preventDefault();
        let searchStr = evt.target.value;
        // console.log(searchStr);
        if (searchStr.length >= 1) {
            // anävndare har sökt något
            let foundNotes = searchNotes(searchStr);
            renderNotesList(foundNotes);
        } else {
            // anv har tömt sökrutan
            renderNotesList(notesArr)
        }
    })
 
    document.querySelector('#saveBtn').addEventListener('click', function () {
        // console.log("cNB func ran");
        createNote();
        renderNotesList(notesArr);
    })
    noteList.addEventListener('click', function (evt) {
        let clickedLI = evt.target.closest('li');
        let clickedID = clickedLI.getAttribute('data-id');
        setEditor(readNote(clickedID));
    })
    let change = new Delta();
    quill.on('text-change', function (delta) {
        change = change.compose(delta);
    });
}

 
function createNote() {
    let noteObj = {
        id: Date.now(),
        title: '',
        content: quill.getContents(),
        text: quill.getText(),
        favourite: false
    }
    notesArr.push(noteObj);
    saveNotes();
    setActiveNoteID(noteObj.id);
    renderNotesList(notesArr);
}
 
function readNote(id) {
    // hitta ett noteobjekt vars id matchar med argumentet id
    return notesArr.find(note => note.id == id);
}
function setEditor(note) {
    // uppdatera innehållet i edtiron
    // sätt activenoteID
    quill.setContents(note.content);
    setActiveNoteID(note.id);
 
}
function updateNote(id) {
    // skapa INGEN ny note, istället uppdatera en befintlig note
    let noteObj = notesArr.find(note => note.id == id);
    noteObj.content = quill.getContents();
    noteObj.text = quill.getText();
    saveNotes();
    renderNotesList(notesArr);
 
}
function getNotes() {
    let notesArrStr = localStorage.getItem('notesArr');
    if (!notesArrStr) {
        return;
    }
    notesArr = JSON.parse(notesArrStr);
}
 
function saveNotes() {
    localStorage.setItem('notesArr', JSON.stringify(notesArr))
}
 
function noteObjToHTML(noteObj) {
    let LI = document.createElement('li');
    LI.setAttribute('data-id', noteObj.id);
    LI.innerHTML = `<span>${noteObj.favourite ? '★' : '☆'
        }</span > <p>${noteObj.text}</p>`
    return LI
}
 
function renderNotesList(arr) {
    noteList.innerHTML = '';
    arr.forEach(function (note) {
        noteList.appendChild(noteObjToHTML(note));
    })
}

function favNotes(note) {
  return note.favourite;
}
function searchNotes(str, func = function (note) { return note.text.toLowerCase().includes(str.toLowerCase()) }) {
  // filtrera och returnera samtliga notes som innehåller str
  return notesArr.filter(func)
}

function toggleFav(id) {
  let noteObj = notesArr.find(note => note.id == id);
  noteObj.favourite = !noteObj.favourite;
  saveNotes();
}
function clearLS() {
  localStorage.clear();
}

function clearEditor() {
  quill.setText('');
}

function setActiveNoteID(id) {
    activeNoteID = id;
}
 