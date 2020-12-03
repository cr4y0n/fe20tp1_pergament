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

let noteList = [];
const inputTitle = document.querySelector("#inputTitle") //det som skrivs in i input rutan sparas i konstanten inputTitle
const saveBtn = document.querySelector("#saveBtn") //vi tilldelar knappen en konstant för att kunna göra det nedre steget
//let noteTitle = inputTitle.value; //det som skrivs in i vår "titelruta", dess värde, tilldelas variabeln noteTitle
let delta = quill.getContents();



//EVENTLISTENER
saveBtn.addEventListener('click', addNote) //sidan "lyssnar"/läser av när vi klickar på knappen och vi vill skicka det vi sparar till localSave

 //FUNKTIONER
function addNote(text) {
  const note = {
    title: inputTitle.value,
    text: quill.getText(delta),
    id: Date.now(),
  };

  noteList.push(note);
  // console.log('NoteList: ', noteList);
  
  localStorage.setItem('noteObjects', JSON.stringify(noteList));//variabeln och dens "key name" sätts in i localstorage när funktionen kör
  createLiElement();

  function displayNote() { //[note, note2, note3] 
    let item = noteList;
    let ul = document.querySelector('ul');
    let li = document.querySelector('li');

    li.appendChild(document.createTextNode(item));
    let span = document.createElement('span');
    span.innerText = note.id;
  }

}
const notesListUl = document.querySelector("#savedNotesList");

function createLiElement() {
  let newLiElement = document.createElement("li")
  newLiElement.classList.add("noteLi");
  let x = localStorage.getItem('noteObjects');
  newLiElement.innerText = x;
  //newLiElement.innerHTML(`<p>${note.text}</p>`);
  
  notesListUl.appendChild(newLiElement);
}




/*


quill.setContents(JSON.parse(localStorage.getItem('text')));

// const tempQuillObject = {};
// det som skrivs in i quill-editorn sparas i variabeln inputEditor som ska sparas i objektet tempQuillObject. 
// sen ska tempQuillObject in i functionen för att stringify'as innan sparning

function localSaveEditor() {
  // window.delta = inputEditor??
  
}

*/