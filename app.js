/*CONSTANTS*/
const saveNoteButton = document.querySelector('#save-btn');
const noteList = document.querySelector('#notes-list');
const content = document.querySelector('#content');
const editor = document.querySelector('#editor');
const clear = document.querySelector('#clear-btn');
const search = document.querySelector('#search-field');
const favBtn = document.querySelector('#favorite-notes-item');
const clearAllNotes = document.querySelector('#clearAllNotes');
const delBtn = document.querySelector('#deleted-notes-item');
const myNotesBtn = document.querySelector('#saved-notes-item');

/*VARIABLES*/
let notesArr = [];
let activeNoteID;
let isShowingNotes = false;
let isShowingFavourites = false;
let isShowingRemoved = false;

// DELTED NOTES
function delNotes(note) {
  console.log(note.removed)
  return note.removed;
}


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

  myNotesBtn.addEventListener('click', function(evt) {
    myNotesBtn.className = "highlightedElement";
    favBtn.className = "";
    delBtn.className = "";
    isShowingNotes = !isShowingNotes;
    renderNotesList(notesArr);
  })


  favBtn.addEventListener('click', function(evt) {
    favBtn.className = "highlightedElement";
    myNotesBtn.className = "";
    delBtn.className = "";
    isShowingFavourites = !isShowingFavourites;
    if (isShowingFavourites) {
      renderNotesList(searchNotes('', favNotes));
    } else {
      renderNotesList(notesArr)
    }
  });


  delBtn.addEventListener('click', function(evt) {
    delBtn.className = "highlightedElement";
    myNotesBtn.className = "";
    favBtn.className = "";
    isShowingRemoved = !isShowingRemoved;
    if (isShowingRemoved) {
    renderAllNotesList(searchNotes('', delNotes));
  } else  {
    renderNotesList(notesArr)
  }
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
    if (activeNoteID) {
      updateNote()
    } else {
    createNote();
    renderNotesList(notesArr);
  }
  });

  noteList.addEventListener('click', function(evt) {
    let clickedLI = evt.target.closest('li');
    let clickedID = clickedLI.getAttribute('data-id');

    if (evt.target.classList.contains('fa-star')) {
      toggleFav(clickedID);
    } if (evt.target.classList.contains('fa-trash')) {
      toggleDel(clickedID);
    } if (evt.target.classList.contains('fa-recycle')) {
      toggleBack(clickedID);
  } else {
    setEditor(readNote(clickedID));
  }
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
  // clearEditor();
}

// UPDATE NOTE
function updateNote() {
  let noteToUpdate = readNote(activeNoteID)
  noteToUpdate.content = quill.getContents();
  noteToUpdate.text = findText();
  noteToUpdate.title = findTitle();
  let newNotesArr = notesArr.filter(note => note.id !== activeNoteID);
  notesArr = newNotesArr;
  notesArr.unshift(noteToUpdate);
  saveNotes();
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
  <span><i class="fa${noteObj.favourite ? 's' : 'r'} fa-star star"></i></span>
  <span><i class="fas fa-${noteObj.removed ? 'recycle' : 'trash'} garbage"></i></span>
  <h2>${noteObj.title}</h2> 
  <h3>${savedDate(noteObj.id)}</h3> 
  <p>${noteObj.text}</p>`
  return LI;
}

function renderNotesList(arr) {
  noteList.innerHTML = '';
  arr.filter(note => !note.removed).forEach(function (note) {
      noteList.appendChild(noteObjToHTML(note));
  });
}

function renderAllNotesList(arr) {
  noteList.innerHTML = '';
  arr.forEach(function (note) {
      noteList.appendChild(noteObjToHTML(note));
  });
}
function renderRemovedNotesList(arr) {
  noteList.innerHTML = '';
  arr.filter(note => note.removed).forEach(function (note) {
      noteList.appendChild(noteObjToHTML(note));
  });
}

//SEARCH NOTES
function searchNotes(str, func = function (note) {
  return note.text.toLowerCase().includes(str.toLowerCase())
}) {
  console.log("func is " + func)
  let filteredArr = notesArr.filter(func);
  console.log(filteredArr)
  return filteredArr
}

//FAVORITE NOTES
function favNotes(note) {
  return note.favourite;
}


function toggleDel(id) {
  let noteObj = notesArr.find(note => note.id == id);
  noteObj.removed = !noteObj.removed;
  saveNotes();
  renderNotesList(notesArr);
}

function toggleBack(id) {
  let noteObj = notesArr.find(note => note.id == id);
  noteObj.removed = !noteObj.removed;
  saveNotes();
  console.log('toggle back clicked');
  renderNotesList(notesArr);
}

function toggleFav(id) {
  let noteObj = notesArr.find(note => note.id == id);
  noteObj.favourite = !noteObj.favourite;
  saveNotes();
  renderNotesList(notesArr);

}

function purgeNote(id) {
  let newNotesArr = notesArr.filter(note => note.id !== id);
  notesArr = newNotesArr;
  saveNotes();
  renderNotesList(notesArr);
}

//CLEAR LS
function clearLS() {
  localStorage.clear();
}

//CLEAR EDITOR
function clearEditor() {
  quill.setText('');
  setActiveNoteID(null)
}

function setActiveNoteID(id) {
  activeNoteID = id;
}