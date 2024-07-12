// Находим элементы на странице
const addColumnButton = document.querySelector('.add_column');
const form = document.querySelector('form');

// Массив для хранения данных колонок
let columnsData = [];

// Функция для отображения формы заполнения
function showForm() {
    form.style.display = 'grid';
    addColumnButton.querySelector('span').style.display = 'none';
}

// Функция для скрытия формы заполнения
function hideForm() {
    form.style.display = 'none';
    addColumnButton.querySelector('span').style.display = 'block';
}

// Функция для создания элемента колонки
function createColumnItem(columnItemData) {
    const columnItem = document.createElement('li');
    columnItem.className = 'column__item';
    columnItem.id = columnItemData.id;
    columnItem.draggable = true;

    const columnHeader = document.createElement('div');
    columnHeader.className = 'column__header';

    const columnItemValue = document.createElement('span');
    columnItemValue.innerHTML = columnItemData.value;

    const menuButton = document.createElement('button');
    menuButton.className = 'menu__button';
    menuButton.innerHTML = `
        <div class="menu-icon">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div>
    `;

    columnHeader.appendChild(columnItemValue);
    columnHeader.appendChild(menuButton);
    columnItem.appendChild(columnHeader);

    const columnContent = document.createElement('div');
    columnContent.className = 'column__content';

    const cardsList = document.createElement('ul');
    cardsList.className = 'cards__list';
    cardsList.id = "id" + Math.random().toString(16).slice(2);
    columnContent.appendChild(cardsList);

    const cardsButton = document.createElement('button');
    cardsButton.className = 'cards__button';
    cardsButton.innerHTML = 'Добавить карточку';

    // добавление карточки
    cardsButton.addEventListener('click', () => {
        let cardData = {
            id: Date.now(),
            value: prompt('Write card name', 'card 1'),
        };

        addingCard(cardsList.id, cardData.id, cardData.value, columnItemData);
        
        if(cardData.value){
            columnItemData.cards.push(cardData);
        }
        
        console.log(columnItemData);
    });

    columnContent.appendChild(cardsButton);


    columnItem.appendChild(columnContent);


    // меню с выбором действий для колонки
    const menuWindow = document.createElement('div')
    menuWindow.className = 'window__elem'

    const changeButton = document.createElement('button')
    changeButton.className = 'buttonStyle'
    changeButton.innerHTML = 'Изменить'

    changeButton.addEventListener('click', () => {
        changeColumn(columnItem)
        menuWindow.style.display = 'none';
    })

    const deleteButton = document.createElement('button')
    deleteButton.className = 'buttonStyle'
    deleteButton.id = 'delete'
    deleteButton.innerHTML = 'Удалить'

    // удаление колонки
    deleteButton.addEventListener('click', () => {
        deleteColumn(columnItem)
        menuWindow.style.display = 'none';
    })

    menuWindow.appendChild(changeButton)
    menuWindow.appendChild(deleteButton)

    // функционал отображения и исчезновения окна
    menuButton.addEventListener('click', () => {
        if (menuWindow.style.display === 'none' || menuWindow.style.display === '') {
            menuWindow.style.display = 'flex';
        } else {
            menuWindow.style.display = 'none';
        }
    });

    menuWindow.addEventListener('mouseleave', () => {
        menuWindow.style.display = 'none';
    })

    columnItem.appendChild(menuWindow)


    return columnItem;
}

// удаление колонки
function deleteColumn(columnItem) {
    const index = columnsData.findIndex(elem => elem.id == columnItem.id);

    if (index !== -1) {
        columnsData.splice(index, 1);
        document.getElementById(columnItem.id).remove();

        console.log(columnsData);
    }
}

// изменение колонки
function changeColumn(columnItem) {
    const index = columnsData.findIndex(elem => elem.id == columnItem.id);

    let newName = prompt('Новое название', 'new name')

    if (index !== -1 && newName) {
        columnsData[index].value = newName
        console.log(columnsData)
        document.getElementById(columnItem.id).firstChild.firstChild.innerHTML = newName;
    }
}


// Функция для добавления колонки на страницу
function addColumnItemToPage(columnItem) {
    const columnsListElement = document.querySelector('.columns__list');

    columnsListElement.appendChild(columnItem);
}

// Событие по отображению формы заполнения
addColumnButton.addEventListener('click', showForm);

// Событие по добавлению задачи
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputValue = form.querySelector('#add_column_value').value;

    if (inputValue) {
        let columnItemData = {
            id: Date.now(),
            value: inputValue,
            cards: []
        };

        columnsData.push(columnItemData);

        const columnItem = createColumnItem(columnItemData);
        addColumnItemToPage(columnItem);

        console.log(columnsData);

        hideForm();
    }
});

// Функция по добавлению карточки
function addingCard(cardListId, cardDataId, value, data) {
    const cardsList = document.getElementById(cardListId);

    const cardItem = document.createElement('li');
    cardItem.className = 'card__item';
    cardItem.id = cardDataId;
    cardItem.innerHTML = value;
    cardItem.draggable = true;

    cardItem.addEventListener('click', () => {
        const index = data.cards.findIndex(elem => elem.id == cardDataId);

        if (index !== -1) {
            data.cards.splice(index, 1);
            document.getElementById(cardItem.id).remove();

            console.log('Card removed:', data.cards);
        }
    });

    if(value) {
        cardsList.appendChild(cardItem);
    }
}
