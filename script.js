const createButton = document.querySelector('.create-button');
const columns = document.querySelectorAll('.column');
const userRoleSelect = document.getElementById('userRole');

let cardCount = 1;
let draggedCard = null;
let userRole = 'developer'; // Set the default role to 'developer'

userRoleSelect.addEventListener('change', () => {
  userRole = userRoleSelect.value;
});

createButton.addEventListener('click', () => {
  const taskHeading = prompt('Enter the task heading:');
  const taskDescription = prompt('Enter the task description:');

  if (taskHeading && taskDescription) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.draggable = true;
    card.id = `card-${cardCount}`;

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

   card.innerHTML = `
      <div class="card-title">${taskHeading}</div>
      <p>${taskDescription}</p>
      <div class="card-date">${formattedDate}</div>
    `;
    card.addEventListener('dragstart', (event) => dragStart(event, card));
    card.addEventListener('dragend', dragEnd);

    columns[0].appendChild(card);

    cardCount++;
  } else {
    alert('Task heading and description cannot be empty. Please try again.');
  }
});


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


    if(targetColumn===3 && originalColumn===2){
        
      if(userRole=='tester'){
              column.appendChild(card);
      }      
    }
    
    else if(targetColumn - originalColumn === 1) {
      column.appendChild(card);
    }
    column.classList.remove('drag-over');
  });
}
  
const dragStart = (event, card) => {
  draggedCard = card;
  event.dataTransfer.setData('text/plain', card.id);
};

const dragEnd = () => {
  draggedCard = null;
};