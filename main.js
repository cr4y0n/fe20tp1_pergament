
let startBtn = document.querySelector('#startBtn')
let gotchaBtn = document.querySelector('#gotchaBtn')
let homeLink = document.querySelector('#homeLink')
const titlePage = document.querySelector('#titlePage')
const editorPage = document.querySelector('#editor')
const howItWorksPage = document.querySelector('#howItWorks')

startBtn.addEventListener('click', hideTitlePage)
homeLink.addEventListener('click', showTitlePage)
gotchaBtn.addEventListener('click', hideHowItWorks)

function hideHowItWorks() {
  howItWorksPage.classList.add('hide-me')
}
function showTitlePage() {
  titlePage.classList.remove('hide-me')
}
function hideTitlePage() {
  titlePage.classList.add('hide-me')
}


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

let noteObject = {};
let noteObjectAsString = '';
let saveButton = document.querySelector('#saveBtn');

const NOTE_INDEX_VALUE = 'numberOfNotesInLocalStorage'
/*
if(localStorage.getItem(NOTE_INDEX_VALUE)) {
  console.log('Det finns noteIndexValue i LS', localStorage.getItem(NOTE_INDEX_VALUE))
}else {
  console.log('det finns ingen noteIndexValue')
  localStorage.setItem(NOTE_INDEX_VALUE, 0)
}
*/
function readAllNotes(){
  const currentNoteIndexValueAsString = localStorage.getItem(NOTE_INDEX_VALUE)
  const currentNoteIndexValueAsInteger = parseInt(currentNoteIndexValueAsString)
  const allNotes = []
  for( let i = 0; i < currentNoteIndexValueAsInteger; i++){
    let noteKey = 'note-' + i
    const objectInLocalStorageAsString = localStorage.getItem(noteKey)
    const objectInLocalStorage = JSON.parse(objectInLocalStorageAsString)
    allNotes.push(objectInLocalStorage)
  }
  return allNotes
}

function updateNoteIndexValueWithOne(){
  const currentNoteIndexValueAsString = localStorage.getItem(NOTE_INDEX_VALUE)
  const currentNoteIndexValueAsInteger = parseInt(currentNoteIndexValueAsString)
  const nextNoteIndexValue = currentNoteIndexValueAsInteger + 1
  localStorage.setItem(NOTE_INDEX_VALUE, nextNoteIndexValue)
}

saveButton.addEventListener('click', function() {
  
  // definiera notekey som string
  let noteKey = 'note-' + localStorage.getItem(NOTE_INDEX_VALUE)
  // lägg till content i ett delta objekt
  window.delta = quill.getContents();
  quill.setContents(window.delta);
  // sätter delta objektet till det globala objektet
  noteObject = window.delta;
  // gör om objektet till en sträng som kan sparas i LS
  noteObjectAsString = JSON.stringify(noteObject)
  localStorage.setItem(noteKey, noteObjectAsString)
  updateNoteIndexValueWithOne()
});