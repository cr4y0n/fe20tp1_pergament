/*CONSTANTS*/
const saveNoteButton = document.querySelector('#save-btn');
const createNoteButton = document.querySelector('#new-note-btn');
const noteList = document.querySelector('#notes-list');
const content = document.querySelector('#content');
const editor = document.querySelector('#editor');
const clear = document.querySelector('#clear-btn');
const search = document.querySelector('#search-field');
const favBtn = document.querySelector('#favorite-notes-item');
const clearAllNotes = document.querySelector('#clearAllNotes');
const removedBtn = document.querySelector('.fa-times');


/*VARIABLES*/
let notesArr = [];
let activeNoteID;


/*QUILL*/
let quill = new Quill('#editor', {
  modules: {
      toolbar: [
          [{
              header: [1, 2, 3, false]
          }],
          ['bold', 'italic', 'underline'],
          ['link'],
          [{
              'list': 'ordered'
          }, {
              'list': 'bullet'
          }],
          ['clean']
      ]
  },
  placeholder: 'Write your note here...',
  theme: 'bubble'
});
let Delta = Quill.import('delta');


// -- INITIALIZE --
document.addEventListener('DOMContentLoaded', initialize);


// EVENTLISTENERS
function initialize() {
  document.querySelector('#favorite-notes-item').addEventListener('click', function(evt) {
    renderNotesList(searchNotes('', favNotes));
  });

  search.addEventListener('input', function(evt) {
    evt.preventDefault();
    let searchStr = evt.target.value;
    if (searchStr.length >= 1) {
      let foundNotes = searchNotes(searchStr);
      renderNotesList(foundNotes);
    } else {
      renderNotesList(notesArr)
    }
  });

  clear.addEventListener('click', function() {
      clearEditor()
  });

  saveNoteButton.addEventListener('click', function() {
    createNote();
    renderNotesList(notesArr);
  });

  noteList.addEventListener('click', function(evt) {
    let clickedLI = evt.target.closest('li');
    let clickedID = clickedLI.getAttribute('data-id');
    // let clickedNote
    // if (evt.classList.contains('fa-star')) {
    //   let fav = evt.target.parentElement.dataset.key;
    //   toggleFav(fav);
    // } 
    setEditor(readNote(clickedID));
  });

getNotes();
renderNotesList(notesArr);
};

// FUNCTIONS

//CREATE NOTE
function createNote() {
  let noteObj = {
      id: Date.now(),
      title: findTitle(),
      content: quill.getContents(),
      text: findText(),
      favourite: false,
      removed: false,
  }
  notesArr.unshift(noteObj);
  saveNotes();
  setActiveNoteID(noteObj.id);
  renderNotesList(notesArr);
}

//TITLE - in note-list
function findTitle() {
  let editorContents = document.querySelector('.ql-editor');
  let endOfFirstLine = editorContents.innerText.indexOf('\n');
  let firstLine = quill.getText(0, endOfFirstLine);
  return firstLine;
}

// TEXT in note-list
function findText() {
  let allText = document.querySelector('.ql-editor');
  let allTextIndex = allText.length;
  let endOfTitle = allText.innerText.indexOf('\n');
  let restOfText = quill.getText(endOfTitle, allTextIndex);
  return restOfText.slice(0,100);
}

//DATE
function savedDate(id) {
  var date = new Date(id);
  return date.toLocaleString();
}

//READ NOTE
function readNote(id) {
  return notesArr.find(note => note.id == id);
}

// SET EDITOR - tryck på en note och ta in den i editor
function setEditor(note) {
  quill.setContents(note.content);
  setActiveNoteID(note.id);
}

// GET NOTE - hämtar från storage, visar i DOM
function getNotes() {
  let notesArrStr = localStorage.getItem('notesArr');
  if (!notesArrStr) {
      return;
  }
  notesArr = JSON.parse(notesArrStr);
}
// SAVE NOTE - sparar i LS
function saveNotes() {
  localStorage.setItem('notesArr', JSON.stringify(notesArr));
}

// ADDING TO DOM - lägger till note i noteList
function noteObjToHTML(noteObj) {
  let LI = document.createElement('li');
  LI.setAttribute('data-id', noteObj.id);
  LI.innerHTML = `
  <span>${noteObj.favourite ? '<i class="far fa-star unfilled"></i>' : '<i class="fas fa-star"></i>'}</span> 
  <i class="fas fa-trash removed"></i> 
  <h2>${noteObj.title}</h2> 
  <h3>${savedDate(noteObj.id)}</h3> 
  <p>${noteObj.text}</p>`
  return LI;
}

function renderNotesList(arr) {
  noteList.innerHTML = '';
  arr.forEach(function (note) {
      noteList.appendChild(noteObjToHTML(note));
  });
}

//SEARCH NOTES
function searchNotes(str, func = function (note) {
  return note.text.toLowerCase().includes(str.toLowerCase())
}) {
  return notesArr.filter(func)
}

//FAVORITE NOTES
function favNotes(note) {
  return note.favourite;
}

function toggleFav(id) {
  let noteObj = notesArr.find(note => note.id == id);
  noteObj.favourite = !noteObj.favourite;
  saveNotes();
}

//CLEAR LS
function clearLS() {
  localStorage.clear();
}

//CLEAR EDITOR
function clearEditor() {
  quill.setText('');
}

function setActiveNoteID(id) {
  activeNoteID = id;
}

