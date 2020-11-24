
let startBtn = document.querySelector('#startBtn')
let homeLink = document.querySelector('#homeLink')
const titlePage = document.querySelector('#titlePage')
const editorPage = document.querySelector('#editor')

startBtn.addEventListener('click', hideTitlePage)
homeLink.addEventListener('click', showTitlePage)

function hideTitlePage() {
  titlePage.classList.add('hide-me')
}
function showTitlePage() {
  titlePage.classList.remove('hide-me')
}


var quill = new Quill('#editor', {
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