const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function generateId() {
    return +new Date();
}

function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const checkBook = document.getElementById("inputBookIsCompleted").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, checkBook);
    books.push(bookObject);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function eraseText() {
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsCompleted").checked = false;
}

function makeBook(bookObject) {
 
    const textBookTitle = document.createElement("h3");
    textBookTitle.innerText = bookObject.title;

    const textBookAuthor = document.createElement("p");
    textBookAuthor.innerText = "Penulis: " + bookObject.author;

    const textBookYear = document.createElement("p");
    textBookYear.innerText = "Tahun: " + bookObject.year;

    const container = document.createElement("article");
    container.classList.add("book_item")
    container.append(textBookTitle, textBookAuthor, textBookYear);
    container.setAttribute("id", `book-${bookObject.id}`);

    if(bookObject.isCompleted){

        const undoButton = document.createElement("button");
        undoButton.classList.add("green")
        undoButton.innerText = "Belum Selesai Dibaca";
        undoButton.addEventListener("click", function () {
            undoBookFromCompleted(bookObject.id);
        });
  
        const trashButton = document.createElement("button");
        trashButton.classList.add("red")
        trashButton.innerText = "Hapus Buku";
        trashButton.addEventListener("click", function () {
            const remove = confirm("Lanjutkan Hapus Buku?");
            if(remove == true) {
                removeBook(bookObject.id);
            } else {
                return;
            }
        });

        const buttons = document.createElement("div");
        buttons.classList.add("action")
        buttons.append(undoButton, trashButton);
  
        container.append(buttons);
    } else {

        const checkButton = document.createElement("button");
        checkButton.classList.add("green")
        checkButton.innerText = "Selesai Dibaca";
        checkButton.addEventListener("click", function () {
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("red")
        trashButton.innerText = "Hapus Buku";
        trashButton.addEventListener("click", function () {
            const remove = confirm("Lanjutkan Hapus Buku?");
            if(remove == true) {
                removeBook(bookObject.id);
            } else {
                return;
            }
        });

        const buttons = document.createElement("div");
        buttons.classList.add("action")
        buttons.append(checkButton, trashButton);
  
        container.append(buttons);
    }
    return container;
}

function addBookToCompleted(bookId) {
 
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for(index in books){
        if(books[index].id === bookId){
            return index
        }
    }
    return -1
}

function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if(data !== null){
        for(book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {

    const submitBook = document.getElementById("inputBook");

    submitBook.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
        eraseText();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {

    const incompletedBookList = document.getElementById("incompletedBookshelfList");
    incompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completedBookshelfList");
    completedBookList.innerHTML = "";

    for(bookItem of books){
      const bookElement = makeBook(bookItem);

        if(bookItem.isCompleted == false)
            incompletedBookList.append(bookElement);
        else
            completedBookList.append(bookElement);
    }
});

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.getElementById('searchSubmit').addEventListener("click", function (event) {
    event.preventDefault();

    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item > h3');

    for (book of bookList) {
        if (searchBook === book.innerText.toLowerCase()) {
            book.parentElement.style.display = "block";
        } else {
            book.parentElement.style.display = "none";
        }
    }
});

let anchorSelector = 'a[href^="#"]';
let anchorList = document.querySelectorAll(anchorSelector);
         
anchorList.forEach(link => {
    link.onclick = function (event) {
        event.preventDefault();
         
        let destination = document.querySelector(this.hash);
        destination.scrollIntoView({
            behavior: 'smooth'
        });
    }
});