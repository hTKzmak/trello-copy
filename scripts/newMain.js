// Находим элементы на странице
const addColumnButton = document.querySelector('.add_column');
const form = document.querySelector('form');

// Массив для хранения данных колонок и карточек
let columnsData = [];

// Функции для работы с формой создания колонки
document.querySelector('.cancel').addEventListener('click', () => {
    document.body.click();
})


// Отображение и исчезновение формы заполнения для создания колонки

// Функция для скрытия формы заполнения
function hideForm() {
    form.style.display = 'none';
    addColumnButton.querySelector('span').style.display = 'block';
    document.querySelector('#add_column_value').value = "";
}

// Функция для отображения формы заполнения
function showForm() {
    form.style.display = 'grid';
    addColumnButton.querySelector('span').style.display = 'none';
    form.children[0].focus() // устанавливаем фокус на поле ввода

    // Функционал отображения и исчезновения окна
    document.addEventListener('touchstart', (evt) => {
        const touch = evt.touches[0];

        if (touch.target.className !== 'form-options' && touch.target.id !== 'add_column_value' && touch.target.id !== 'submit') {
            hideForm();
        }
    })

    document.addEventListener('click', (evt) => {
        if (evt.target.className !== 'form-options' && evt.target.id !== 'add_column_value' && evt.target.id !== 'submit' && evt.target.className !== 'add_column' && evt.target.id !== 'column_btn_title') {
            hideForm();
        }
    })


}


// Событие для отображения и исчезновения формы заполнения (для колонок)
addColumnButton.addEventListener('click', (evt) => {
    const classes = ['form-options', 'add_column', 'buttonStyle'];
    const ids = ['add_column_value', 'submit', 'column_btn_title'];

    if (!classes.includes(evt.target.className) && !ids.includes(evt.target.id)) {
        hideForm();
    }
    else {
        showForm(true)
    }

    console.log('проверка работоспособности')
});

// Событие по добавлению колонки
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // находим #add_column_value и смотрим у него значение
    let inputValue = form.querySelector('#add_column_value').value;

    // Проверяем, существует ли колонка с таким названием
    const existingColumn = columnsData.some(elem => elem.value === inputValue);
    if (existingColumn) {
        // Если колонка с таким названием уже существует, выводим сообщение
        alert('Такая колонка уже существует! Пожалуйста, выберите другое название.');

        // скрываем формы заполнения
        hideForm();

        return; // Прерываем выполнение функции
    }

    let columnItemData = {
        id: Date.now(),
        value: inputValue,
        cards: []
    };

    // добавляем колонку в случае если название не пустое
    if (inputValue) {
        // добавляем данные о колонке в columnsData
        columnsData.push(columnItemData);

        // создаём колонку
        const columnItem = createColumnItem(columnItemData);
        addColumnItemToPage(columnItem);

        // скрываем формы заполнения
        hideForm();

        // Функционал Drag and Drop с библиотекой SortableJS для карточек
        const cardsListEl = document.querySelectorAll('.cards__list');

        cardsListEl.forEach(elem => {
            Sortable.create(elem, {
                group: 'selected',
                animation: 100,
                delay: window.innerWidth <= 900 ? 50 : 0,

                onChange: function () {
                    console.log('Данные карточек обновились');
                },
            });
        });
    }
    else {
        // если название пустое, то выводит это сообщение
        alert('Название пустое')
    }

});



// Функция для сортировки карточек в колонке
function sortCards(column, type) {
    const index = columnsData.findIndex(elem => elem.id == column.id);
    if (index === -1) return;

    const sortTypes = {
        upToDown: (a, b) => new Date(b.data) - new Date(a.data),
        downToUp: (a, b) => new Date(a.data) - new Date(b.data),
        letter: (a, b) => a.value.localeCompare(b.value)
    };

    columnsData[index].cards.sort(sortTypes[type] || (() => 0));

    const cardListId = document.getElementById(column.id).querySelector('.cards__list').id;
    const cardList = document.getElementById(cardListId);
    cardList.innerHTML = '';

    columnsData[index].cards.forEach(card => {
        addingCard(cardListId, card.id, card.value, card.color, columnsData[index]);
    });
}

