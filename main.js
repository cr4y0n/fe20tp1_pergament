
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

var saveButton = document.querySelector("#saveBtn");
saveButton.addEventListener('click', function() {
  // lägg till content i ett delta objekt
  window.delta = quill.getContents();
  quill.setContents(window.delta);
  // sätter delta objektet till det globala objektet
  noteObject = window.delta;
  // gör om objektet till en sträng som kan sparas i LS
  let noteObject_string = JSON.stringify(noteObject)
  localStorage.setItem("note", noteObject_string)

});