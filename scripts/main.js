// Находим элементы на странице
const addColumnButton = document.querySelector('.add_column');
const form = document.querySelector('form');
// const windowModal = document.querySelector('.modalWindow_container');
// const exitButton = document.querySelector('.exit');

// Элементы (кнопки для карточки)
// const changeCardButton = document.querySelector('#change');
// const deleteCardButton = document.querySelector('#delete');
// const descCardButton = document.querySelector('#write_desc');

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


// Функция по отображению меню
function addWindow(button, item) {
    const menuWindow = document.createElement('div');
    menuWindow.className = 'window__elem';

    const changeButton = document.createElement('button');
    changeButton.className = 'buttonStyle';
    changeButton.innerHTML = 'Изменить';

    // Изменение колонки/карточки
    changeButton.addEventListener('click', () => {
        changeColumn(item);
        menuWindow.style.display = 'none';
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'buttonStyle';
    deleteButton.id = 'delete';
    deleteButton.innerHTML = 'Удалить';

    // Удаление колонки/карточки
    deleteButton.addEventListener('click', () => {
        deleteColumn(item);
        menuWindow.style.display = 'none';
    });

    menuWindow.appendChild(changeButton);
    menuWindow.appendChild(deleteButton);

    // Функционал отображения и исчезновения окна
    button.addEventListener('click', () => {
        menuWindow.style.display = (menuWindow.style.display === 'none' || menuWindow.style.display === '') ? 'flex' : 'none';
    });

    menuWindow.addEventListener('mouseleave', () => {
        menuWindow.style.display = 'none';
    });

    item.appendChild(menuWindow);
}

// Функция для создания элемента колонки

function addWindowModal(cardItem, columnItemData) {
    const index = columnItemData.cards.findIndex(elem => elem.id == cardItem.id);

    // Создание элементов
    const modalWindowContainer = document.createElement('div');
    modalWindowContainer.classList.add('modalWindow_container');

    const windowElement = document.createElement('div');
    windowElement.classList.add('window');

    const header = document.createElement('header');

    const options = document.createElement('div');
    options.classList.add('options');

    // const writeDescButton = document.createElement('button');
    // writeDescButton.id = 'write_desc';
    // writeDescButton.textContent = 'Написать описание';

    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete';
    deleteButton.textContent = 'Удалить';

    deleteButton.addEventListener('click', () => {

        if (index !== -1) {
            columnItemData.cards.splice(index, 1);
            document.getElementById(cardItem.id).remove();

            modalWindowContainer.remove();
        }
    })

    // options.appendChild(writeDescButton);
    options.appendChild(deleteButton);

    const closeButton = document.createElement('button');
    closeButton.classList.add('exit');
    closeButton.textContent = 'Закрыть';

    closeButton.addEventListener('click', () => {
        modalWindowContainer.remove();
    })

    header.appendChild(options);
    header.appendChild(closeButton);

    const windowMainInfo = document.createElement('div');
    windowMainInfo.classList.add('window_main_info');

    const cardNameInput = document.createElement('input');
    cardNameInput.type = 'text';
    cardNameInput.classList.add('card_name');


    cardNameInput.addEventListener('input', (event) => {
        let newCardName = event.target.value;

        if (index !== -1) {
            console.log(newCardName)
            columnItemData.cards[index].value = newCardName;
            document.getElementById(cardItem.id).querySelector('span').innerHTML = newCardName;
        }
    })


    const cardDescriptionTextarea = document.createElement('textarea');
    cardDescriptionTextarea.name = 'textarea';
    cardDescriptionTextarea.id = 'card_description';
    cardDescriptionTextarea.cols = 30;
    cardDescriptionTextarea.rows = 10;

    windowMainInfo.appendChild(cardNameInput);
    windowMainInfo.appendChild(cardDescriptionTextarea);

    // Добавление элементов на страницу
    windowElement.appendChild(header);
    windowElement.appendChild(windowMainInfo);

    modalWindowContainer.appendChild(windowElement);

    // Добавление модального окна на страницу
    document.body.appendChild(modalWindowContainer);

}

function createColumnItem(columnItemData) {
    const columnItem = document.createElement('li');
    columnItem.className = 'column__item';
    columnItem.id = columnItemData.id;
    columnItem.draggable = true;

    const columnItemCore = document.createElement('div');
    columnItemCore.className = 'column__item__core';

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
    columnItemCore.appendChild(columnHeader);

    const columnContent = document.createElement('div');
    columnContent.className = 'column__content';

    const cardsList = document.createElement('ul');
    cardsList.className = 'cards__list';
    cardsList.id = "id" + Math.random().toString(16).slice(2);
    columnContent.appendChild(cardsList);

    const cardsButton = document.createElement('button');
    cardsButton.className = 'add__cards__button';
    cardsButton.innerHTML = 'Добавить карточку';

    // Добавление карточки
    cardsButton.addEventListener('click', () => {
        let cardData = {
            id: Date.now(),
            value: prompt('Write card name', 'card 1'),
            description: null,
        };

        addingCard(cardsList.id, cardData.id, cardData.value, columnItemData, cardData.description);

        if (cardData.value) {
            columnItemData.cards.push(cardData);
        }

        console.log(columnItemData);
    });

    columnContent.appendChild(cardsButton);
    columnItemCore.appendChild(columnContent);
    columnItem.appendChild(columnItemCore);

    // Отображение окна меню
    addWindow(menuButton, columnItem);

    return columnItem;
}

// Удаление колонки
function deleteColumn(columnItem) {
    const index = columnsData.findIndex(elem => elem.id == columnItem.id);

    if (index !== -1) {
        columnsData.splice(index, 1);
        document.getElementById(columnItem.id).remove();
        console.log(columnsData);
    }
}

// Изменение колонки
function changeColumn(columnItem) {
    let newName = prompt('Новое название', 'new name');

    const index = columnsData.findIndex(elem => elem.id == columnItem.id);

    if (index !== -1 && newName) {
        columnsData[index].value = newName;
        console.log(columnsData);
        document.getElementById(columnItem.id).querySelector('.column__header span').innerHTML = newName;
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
function addingCard(cardListId, cardDataId, value, columnItemData, description) {
    const cardsList = document.getElementById(cardListId);

    const cardItem = document.createElement('li');
    cardItem.className = 'card__item';
    cardItem.id = cardDataId;
    cardItem.draggable = true;

    const cardItemName = document.createElement('span')
    cardItemName.innerHTML = value;

    const cardMenuButton = document.createElement('button');
    cardMenuButton.innerHTML = '<img src="./icons/pen.svg" alt="#">';
    cardMenuButton.className = 'card__button';


    cardMenuButton.addEventListener('click', () => {
        // windowModal.style.display = 'flex';

        // deleteCardButton.addEventListener('click', () => {
        //     console.log(cardItem.id)
        // })
        addWindowModal(cardItem, columnItemData);
    })

    cardItem.appendChild(cardItemName)
    cardItem.appendChild(cardMenuButton);

    if (value) {
        cardsList.appendChild(cardItem);
    }
}






// function addingCard(cardListId, cardDataId, value, columnItemData, description) {
//     const cardsList = document.getElementById(cardListId);

//     const cardItem = document.createElement('li');
//     cardItem.className = 'card__item';
//     cardItem.id = cardDataId;
//     cardItem.innerHTML = value;
//     cardItem.draggable = true;

//     const cardMenuButton = document.createElement('button');
//     cardMenuButton.innerHTML = '<img src="./icons/pen.svg" alt="#">';
//     cardMenuButton.className = 'card__button';

//     // Отображение окна меню
//     cardMenuButton.addEventListener('click', () => {
//         const index = columnItemData.cards.findIndex(elem => elem.id == cardItem.id);
//         console.log(index);
//         windowModal.style.display = 'flex';
//     });

//     // Обработчик удаления карточки
//     deleteCardButton.addEventListener('click', () => {
//         const index = columnItemData.cards.findIndex(elem => elem.id == cardItem.id);

//         if (index !== -1) {
//             columnItemData.cards.splice(index, 1);
//             document.getElementById(cardItem.id).remove();
//             console.log(columnItemData.cards);

//             windowModal.style.display = 'none';
//         }
//     });

//     exitButton.addEventListener('click', () => {
//         windowModal.style.display = 'none';
//     });

//     cardItem.appendChild(cardMenuButton);

//     if (value) {
//         cardsList.appendChild(cardItem);
//     }
// }