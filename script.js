const createButton = document.querySelector('.create-button');
const columns = document.querySelectorAll('.column');
const userRoleSelect = document.getElementById('userRole');

let cardCount = 1;
let userRole = 'developer';
const STORAGE_KEY = 'taskCards';


// Function to save the card data to local storage
const saveCardsToLocalStorage = () => {
  const cardData = [];
  for (const column of columns) {
    const cardsInColumn = column.querySelectorAll('.card');
    for (const card of cardsInColumn) {
      const cardId = card.id;
      const heading = card.querySelector('.card-title').innerText;
      const description = card.querySelector('p').innerText;
      const columnIndex = parseInt(card.parentElement.dataset.columnIndex, 10);
      cardData.push({ id: cardId, heading, description, columnIndex });
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cardData));
};


// Function to load the card data from local storage and create the cards
const loadCardsFromLocalStorage = () => {
  const savedCardData = localStorage.getItem(STORAGE_KEY);
  const cardData = savedCardData ? JSON.parse(savedCardData) : [];
  for (const data of cardData) {
    createCard(data.id, data.heading, data.description, data.columnIndex);
  }
};


const createCard = (id, heading, description, columnIndex) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.draggable = true;
  card.id = id;

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  card.innerHTML = `
    <div class="card-title">${heading}</div>
    <p>${description}</p>
    <div class="card-date">${formattedDate}</div>
  `;
  card.addEventListener('dragstart', (event) => dragStart(event, card));

  columns[columnIndex].appendChild(card);
};

createButton.addEventListener('click', () => {
    
  const taskHeading = prompt('Enter the task heading:');
  const taskDescription = prompt('Enter the task description:');

  if (taskHeading && taskDescription) {
    const cardId = `card-${cardCount}`;
    createCard(cardId, taskHeading, taskDescription, 0); 
    cardCount++;
    saveCardsToLocalStorage(); 
  } else {
    alert('Task heading and description cannot be empty. Please try again.');
  }
});

userRoleSelect.addEventListener('change', () => {
  userRole = userRoleSelect.value;
});



const dragStart = (event, card) => {
  event.dataTransfer.setData('text/plain', card.id);
};


window.onload =()=>{

loadCardsFromLocalStorage();

for (const column of columns) {
  column.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  column.addEventListener('dragenter', (event) => {
    column.classList.add('drag-over');
  });

  column.addEventListener('dragleave', (event) => {
    column.classList.remove('drag-over');
  });

  column.addEventListener('drop', (event) => {
    event.preventDefault();

    const cardId = event.dataTransfer.getData('text/plain');
    const card = document.getElementById(cardId);

    const targetColumn = parseInt(column.dataset.columnIndex, 10);
    const originalColumn = parseInt(card.parentElement.dataset.columnIndex, 10);

    if (targetColumn === 3 && originalColumn === 2) {
      if (userRole === 'tester') {
        column.appendChild(card);
        saveCardsToLocalStorage(); // Save the updated card data to local storage
      }
    } else if (targetColumn - originalColumn === 1) {
      column.appendChild(card);
      saveCardsToLocalStorage(); // Save the updated card data to local storage
    }

    column.classList.remove('drag-over');
  });
}
}