// Функция для создания кнопки сортировки
function createSortButton(container, column) {
    const sortButton = document.createElement('button');
    sortButton.className = 'buttonStyle';
    sortButton.innerHTML = 'Сортировать';

    const sortWindow = document.createElement('div');
    sortWindow.className = 'window__elem';
    sortWindow.style.cssText = 'top: -15px; right: -150px;';

    const sortOptions = [
        { text: 'Дата создания (сначала новые)', type: 'upToDown' },
        { text: 'Дата создания (сначала старые)', type: 'downToUp' },
        { text: 'Название карточки (по алфавиту)', type: 'letter' }
    ];

    sortOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'buttonStyle';
        button.innerHTML = option.text;
        button.addEventListener('click', () => {
            sortCards(column, option.type);
            sortWindow.remove();
            container.remove();
        });
        sortWindow.appendChild(button);
    });

    sortButton.addEventListener('mouseenter', () => sortButton.appendChild(sortWindow));
    sortButton.addEventListener('mouseleave', () => sortWindow.remove());
    container.appendChild(sortButton);
}

// Функция для изменения цвета карточки
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function updateCardColor(card, color) {
    const rgb = hexToRgb(color);
    const brightness = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
    card.style.background = color;
    card.style.borderColor = color;
    card.children[0].style.color = brightness > 186 ? 'black' : 'white';
}

// Функция для создания кнопки изменения цвета
function createColorButton(container, card, columnItemData) {

    const button = document.createElement('button');
    button.className = 'buttonStyle';
    button.innerHTML = 'Изменить цвет';

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.className = 'buttonStyle';
    colorPicker.setAttribute('data-coloris', '');
    colorPicker.style = `
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        opacity: 0;
    `

    colorPicker.addEventListener('input', (e) => {
        console.log(e.target.value)
        updateCardColor(document.getElementById(card.id), e.target.value);
        const index = columnItemData.cards.findIndex(elem => elem.id == card.id);

        if (index !== -1) {
            columnItemData.cards[index].color = e.target.value;
        }
    })

    button.addEventListener('click', () => {
        colorPicker.click();
    });


    button.appendChild(colorPicker)

    container.appendChild(button);
}

// // Функция для создания кнопки изменения цвета
// function OLD_FUNCTION_createColorButton(container, card, columnItemData) {
//     const colorPicker = document.createElement('input');
//     colorPicker.type = 'text';
//     colorPicker.className = 'buttonStyle';
//     colorPicker.value = 'Изменить цвет';
//     colorPicker.setAttribute('data-coloris', '');

//     colorPicker.addEventListener('click', () => {
//     })

//     Coloris({
//         el: '#coloris',
//         parent: container,
//         theme: 'default',
//         themeMode: 'light',
//         onChange: (color) => {
//             colorPicker.value = 'Изменить цвет';
//             updateCardColor(document.getElementById(card.id), color);
//             const index = columnItemData.cards.findIndex(elem => elem.id == card.id);

//             if (index !== -1) {
//                 columnItemData.cards[index].color = color;
//             }
//         }
//     });


//     container.appendChild(colorPicker);
// }



// Функция для создания меню с опциями
function createMenuWindow(button, item, container, type, input, columnItemData) {
    const menuWindow = document.createElement('div');
    menuWindow.className = 'window__elem';

    const createOptionButton = (text, handler) => {
        const button = document.createElement('button');
        button.className = 'buttonStyle';
        button.innerHTML = text;
        button.addEventListener('click', handler);
        return button;
    };

    const changeButton = createOptionButton('Изменить', () => {
        if (type === 'column') {
            changeColumn(button, item, input, columnItemData)
        }
        else {
            addWindowModal(item, columnItemData)
        }
        menuWindow.remove();
    });

    const deleteButton = createOptionButton('Удалить', () => {
        if (type === 'column') {
            deleteColumn(item)
        }
        else {
            // используется 2 равно, так как сравниваем разные типы, но с одинкаковым значением
            const index = columnItemData.cards.findIndex(elem => elem.id == item.id);

            if (index !== -1) {
                columnItemData.cards.splice(index, 1);
                document.getElementById(item.id).remove();
            }
        }
        menuWindow.remove();
    });

    menuWindow.appendChild(changeButton);

    if (type === 'column') {
        createSortButton(menuWindow, item)
    }
    else if (type === 'card') {
        createColorButton(menuWindow, item, columnItemData)
    }

    deleteButton.id = 'delete';
    menuWindow.appendChild(deleteButton);

    // Функционал отображения и исчезновения окна для смартфонов/планшетов
    document.addEventListener('touchstart', (evt) => {
        const touch = evt.touches[0];
        const targetElement = touch.target;

        // Проверяем, является ли целевой элемент частью menuWindow
        if (!menuWindow.contains(targetElement) && targetElement.className !== 'buttonStyle') {
            menuWindow.remove();
        }
    });

    menuWindow.addEventListener('mouseleave', () => {
        menuWindow.remove()
    });

    container.appendChild(menuWindow);

    document.addEventListener('click', (event) => {
        if (type === 'card' && event.target.className !== 'buttonStyle') {
            menuWindow.style.top = `${event.clientY - 45}px`;
            menuWindow.style.left = `${event.clientX - 110}px`;
        }
    }, { once: true });
}

