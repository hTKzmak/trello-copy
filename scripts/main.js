// Находим элементы на странице
const addColumnButton = document.querySelector('.add_column');
const form = document.querySelector('form');

// Массив для хранения данных колонок
let columnsData = [];



// Функция для скрытия формы заполнения
function hideForm() {
    form.style.display = 'none';
    addColumnButton.querySelector('span').style.display = 'block';
}

// Функция для отображения формы заполнения
function showForm() {
    form.style.display = 'grid';
    addColumnButton.querySelector('span').style.display = 'none';

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

// Функция по добавлению кнопки сортировки карточек
function addSortButton(window, column) {
    // кнопка для сортировки карточек
    const sortButton = document.createElement('button');
    sortButton.className = 'buttonStyle';
    sortButton.innerHTML = 'Сортировать';

    // примерная сортировка от большего к меньшему
    sortButton.addEventListener('click', () => {
        console.log('сортировка от большего к меньшему')
        // Находим индекс самой колонки
        const index = columnsData.findIndex(elem => elem.id == column.id);

        // сортировка карточек
        columnsData[index].cards.sort((a, b) => b.data - a.data)
        console.log(columnsData[index])
        console.log(columnsData)

        // удаляем карточки с определённой колонки, чтобы добавить отсортированные
        let htmlData = document.getElementById(column.id).childNodes[0].lastChild.childNodes[0].childNodes;
        // Создаем копию коллекции HTML-элементов
        const htmlDataCopy = [...htmlData];

        // находим список карточек выбранной нами колонки
        let cardListId = document.getElementById(column.id).childNodes[0].lastChild.childNodes[0].id;

        // Удаляем карточки из копии
        for (let i of htmlDataCopy) {
            i.remove();
        }

        // добавляем отсортированные карточки
        for (let j of columnsData[index].cards) {
            addingCard(cardListId, j.id, j.value, j.color, columnsData[index])
            console.log(j)
        }

        window.remove();
    })

    window.appendChild(sortButton)
}

// Функция по добавлению кнопки изменения цвета выбранной нами карточки
function addColorButton(window, card, columnItemData) {
    // кнопка для перекраски карточки
    const colorButton = document.createElement('button');
    colorButton.className = 'buttonStyle';
    colorButton.innerHTML = 'Изменить цвет';

    colorButton.addEventListener('click', () => {
        // Создаем элемент input типа цвет
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = '#FFFFFF';

        // Добавляем слушатель события изменения цвета
        colorPicker.addEventListener('input', (e) => {
            const index = columnItemData.cards.findIndex(elem => elem.id == card.id);

            // Выводим выбранное значение цвета в консоль
            document.getElementById(card.id).style.background = e.target.value;

            columnItemData.cards[index].color = e.target.value;
            console.log(columnItemData.cards[index])
        });

        // Отображаем окно выбора цвета
        colorPicker.click();

        window.remove();
    });

    window.appendChild(colorButton);
}

// Функция по отображению меню
function addMenuWindow(button, item, place, type, input, columnItemData) {

    // создание самого окна меню
    const menuWindow = document.createElement('div');
    menuWindow.className = 'window__elem';

    // кнопка для изменения названия карточки
    const changeButton = document.createElement('button');
    changeButton.className = 'buttonStyle';
    changeButton.innerHTML = 'Изменить';

    // Изменение колонки/карточки
    changeButton.addEventListener('click', () => {
        if (type === 'column') {
            changeColumn(item, input);
            button.style.display = 'none'
            menuWindow.remove();
        }
        else if (type === 'card') {
            // функционал для создания модального (только для выбранной нами карточки)
            addWindowModal(item, columnItemData)
            menuWindow.remove();
        }
    });

    // кнопка для удаления самой карточки
    const deleteButton = document.createElement('button');
    deleteButton.className = 'buttonStyle';
    deleteButton.id = 'delete';
    deleteButton.innerHTML = 'Удалить';

    // Удаление колонки/карточки
    deleteButton.addEventListener('click', () => {
        if (type === 'column') {
            deleteColumn(item);
            menuWindow.remove();
        }
        else if (type === 'card') {
            const index = columnItemData.cards.findIndex(elem => elem.id == item.id);
            if (index !== -1) {
                columnItemData.cards.splice(index, 1);
                document.getElementById(item.id).remove();
                menuWindow.remove();
            }
        }
    });

    menuWindow.appendChild(changeButton);

    if (type === 'column') {
        addSortButton(menuWindow, item)
    }
    else if (type === 'card') {
        addColorButton(menuWindow, item, columnItemData)
    }

    menuWindow.appendChild(deleteButton);

    // Функционал отображения и исчезновения окна
    document.addEventListener('touchstart', (evt) => {
        const touch = evt.touches[0];

        if (touch.target.className !== 'window__elem' && touch.target.className !== 'buttonStyle') {
            menuWindow.remove();
        }
    })

    menuWindow.addEventListener('mouseleave', () => {
        menuWindow.remove();
    });

    // нужно определить позицию выбранной нами карточки, чтобы расположить его рядом с самой карточкой
    // Добавляем само меню для выбранного нами места (то есть, place)
    document.addEventListener('click', (event) => {
        if (type === 'card' && event.target.className !== 'buttonStyle') {
            menuWindow.style.top = (event.clientY - 66) + 'px'
            menuWindow.style.left = (event.clientX - 131) + 'px'
        }
    })

    place.appendChild(menuWindow);
}

// Функция для создания модального окна только для выбранной нами карточки
function addWindowModal(cardItem, columnItemData) {
    // находим index самой карточки
    const index = columnItemData.cards.findIndex(elem => elem.id == cardItem.id);

    // Создание основы для модального окна
    const modalWindowContainer = document.createElement('div');
    modalWindowContainer.classList.add('modalWindow_container');

    // само модальное окно
    const windowElement = document.createElement('div');
    windowElement.classList.add('window');


    // header с кнопками закрытия окна и удаления карточки
    const header = document.createElement('header');

    // создания списока options (здесь будут находиться кнопки сохранения, удаления и закрытия окна)
    const options = document.createElement('div');
    options.classList.add('options');

    // кнопка для сохранения карточки
    const saveButton = document.createElement('button');
    saveButton.innerHTML = 'Сохранить';

    // кнопка для удаления карточки
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete_card';
    deleteButton.innerHTML = 'Удалить';

    // функционал удаления карточки
    deleteButton.addEventListener('click', () => {

        if (index !== -1) {
            columnItemData.cards.splice(index, 1);
            document.getElementById(cardItem.id).remove();

            modalWindowContainer.remove();
        }
    })

    // заголовок самого окна
    const windowSpan = document.createElement('span')
    windowSpan.innerHTML = 'Окно с информацией о карточке'

    // кнопка закрытия окна
    const closeButton = document.createElement('button');
    closeButton.classList.add('exit');
    closeButton.innerHTML = '<img src="./icons/close.svg" alt="#">';

    // фунционал закрытия окна (то есть, удаляет modalWindowContainer с разметки)
    closeButton.addEventListener('click', () => {
        modalWindowContainer.remove();
    })

    header.appendChild(windowSpan);
    header.appendChild(closeButton);


    // основной контент окна: название и описание
    const windowMainInfo = document.createElement('div');
    windowMainInfo.classList.add('window_main_info');


    // input с названием карточки
    const cardNameInput = document.createElement('input');
    cardNameInput.type = 'text';
    cardNameInput.classList.add('card_name');
    cardNameInput.placeholder = 'Введите название карточки'
    cardNameInput.value = columnItemData.cards[index].value;

    // функционал изменения названия карточки при нажатии на клавиши

    cardNameInput.addEventListener('input', () => {
        cardNameInput.id = cardNameInput.value ? '' : 'empty';
    })

    saveButton.addEventListener('click', () => {
        let newCardName = cardNameInput.value;

        // икнока наличия описания
        const descIcon = document.createElement('span')
        descIcon.innerHTML = '<img src="./icons/description.svg" alt="#" style="width: 15px; height: 15px;">';
        descIcon.style = `
            position: absolute;
            bottom: 6px;
            left: 15px;
        `


        if (index !== -1) {
            if (newCardName) {
                columnItemData.cards[index].value = newCardName;
                document.getElementById(cardItem.id).querySelector('span').innerHTML = newCardName;

                getDescValue(columnItemData, index)

                modalWindowContainer.remove();

                console.log(columnItemData.cards[index].description !== '')
                console.log(columnItemData.cards[index].description)

                if (columnItemData.cards[index].description !== '') {
                    cardItem.style.paddingBottom = '30px';

                    cardItem.appendChild(descIcon);
                }
                else {
                    cardItem.style.paddingBottom = '8px';
                    cardItem.children[2].remove()
                }
            }
        }

    })


    // Вторая кнопка закрытия модального окна, сделанная для options
    const secondCloseButton = document.createElement('button');
    secondCloseButton.innerHTML = 'Закрыть'

    // фунционал закрытия окна (то есть, удаляет modalWindowContainer с разметки)
    secondCloseButton.addEventListener('click', () => {
        modalWindowContainer.remove();
    })

    // в options добавляем кнопки: сохранение, удаление, закрытие окна
    options.appendChild(saveButton);
    options.appendChild(deleteButton);
    options.appendChild(secondCloseButton);


    // описание карточки
    const cardDescriptionTextarea = document.createElement('textarea');
    cardDescriptionTextarea.name = 'textarea';
    cardDescriptionTextarea.id = 'card_description';
    cardDescriptionTextarea.cols = 30;
    cardDescriptionTextarea.rows = 10;

    // добавляем строку, поле ввода и опции в windowMainInfo
    windowMainInfo.appendChild(cardNameInput);
    windowMainInfo.appendChild(cardDescriptionTextarea);
    windowMainInfo.appendChild(options)


    // Добавление элементов на страницу
    windowElement.appendChild(header);
    windowElement.appendChild(windowMainInfo);

    modalWindowContainer.appendChild(windowElement);

    // Добавление модального окна на страницу
    document.body.appendChild(modalWindowContainer);



    // Работа с TinyMCE:

    // Уничтожение существующего экземпляра TinyMCE, если он есть, перед инициализацией нового.
    // Он нужен для того, чтобы при следующем выборе карточки снова появлися этот редактор, а не пустое поле ввода
    if (tinymce.get('card_description')) {
        tinymce.get('card_description').remove();
    }


    // подключение tinymce для #card_description после создания модального окна
    tinymce.init({
        selector: 'textarea#card_description',
        license_key: 'gpl',
        statusbar: false,
        promotion: false,
        menubar: true,
        // language: 'ru',
        plugins: 'lists emoticons',
        // forced_root_block: 'div',
        // newline_behavior: 'linebreak',
        toolbar: 'fontfamily fontsize | bold italic underline | alignleft aligncenter alignright alignjustify | emoticons | backcolor forecolor removeformat | bullist numlist outdent indent | undo redo',
        mobile: {
            toolbar_mode: 'floating'
        },

        // Добавляем описание к карточке
        // Этот обратный вызов срабатывает после инициализации редактора и устанавливает содержимое, если описание существует.
        setup: function (editor) {
            editor.on('init', function () {
                let cardDesc = columnItemData.cards[index].description;
                if (cardDesc) {
                    editor.setContent(cardDesc);
                }
            });
        }
    })

}




// функция по созданию колонки
function createColumnItem(columnItemData) {

    // создание columnItem (основу для содержимого самой колонки)
    const columnItem = document.createElement('li');
    columnItem.className = 'column__item';
    columnItem.id = columnItemData.id;
    columnItem.draggable = true;

    // создание содержания всей инвормации самой колонки
    const columnItemCore = document.createElement('div');
    columnItemCore.className = 'column__item__core';

    // header для колонки (содержимое: название колонки и кнопка для отображения меню)
    const columnHeader = document.createElement('div');
    columnHeader.className = 'column__header';

    // название карточки
    const columnItemValue = document.createElement('span');
    columnItemValue.innerHTML = columnItemData.value;

    // поле ввода для карточки (нужен для редактирования названия карточки во время ввода текста)
    const columnItemInput = document.createElement('input')
    columnItemInput.type = 'text';
    columnItemInput.value = columnItemData.value;
    columnItemInput.placeholder = 'Пустая колонка'
    columnItemInput.style.display = 'none';

    // кнопка меню
    const menuButton = document.createElement('button');
    menuButton.className = 'menu__button';
    menuButton.innerHTML = `
        <div class="menu-icon">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div>
    `;

    // добавляем в columnHeader название колонки, input и кнопку
    columnHeader.appendChild(columnItemValue);
    columnHeader.appendChild(columnItemInput);
    columnHeader.appendChild(menuButton);

    // добавляем columnHeader (наш header колонки) в columnItemCore (содержания всей инвормации колонки)
    columnItemCore.appendChild(columnHeader);


    // создание контента колонки
    const columnContent = document.createElement('div');
    columnContent.className = 'column__content';

    // создание списка карточек
    const cardsList = document.createElement('ul');
    cardsList.className = 'cards__list';
    cardsList.id = "id" + Math.random().toString(16).slice(2);
    columnContent.appendChild(cardsList);

    // кнопка для добавления карточек
    const cardsButton = document.createElement('button');
    cardsButton.className = 'add__cards__button';

    cardsButton.innerHTML = `
    <span id="card_btn_title">Добавить карточку</span>

    <form style="display: none;">
        <input type="text" id="add_card_value">
        <div class="form-options">
            <button id="submit" type="submit">Добавить</button>
        </div>
    </form>
    `;

    // находим в cardsButtonSpan теги с названием карточки, формы заполнения и поле ввода
    const cardsButtonSpan = cardsButton.querySelector('span')
    const cardsButtonForm = cardsButton.querySelector('form')
    const cardsButtonInput = cardsButtonForm.querySelector('input')

    // Добавление карточки
    cardsButton.addEventListener('click', () => {
        cardsButtonSpan.style.display = 'none'
        cardsButtonForm.style.display = 'flex'

        // Функционал отображения и исчезновения окна
        document.addEventListener('touchstart', (evt) => {
            const touch = evt.touches[0];

            if (touch.target.className !== 'form-options' && touch.target.id !== 'add_card_value' && touch.target.id !== 'submit') {
                cardsButtonSpan.style.display = 'block'
                cardsButtonForm.style.display = 'none'
            }
        })

        document.addEventListener('click', (evt) => {
            if (evt.target.className !== 'form-options' && evt.target.id !== 'add_card_value' && evt.target.id !== 'submit' && evt.target.className !== 'add_card' && evt.target.id !== 'card_btn_title') {
                cardsButtonSpan.style.display = 'block'
                cardsButtonForm.style.display = 'none'
            }
        })

    });

    // функционал добавления карточки
    cardsButtonForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // находим дату
        const currentDate = new Date()

        let cardData = {
            id: Date.now(),
            data: currentDate.getTime(),
            color: null,
            value: cardsButtonInput.value,
            description: null,
        };

        // необходимые данные даём функции addingCard (добавление карточки)
        addingCard(cardsList.id, cardData.id, cardData.value, cardData.color, columnItemData);

        if (cardData.value) {
            columnItemData.cards.push(cardData);

            cardsButtonSpan.style.display = 'block'
            cardsButtonForm.style.display = 'none'
        }

        console.log(columnItemData);
    })

    columnContent.appendChild(cardsButton);
    columnItemCore.appendChild(columnContent);
    columnItem.appendChild(columnItemCore);

    // Отображение окна меню
    menuButton.addEventListener('click', () => {
        addMenuWindow(menuButton, columnItem, columnItem, 'column', columnItemInput);
    })

    return columnItem;
}

