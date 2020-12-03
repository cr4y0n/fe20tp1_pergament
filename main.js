let startBtn = document.querySelector('#startBtn')
let gotchaBtn = document.querySelector('#gotchaBtn')
let homeLink = document.querySelector('#homeLink')
const titlePage = document.querySelector('#titlePage')
const howItWorksPage = document.querySelector('#howItWorks')

startBtn.addEventListener('click', hideTitlePage)
homeLink.addEventListener('click', showTitlePage)
gotchaBtn.addEventListener('click', linkToApp)

function hideHowItWorks() {
  howItWorksPage.classList.add('hide-me')
}
function showTitlePage() {
  titlePage.classList.remove('hide-me')
  howItWorksPage.classList.remove('hide-me')
}
function hideTitlePage() {
  titlePage.classList.add('hide-me')
  howItWorksPage.classList.remove('hide-me')
}

function linkToApp() {
  const urlToApp = './app.html'
  window.open(urlToApp)
}

hideHowItWorks()

