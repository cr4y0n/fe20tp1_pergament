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

//const saveNoteButton = document.querySelector('#save-btn');
//const createNoteButton = document.querySelector('#newNote-btn');
const noteList = document.querySelector('#note-list');
const content = document.querySelector('#content');
const editor = document.querySelector('#editor');
const CLS = document.querySelector('#delete-btn');
const search = document.querySelector('#search-field');
const favBtn = document.querySelector('#fav-notes');

let notesArr = [];
let activeNoteID;


document.addEventListener('DOMContentLoaded', initialize);

function findTitle() {
    let editorContents = document.querySelector('.ql-editor');
    let endOfFirstLine = editorContents.innerText.indexOf('\n');
    let firstLine = quill.getText(0, endOfFirstLine);
    return firstLine
}

function findText() {
    let allText = document.querySelector('.ql-editor');
    let allTextIndex = allText.length;
    let endOfTitle = allText.innerText.indexOf('\n');
    let restOfText = quill.getText(endOfTitle, allTextIndex)
    return restOfText;
}

function initialize() {
    document.querySelector('#fav-notes').addEventListener('click', function (evt) {
        renderNotesList(searchNotes('', favNotes));
    });

    search.addEventListener('input', function (evt) {

        evt.preventDefault();
        let searchStr = evt.target.value;
        if (searchStr.length >= 1) {
            let foundNotes = searchNotes(searchStr);
            renderNotesList(foundNotes);
        } else {
            renderNotesList(notesArr)
        }
    })

    CLS.addEventListener('click', function () {
        clearEditor()
    });

    document.querySelector('#save-btn').addEventListener('click', function () {
        createNote();
        renderNotesList(notesArr);
    })
    noteList.addEventListener('click', function (evt) {
        let clickedLI = evt.target.closest('li');
        let clickedID = clickedLI.getAttribute('data-id');
        // som det är nu, resulterar alla klick på en note
        // i en "load", dvs editorn sätts till det innehåller
        // TODO: kolla om anv klickade på stjärnan
        // hitta rätt note mha id let clickedNote = notesArr.find...
        // clickedNote.favourite = !clickedNote.favourite
        // savenotes
        // if (evt.classList.contains('fa-star'))
        setEditor(readNote(clickedID));
    })
    let change = new Delta();
    quill.on('text-change', function (delta) {
        change = change.compose(delta);
    });
}

function savedDate(id) {
    var date = new Date(id);
    return date.toLocaleString();
}

function createNote() {
    let noteObj = {
        id: Date.now(),
        title: findTitle(),
        content: quill.getContents(),
        text: findText(),
        favourite: false,
    }
    notesArr.push(noteObj);
    saveNotes();
    setActiveNoteID(noteObj.id);
    renderNotesList(notesArr);
}

function readNote(id) {
    return notesArr.find(note => note.id == id);
}

function setEditor(note) {
    quill.setContents(note.content);
    setActiveNoteID(note.id);

}

function updateNote(id) {
    let noteObj = notesArr.find(note => note.id == id);
    noteObj.content = quill.getContents();
    noteObj.text = quill.getText();
    saveNotes();
    renderNotesList(notesArr);

}

function getNotes() {
    let notesArrStr = localStorage.getItem('notesArr');
    if (!notesArrStr) {
        return;
    }
    notesArr = JSON.parse(notesArrStr);
}

function saveNotes() {
    localStorage.setItem('notesArr', JSON.stringify(notesArr))
}

function noteObjToHTML(noteObj) {
    let LI = document.createElement('li');
    LI.classList.add('note-li');
    LI.setAttribute('data-id', noteObj.id);
    LI.innerHTML = `<span>${noteObj.favourite ? '★' : '☆'}</span> <h3>${savedDate(noteObj.id)}</h3> <h4>${noteObj.title}</h4> <p>${noteObj.text}</p>`
    return LI
}

function renderNotesList(arr) {
    noteList.innerHTML = '';
    arr.forEach(function (note) {
        noteList.appendChild(noteObjToHTML(note));
    })
}

function favNotes(note) {
    return note.favourite;
}

function searchNotes(str, func = function (note) {
    return note.text.toLowerCase().includes(str.toLowerCase())
}) {
    return notesArr.filter(func)
}

function toggleFav(id) {
    let noteObj = notesArr.find(note => note.id == id);
    noteObj.favourite = !noteObj.favourite;
    saveNotes();
}

function clearLS() {
    localStorage.clear();
}

function clearEditor() {
    quill.setText('');
}

function setActiveNoteID(id) {
    activeNoteID = id;
}