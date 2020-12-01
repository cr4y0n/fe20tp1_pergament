//Selektorer för knappar
const startButton = document.querySelector('#startBtn')
const gotchaButton = document.querySelector('#gotchaBtn')
const homeLinkButton = document.querySelector('#homeLink')
const newNoteButton = document.querySelectorAll('#newBtn')
const saveButton = document.querySelector('#saveBtn')
const deleteButton = document.querySelector('#deleteBtn')
const myNotesButton = document.querySelector('#myNotes')
const favoritesButton = document.querySelector('#favorites')
const searchBtn = document.querySelector('#search')


//Selektorer för vyerna
const titlePage = document.querySelector('#titlePage')
const editorPage = document.querySelector('#notesContainer')
const howItWorksPage = document.querySelector('#howItWorks')

//Eventlisteners
startButton.addEventListener('click', hideTitlePage)
gotchaButton.addEventListener('click', hideHowItWorks)
homeLinkButton.addEventListener('click', showTitlePage)
//newNoteButton.addEventListener('click', showEditorAndCreateNewNote)
saveButton.addEventListener('click', saveNoteToLocalStorage)
deleteButton.addEventListener('click', deleteAllNotesInLocalStorage)


//Funktioner som ändrar vyerna
function hideHowItWorks() {
  howItWorksPage.classList.add('hide-me')
  showEditor()
  
}
function showHowItWorks() {
  howItWorksPage.classList.remove('hide-me')
}
function hideEditor(){
  editorPage.classList.add('hide-me')
}
function showEditor(){
  editorPage.classList.remove('hide-me')
}
function hideTitlePage() {
  titlePage.classList.add('hide-me')
  showHowItWorks()
  hideEditor()
}

function showTitlePage() {
  titlePage.classList.remove('hide-me')
  showStartPage()
}

function showStartPage(){
  hideHowItWorks()
  hideEditor()

}

showStartPage()

//Quill biblioteket
let quill = new Quill('#editor', {
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6,  false] }],
      ['bold', 'italic', 'underline','strike'],
      ['image', 'code-block'],
      ['link'],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  },
  placeholder: 'Write your note here...',
  theme: 'snow'  // or 'bubble'
});

function showEditorAndCreateNewNote() {
  
  /*quill.setContents([]) 
  quill.setText('')*/
  showEditor()
}

// Variabler som används i Funktionerna nedan
let noteObject = {};
let allNotesObjects = [];
let noteObjectAsString = '';

//Konstant som ändras i localstorage
const NOTE_INDEX_VALUE = 'numberOfNotesInLocalStorage'

if(localStorage.getItem(NOTE_INDEX_VALUE)) {
  console.log('Det finns noteIndexValue i LS', localStorage.getItem(NOTE_INDEX_VALUE))
}else {
  console.log('det finns ingen noteIndexValue')
  localStorage.setItem(NOTE_INDEX_VALUE, 0)
}

// Returnerar Objekt med alla Notes
function readAllNotes(){
  const currentNoteIndexValueAsString = localStorage.getItem(NOTE_INDEX_VALUE)
  const currentNoteIndexValueAsInteger = parseInt(currentNoteIndexValueAsString)
  const allNotes = allNotesObjects
  for(let i = 0; i < currentNoteIndexValueAsInteger; i++){
    let noteKey = 'note-' + i
    const objectInLocalStorageAsString = localStorage.getItem(noteKey)
    const objectInLocalStorage = JSON.parse(objectInLocalStorageAsString)
    allNotes.push(objectInLocalStorage)
  }
  console.log('AllNotes: ', allNotes)
  return allNotes
}
// Inkrementerar Note Index i LocalStorage
function updateNoteIndexValueWithOne(){
  const currentNoteIndexValueAsString = localStorage.getItem(NOTE_INDEX_VALUE)
  const currentNoteIndexValueAsInteger = parseInt(currentNoteIndexValueAsString)
  const nextNoteIndexValue = currentNoteIndexValueAsInteger + 1
  localStorage.setItem(NOTE_INDEX_VALUE, nextNoteIndexValue)
}
// Sparar Notes i Localstorage som sträng
function saveNoteToLocalStorage(event) {
  console.log('saveNoteToLocalStorage', event)
  // definiera notekey 
  let noteKey = 'note-' + localStorage.getItem(NOTE_INDEX_VALUE)
  // lägg till content i ett delta objekt
  window.delta = quill.getContents();
  quill.setContents(window.delta);
  // sätter delta quillobjektet till det globala objektet
  noteObject = window.delta;
  noteObject.noteTitle = titleInput.value
  console.log('NoteObject with notetitle: ', noteObject)
  // gör om objektet till en sträng som kan sparas i LS
  noteObjectAsString = JSON.stringify(noteObject)
  localStorage.setItem(noteKey, noteObjectAsString)
  updateNoteIndexValueWithOne()
  createLiElementInUl(event)
};
// Rensar innehållet i LocalStorage, Editorn, TitelInput och Listan på notes
function deleteAllNotesInLocalStorage(){
  //Clears LocalStorage
  localStorage.clear();
  //Clears editor
  quill.setContents([]);
  titleInput.value = '';
  notesList.innerHTML = '';
}


//Selektorer
const titleButton = document.querySelector('#titleBtn')
const notesList = document.querySelector('#savedNotesList')
const titleInput = document.querySelector('#titleInput')
//titleButton.addEventListener('click', createLiElementInUl)
myNotesButton.addEventListener('click', readAllNotes)

// Funktion som Lägger till En Li för Titeln i Listan
function createLiElementInUl(event){
    //Hindrar form att skickas
    event.preventDefault()
    // 
    const notesListUl = notesList
    console.log('notesListUl: ', notesListUl)
    // Create LI
    
    const newLiElement = document.createElement('li')
    newLiElement.classList.add('listItem')
    newLiElement.innerText = titleInput.value
    notesListUl.appendChild(newLiElement)
}