// Функция для создания модального окна
function addWindowModal(cardItem, columnItemData) {

    const createOptionButton = (text, handler) => {
        const button = document.createElement('button');
        button.className = 'buttonStyle';
        button.innerHTML = text;
        button.addEventListener('click', handler);
        return button;
    };

    const index = columnItemData.cards.findIndex(elem => elem.id == cardItem.id);
    if (index === -1) return;

    const modalWindowContainer = document.createElement('div');
    modalWindowContainer.className = 'modalWindow_container';

    const windowElement = document.createElement('div');
    windowElement.className = 'window';

    const header = document.createElement('header');
    const windowSpan = document.createElement('span');
    windowSpan.innerHTML = 'Окно с информацией о карточке';

    // кнопка закрытия окна
    const closeButton = document.createElement('button');
    closeButton.classList.add('exit');
    closeButton.innerHTML = '<img src="./icons/close.svg" alt="#">';

    // фунционал закрытия окна (то есть, удаляет modalWindowContainer с разметки)
    closeButton.addEventListener('click', () => {
        modalWindowContainer.remove();

        // удаление поле ввода описания
        tinymce.remove();
    })

    header.appendChild(windowSpan);
    header.appendChild(closeButton);

    const windowMainInfo = document.createElement('div');
    windowMainInfo.className = 'window_main_info';

    const cardNameInput = document.createElement('input');
    cardNameInput.type = 'text';
    cardNameInput.className = 'card_name';
    cardNameInput.value = columnItemData.cards[index].value;
    cardNameInput.placeholder = 'Введите название карточки';

    cardNameInput.addEventListener('input', () => {
        cardNameInput.id = cardNameInput.value ? '' : 'empty';
    })

    // икнока наличия описания
    const descIcon = document.createElement('span')
    descIcon.innerHTML = '<img src="./icons/description.svg" title="У этой карточки есть описание" alt="#" style="width: 15px; height: 15px;">';
    descIcon.style = `
                position: absolute;
                bottom: 5px;
                left: 15px;
            `

    // создания списока options (здесь будут находиться кнопки сохранения, удаления и закрытия окна)
    const options = document.createElement('div');
    options.classList.add('options');

    const saveButton = createOptionButton('Сохранить', () => {
        if (!cardNameInput.value) return;

        columnItemData.cards[index].value = cardNameInput.value;

        document.getElementById(cardItem.id).querySelector('span').innerHTML = cardNameInput.value;

        getDescValue(columnItemData, index);

        if (columnItemData.cards[index].description !== '') {
            cardItem.style.paddingBottom = '30px';

            cardItem.appendChild(descIcon);
        }
        else {
            cardItem.style.paddingBottom = '8px';

            console.log(document.getElementById(cardItem.id).children[2])
            if (document.getElementById(cardItem.id).children[2]) {
                document.getElementById(cardItem.id).children[2].remove()
            }
        }

        modalWindowContainer.remove();
        tinymce.remove();
    });

    const deleteButton = createOptionButton('Удалить', () => {
        if (index !== -1) {
            columnItemData.cards.splice(index, 1);
            document.getElementById(cardItem.id).remove();

            modalWindowContainer.remove();
        }

        tinymce.remove();
    });

    const secondCloseButton = createOptionButton('Закрыть', () => {
        modalWindowContainer.remove();
        tinymce.remove();
    });

    deleteButton.id = 'delete_card';

    options.appendChild(saveButton);
    options.appendChild(deleteButton);
    options.appendChild(secondCloseButton);


    const cardDescriptionTextarea = document.createElement('textarea');
    cardDescriptionTextarea.id = 'card_description';
    cardDescriptionTextarea.cols = 30;
    cardDescriptionTextarea.rows = 10;

    windowMainInfo.appendChild(cardNameInput);
    windowMainInfo.appendChild(cardDescriptionTextarea);
    windowMainInfo.appendChild(options);

    windowElement.appendChild(header);
    windowElement.appendChild(windowMainInfo);
    modalWindowContainer.appendChild(windowElement);
    document.body.appendChild(modalWindowContainer);

    tinymce.init({
        selector: '#card_description',
        plugins: 'lists emoticons',
        statusbar: false,
        promotion: false,
        menubar: true,
        language: 'ru',
        toolbar: 'fontfamily fontsize | bold italic underline | alignleft aligncenter alignright alignjustify | emoticons | backcolor forecolor removeformat | bullist numlist outdent indent | undo redo',
        mobile: {
            toolbar_mode: 'floating'
        },
        setup: editor => editor.on('init', () => {
            editor.setContent(columnItemData.cards[index].description || '');
        })
    });
}

