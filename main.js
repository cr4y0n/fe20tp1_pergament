
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


const inputTitle = document.querySelector("#inputTitle") //det som skrivs in i input rutan sparas i konstanten inputTitle
const saveBtn = document.querySelector("#saveBtn") //vi tilldelar knappen en konstant för att kunna göra det nedre steget
saveBtn.addEventListener('click', localSave) //sidan "lyssnar"/läser av när vi klickar på knappen och vi vill skicka det vi sparar till localSave
// saveBtn.addEventListener('click', localSaveEditor)

function localSave() {
  let noteTitle = inputTitle.value; //det som skrivs in i vår "titelruta", dess värde, tilldelas variabeln noteTitle
  localStorage.setItem('title', noteTitle) //variabeln och dens "key name" sätts in i localstorage när funktionen körs
  var delta = quill.getContents();
  localStorage.setItem('text',JSON.stringify(delta));
  
}

quill.setContents(JSON.parse(localStorage.getItem('text')));

// const tempQuillObject = {};
// det som skrivs in i quill-editorn sparas i variabeln inputEditor som ska sparas i objektet tempQuillObject. 
// sen ska tempQuillObject in i functionen för att stringify'as innan sparning

function localSaveEditor() {
  // window.delta = inputEditor??
  
}

