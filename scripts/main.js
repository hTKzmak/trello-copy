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

// функция по отображению меню
function addWindow(type, button, item) {
    const menuWindow = document.createElement('div')
    menuWindow.className = 'window__elem'

    const changeButton = document.createElement('button')
    changeButton.className = 'buttonStyle'
    changeButton.innerHTML = 'Изменить'

    changeButton.addEventListener('click', () => {
        changeFunc(type, item)
        menuWindow.style.display = 'none';
    })

    const deleteButton = document.createElement('button')
    deleteButton.className = 'buttonStyle'
    deleteButton.id = 'delete'
    deleteButton.innerHTML = 'Удалить'

    // удаление колонки
    deleteButton.addEventListener('click', () => {
        deleteFunc(type, item)
        menuWindow.style.display = 'none';
    })

    menuWindow.appendChild(changeButton)
    menuWindow.appendChild(deleteButton)

    // функционал отображения и исчезновения окна
    button.addEventListener('click', () => {
        if (menuWindow.style.display === 'none' || menuWindow.style.display === '') {
            menuWindow.style.display = 'flex';
        } else {
            menuWindow.style.display = 'none';
        }
    });

    menuWindow.addEventListener('mouseleave', () => {
        menuWindow.style.display = 'none';
    })

    item.appendChild(menuWindow)
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
    cardsButton.className = 'add__cards__button';
    cardsButton.innerHTML = 'Добавить карточку';

    // добавление карточки
    cardsButton.addEventListener('click', () => {
        let cardData = {
            id: Date.now(),
            value: prompt('Write card name', 'card 1'),
        };

        addingCard(cardsList.id, cardData.id, cardData.value, columnItemData);

        if (cardData.value) {
            columnItemData.cards.push(cardData);
        }

        console.log(columnItemData);
    });

    columnContent.appendChild(cardsButton);


    columnItem.appendChild(columnContent);

    // отображение окна меню
    addWindow('column', menuButton, columnItem)

    return columnItem;
}

// удаление колонки
function deleteFunc(type, columnItem) {

    if (type === 'column') {
        const index = columnsData.findIndex(elem => elem.id == columnItem.id);

        if (index !== -1) {
            columnsData.splice(index, 1);
            document.getElementById(columnItem.id).remove();

            console.log(columnsData);
        }
    }
    else if (type === 'card') {
        const index = data.cards.findIndex(elem => elem.id == cardDataId);

        if (index !== -1) {
            data.cards.splice(index, 1);
            document.getElementById(cardItem.id).remove();

            console.log('Card removed:', data.cards);
        }
    }

}

// изменение колонки
function changeFunc(type, columnItem) {
    let newName = prompt('Новое название', 'new name')

    if (type === 'column') {
        const index = columnsData.findIndex(elem => elem.id == columnItem.id);

        if (index !== -1 && newName) {
            columnsData[index].value = newName
            console.log(columnsData)
            document.getElementById(columnItem.id).firstChild.firstChild.innerHTML = newName;
        }
    }
    else if (type === 'card') {
        const index = data.cards.findIndex(elem => elem.id == cardDataId);

        if (index !== -1 && newName) {
            data.cards.splice(index, 1);
            document.getElementById(cardItem.id).remove();

            console.log('Card removed:', data.cards);
        }
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


    const cardMenuButton = document.createElement('button')
    cardMenuButton.innerHTML = '<img src="./icons/pen.svg" alt="#">'
    cardMenuButton.className = 'card__button'

    // отображение окна меню
    addWindow('card', cardMenuButton, cardItem)

    cardItem.appendChild(cardMenuButton)

    if (value) {
        cardsList.appendChild(cardItem);
    }
}