// Остальной функционал остаётся прежним, но очищен и улучшен для лучшей производительности и читаемости кода.



// Функция для создания колонки
function createColumnItem(columnData) {
    const columnItem = document.createElement('li');
    columnItem.className = 'column__item';
    columnItem.id = columnData.id;

    const columnItemCore = document.createElement('div');
    columnItemCore.className = 'column__item__core';

    const columnHeader = createColumnHeader(columnData, columnItem);
    columnItemCore.appendChild(columnHeader);

    const columnContent = createColumnContent(columnData);
    columnItemCore.appendChild(columnContent);

    columnItem.appendChild(columnItemCore);
    return columnItem;
}

// Функция для создания заголовка колонки
function createColumnHeader(columnData, columnItem) {
    const columnHeader = document.createElement('div');
    columnHeader.className = 'column__header';

    const columnTitle = document.createElement('span');
    columnTitle.innerHTML = columnData.value;

    const columnInput = document.createElement('input');
    columnInput.type = 'text';
    columnInput.placeholder = 'Введите название';
    columnInput.style.display = 'none';

    const menuButton = createMenuButton();

    columnHeader.appendChild(columnTitle);
    columnHeader.appendChild(columnInput);
    columnHeader.appendChild(menuButton);

    // Добавляем обработчик клика на кнопку меню
    menuButton.addEventListener('click', () => {
        createMenuWindow(menuButton, columnItem, columnItem, 'column', columnInput, columnData);
    });

    return columnHeader;
}

// Функция для создания контента колонки
function createColumnContent(columnData) {
    const columnContent = document.createElement('div');
    columnContent.className = 'column__content';

    const cardsList = document.createElement('ul');
    cardsList.className = 'cards__list';
    cardsList.id = `id${Math.random().toString(16).slice(2)}`;
    columnContent.appendChild(cardsList);

    const addCardButton = createAddCardButton(columnData, cardsList);
    columnContent.appendChild(addCardButton);

    return columnContent;
}

// Функция для создания кнопки добавления карточек
function createAddCardButton(columnData, cardsList) {
    const addCardButton = document.createElement('button');
    addCardButton.className = 'add__cards__button';

    addCardButton.innerHTML = `
        <span id="card_btn_title">Добавить карточку</span>
        <form style="display: none;">
            <input type="text" id="add_card_value" placeholder="Введите название">
            <div class="form-options">
                <button id="submit" type="submit">Добавить</button>
                <i class="cancel"><img src="./icons/close.svg" alt="Отмена"></i>
            </div>
        </form>
    `;

    const cardsButtonSpan = addCardButton.querySelector('span');
    const cardsButtonForm = addCardButton.querySelector('form');
    const cardsButtonInput = cardsButtonForm.querySelector('input');


    // Добавление карточки
    addCardButton.addEventListener('click', () => {
        cardsButtonSpan.style.display = 'none'
        cardsButtonForm.style.display = 'flex'

        // Функционал отображения и исчезновения окна
        document.addEventListener('touchstart', (evt) => {
            cardsButtonInput.focus(); // устанавливаем focus для ввода текста

            const touch = evt.touches[0];

            if (touch.target.className !== 'form-options' && touch.target.id !== 'add_card_value' && touch.target.id !== 'submit') {
                cardsButtonSpan.style.display = 'block';
                cardsButtonForm.style.display = 'none';
                cardsButtonInput.value = '';
            }
        })

        document.addEventListener('click', (evt) => {
            cardsButtonInput.focus(); // устанавливаем focus для ввода текста

            if (evt.target.className !== 'form-options' && evt.target.id !== 'add_card_value' && evt.target.id !== 'submit' && evt.target.className !== 'add_card' && evt.target.id !== 'card_btn_title') {
                cardsButtonSpan.style.display = 'block';
                cardsButtonForm.style.display = 'none';
                cardsButtonInput.value = '';
            }
        })

    });


    // отображение формы заполнения и исчезновение span
    addCardButton.addEventListener('click', () => {
        cardsButtonSpan.style.display = 'none';
        cardsButtonForm.style.display = 'flex';
        cardsButtonInput.focus();
    });

    cardsButtonForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addCard(cardsList, cardsButtonInput, columnData);

        // отображение span и исчезновение формы заполнения
        cardsButtonSpan.style.display = 'block';
        cardsButtonForm.style.display = 'none';
    });

    return addCardButton;
}

