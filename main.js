
let startBtn = document.querySelector('#startBtn')
let homeLink = document.querySelector('#homeLink')
const titlePage = document.querySelector('#titlePage')
const editorPage = document.querySelector('#editor')

startBtn.addEventListener('click', hideTitlePage)
homeLink.addEventListener('click', showTitlePage)

// Hej
function hideTitlePage() {
  titlePage.classList.add('hide-me')
}
function showTitlePage() {
  titlePage.classList.remove('hide-me')
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

let noteObject = {}

/*
steg 1. ta tillbaks quill. 
steg 2. hitta på ett note-objekt. 
steg 3. hur ladda data från quill till note-objektet? 
steg 4. hur ladda data från noteobjektet till quill. (tips: getContents och setContents).
steg 5. gör en array av noteobjekt. 
steg 6. spara hela arrayen i LS, 
steg 7. ladda hela arrayen från LS 
*/