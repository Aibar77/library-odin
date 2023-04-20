class Book {
  constructor(
    title = "Unknown",
    author = "Unknown",
    pages = "0",
    isRead = false
  ) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
}

class Library {
  constructor() {
    this.books = [];
  }
  addBook(newBook) {
    if (!this.isInLibrary(newBook)) {
      this.books.push(newBook);
    }
  }
  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title);
  }
  getBook(title) {
    return this.books.find((book) => book.title === title);
  }
  isInLibrary(newBook) {
    return this.books.some((book) => book.title === newBook.title);
  }
}
const library = new Library();

const accountBtn = document.querySelector(".account");
const addBookBtn = document.querySelector(".addbook");
const addBookModal = document.querySelector("#addBookModal");
const overlay = document.querySelector("#overlay");
const addBookForm = document.querySelector("#addBookForm");
const booksGrid = document.querySelector(".grid");

const openAddBookModal = () => {
  addBookForm.reset();
  addBookModal.classList.add("active");
  overlay.classList.add("active");
};
const closeAddBookModal = () => {
  addBookModal.classList.remove("active");
  overlay.classList.remove("active");
};
const handleKeyboardInput = (e) => {
  if (e.key === "Eskape") closeAddBookModal();
};
const updateBookGrid = () => {
  resetBooksgrid();
  for (let book of library.books) {
    createBookCard(book);
  }
};
const resetBooksgrid = () => {
  booksGrid.innerHTML = "";
};
const createBookCard = (book) => {
  const bookCard = document.createElement("div");
  const title = document.createElement("p");
  const author = document.createElement("p");
  const pages = document.createElement("p");
  const readBtn = document.createElement("button");
  const removeBtn = document.createElement("button");

  bookCard.classList.add("item");
  readBtn.classList.add("read");
  removeBtn.classList.add("remove");
  readBtn.onclick = toggleRead;
  removeBtn.onclick = removeBook;

  title.textContent = `"${book.title}"`;
  author.textContent = book.author;
  pages.textContent = `${book.pages} pages`;
  removeBtn.textContent = "Remove";

  if (book.isRead) {
    readBtn.textContent = "Read";
    readBtn.classList.add("read");
  } else {
    readBtn.textContent = "Not read";
    readBtn.classList.add("unread");
  }

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(pages);
  bookCard.appendChild(readBtn);
  bookCard.appendChild(removeBtn);
  booksGrid.appendChild(bookCard);
};

const getBookFromInput = () => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const isRead = document.getElementById("isRead").checked;
  return new Book(title, author, pages, isRead);
};

const addBook = (e) => {
  e.preventDefault();
  const newBook = getBookFromInput();

  if (library.isInLibrary(newBook)) {
    alert("This book already exists in your library");
    return;
  }
  library.addBook(newBook);
  saveLocal();
  updateBookGrid();
  closeAddBookModal();
};
const removeBook = (e) => {
  const title = e.target.parentNode.firstChild.innerHTML.replaceAll('"', "");
  library.removeBook(title);
  saveLocal();
  updateBookGrid();
};

const toggleRead = (e) => {
  const title = e.target.parentNode.firstChild.innerHTML.replaceAll('"', "");
  const book = library.getBook(title);

  book.isRead = !book.isRead;
  saveLocal();
  updateBookGrid();
};

addBookBtn.onclick = openAddBookModal;
overlay.onclick = closeAddBookModal;
addBookForm.onsubmit = addBook;
window.onkeydown = handleKeyboardInput;

const saveLocal = () => {
  localStorage.setItem("library", JSON.stringify(library.books));
};
const restoreLocal = () => {
  const books = JSON.parse(localStorage.getItem("library"));
  if (books) {
    library.books = books.map((book) => JSONToBook(book));
  } else {
    library.books = [];
  }
};
const JSONToBook = (book) => {
  return new Book(book.title, book.author, book.pages, book.isRead);
};