// Фунция для удаления колонки
function deleteColumn(columnItem) {
    const index = columnsData.findIndex(elem => elem.id == columnItem.id);

    if (index !== -1) {
        columnsData.splice(index, 1);
        document.getElementById(columnItem.id).remove();
        console.log(columnsData);
    }
}

// функция для изменения колонки
function changeColumn(columnItem, input) {
    // Исчезновение названия колонки и отображение поля ввода
    columnItem.querySelector('.column__header').childNodes[0].style.display = 'none';
    input.style.display = 'block';
    input.focus(); // Устанавливаем фокус на input

    // Находим индекс самой колонки
    const index = columnsData.findIndex(elem => elem.id == columnItem.id);

    // Функция для сохранения нового значения
    const saveNewName = () => {
        let newName = input.value;

        if (index !== -1) {
            if (newName) {
                columnsData[index].value = newName;
                console.log(columnsData);
                document.getElementById(columnItem.id).querySelector('.column__header span').innerHTML = newName;
            } else {
                columnsData[index].value = 'Пустая колонка';
                console.log(columnsData);
                document.getElementById(columnItem.id).querySelector('.column__header span').innerHTML = 'Пустая колонка';
            }
        }

        // Скрываем input и показываем span и button
        columnItem.querySelector('.column__header').childNodes[0].style.display = 'block';
        input.style.display = 'none';
        columnItem.querySelector('.column__header').childNodes[2].style.display = 'block';
    };

    // Удаляем предыдущие обработчики, если они существуют
    input.removeEventListener('keydown', saveNewName);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveNewName();
        }
    });

    // Обработчик события blur для input
    input.addEventListener('blur', () => {
        saveNewName();
    });
}