// Функция для добавления карточки
function addCard(cardsList, input, columnData) {
    const cardValue = input.value.trim();
    if (!cardValue) return;

    const cardData = {
        id: Date.now(),
        data: new Date().toISOString().replace('T', ' ').split('.')[0],
        color: '#ffffff',
        value: cardValue,
        description: null,
    };

    if (cardValue) {
        addingCard(cardsList.id, cardData.id, cardData.value, cardData.color, columnData);
        columnData.cards.push(cardData);
        console.log(columnData)
    }

    input.value = '';
}

// Функция для создания кнопки меню
function createMenuButton() {
    const menuButton = document.createElement('button');
    menuButton.className = 'menu__button';
    menuButton.innerHTML = `
        <div class="menu-icon">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div>
    `;
    console.log('Создание меню')
    return menuButton;
}

// Функция для удаления колонки
function deleteColumn(columnItem) {
    const index = columnsData.findIndex(elem => elem.id == columnItem.id);
    if (index !== -1) {
        columnsData.splice(index, 1);
        document.getElementById(columnItem.id).remove();
    }
}

// Функция для изменения колонки
function changeColumn(button, columnItem, input, columnData) {
    const columnTitle = columnItem.querySelector('.column__header span');
    columnTitle.style.display = 'none';
    button.style.display = 'none';

    input.value = columnData.value;
    input.style.display = 'block';
    input.focus();

    const saveNewName = () => {
        const newName = input.value.trim();

        // Проверяем, существует ли колонка с таким названием
        const exists = columnsData.some(column => column.value === newName);

        // если название имеется и не совпадает со старым
        if (newName && newName !== columnData.value) {
            if (exists) {
                // Если название уже существует, выводим сообщение
                alert('Такая колонка уже существует! Пожалуйста, выберите другое название.');
                input.value = columnData.value; // Возвращаем старое значение
                return; // Прерываем выполнение функции
            }

            columnData.value = newName;
            columnTitle.innerHTML = newName;
            console.log(columnsData);
        }

        columnTitle.style.display = 'block';
        button.style.display = 'block';
        input.style.display = 'none';
    };

    input.addEventListener('keydown', (event) => {
        if (event.code === 'Enter') {
            saveNewName();
        }
    });

    input.addEventListener('blur', saveNewName);
}

// Функция для добавления колонки на страницу
function addColumnItemToPage(columnItem) {
    const columnsList = document.querySelector('.columns__list');
    columnsList.appendChild(columnItem);
}

// Обработчик для кнопки добавления колонки
addColumnButton.addEventListener('click', () => showForm());

// Инициализация SortableJS для карточек
function initializeSortable(cardsList) {
    Sortable.create(cardsList, {
        group: 'selected',
        animation: 100,
        delay: window.innerWidth <= 900 ? 50 : 0,
        onChange: () => console.log('Данные карточек обновились'),
    });
}

// Функция по добавлению карточки
function addingCard(cardListId, cardDataId, value, color, columnData) {
    const cardsList = document.getElementById(cardListId);

    const cardItem = document.createElement('li');
    cardItem.className = 'card__item';
    cardItem.id = cardDataId;
    cardItem.style.background = color;
    cardItem.style.borderColor = color === '#ffffff' ? '#36a4a4' : color;

    const cardItemName = document.createElement('span');
    cardItemName.innerHTML = value;

    const rgb = hexToRgb(color);
    const brightness = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
    cardItemName.style.color = brightness > 186 ? 'black' : 'white';

    const cardMenuButton = createMenuButton();
    cardMenuButton.addEventListener('click', () => {
        createMenuWindow(cardMenuButton, cardItem, document.body, 'card', null, columnData);
    });

    cardItem.appendChild(cardItemName);
    cardItem.appendChild(cardMenuButton);

    if (value) {
        cardsList.appendChild(cardItem);
        cardsList.scrollTop = cardsList.scrollHeight;
    }
}

// получение значения поле ввода TinyMCE
function getDescValue(columnData, cardIndex) {

    // получаем значение поле ввода
    const editorContent = tinymce.activeEditor.getContent();

    // получаем значение поле ввода, но без тегов
    // const editorContent = (((tinymce.activeEditor.getContent()).replace(/(&nbsp;)*/g, "")).replace(/(<p>)*/g, "")).replace(/<(\/)?p[^>]*>/g, "");

    // сохраняем значение в описание карточки
    columnData.cards[cardIndex].description = editorContent;

    console.log(columnData)
}