// Функция для добавления колонки на страницу
function addColumnItemToPage(columnItem) {
    // находим на странице .columns__list
    const columnsListElement = document.querySelector('.columns__list');

    // добавляем в него колонку
    columnsListElement.appendChild(columnItem);
}

// Событие по отображению формы заполнения
addColumnButton.addEventListener('click', showForm);

// Событие по добавлению колонки
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // находим #add_column_value и смотрим у него значение
    const inputValue = form.querySelector('#add_column_value').value;

    if (inputValue) {
        let columnItemData = {
            id: Date.now(),
            value: inputValue,
            cards: []
        };

        // добавляем данные о колонке в columnsData
        columnsData.push(columnItemData);

        // создаём колонку
        const columnItem = createColumnItem(columnItemData);
        addColumnItemToPage(columnItem);

        console.log(columnsData);


        // скрываем формы заполнения
        hideForm();
    }
});



// Функция по добавлению карточки
function addingCard(cardListId, cardDataId, value, color, columnItemData) {
    // находим id списка карточек 
    const cardsList = document.getElementById(cardListId);

    // создаём саму карточку
    const cardItem = document.createElement('li');
    cardItem.className = 'card__item';
    cardItem.id = cardDataId;
    cardItem.draggable = true;
    cardItem.style.background = color;

    // создаём span, где будет находиться название карточки
    const cardItemName = document.createElement('span')
    cardItemName.innerHTML = value;

    // создаём кнопку для отображения модального окна для карточки
    const cardMenuButton = document.createElement('button');
    cardMenuButton.innerHTML = `
        <div class="menu-icon">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div> `;
    cardMenuButton.className = 'card__button';

    // отображение окна меню для карточки
    cardMenuButton.addEventListener('click', () => {
        addMenuWindow(cardMenuButton, cardItem, document.body, 'card', null, columnItemData)
    })


    // добавляем название карточки и кнопку в самоу карточку
    cardItem.appendChild(cardItemName)
    cardItem.appendChild(cardMenuButton);

    // добавляем саму карточку в список, если значение value не пустое
    if (value) {
        cardsList.appendChild(cardItem);
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
