// Находим элементы на странице
const addColumnButton = document.querySelector('.add_column');
const form = document.querySelector('form');

// Массив для хранения данных колонок
let columnsData = [];

// choosenColor отвечает за исчезновение окна после нажатия на кнопку изменения цвета (если false, то окно исчезает, если true, то не исчезает)
let colorChoosen = false;
console.log(`Значение colorChoosen: ${colorChoosen}`)


// Функция для скрытия формы заполнения
function hideForm() {
    form.style.display = 'none';
    addColumnButton.querySelector('span').style.display = 'block';
    document.querySelector('#add_column_value').value = "";
}


// document.addEventListener('touchstart', (evt) => {
//     const touch = evt.touches[0];

//     console.log(touch)
// })


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

// фукнция для сортровки карточек выбранной нами колонки
function sortFunctionality(type, column) {
    console.log('сортировка от большего к меньшему')
    // Находим индекс самой колонки
    const index = columnsData.findIndex(elem => elem.id == column.id);


    // сортировка карточек
    switch (type) {
        case 'upToDown':
            columnsData[index].cards.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
            console.log(columnsData[index]);
            console.log(columnsData);
            break
        case 'downToUp':
            columnsData[index].cards.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
            console.log(columnsData[index]);
            console.log(columnsData);
            break
        case 'letter':
            columnsData[index].cards.sort((a, b) => {
                if (a.value < b.value) {
                    return -1;
                } else if (a.value > b.value) {
                    return 1;
                } else {
                    return 0;
                }
            });
            console.log(columnsData[index]);
            console.log(columnsData);
            break
        default:
            // выполнится, если ни один другой случай не сработал
            console.log('Сортировка не сработала (ಡ‸ಡ)')
            break
    }


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
}


// Функция по добавлению кнопки сортировки карточек
function addSortButton(window, column) {
    // кнопка для сортировки карточек
    const sortButton = document.createElement('button');
    sortButton.className = 'buttonStyle';
    sortButton.innerHTML = 'Сортировать';

    // отдельное окно для сортировки карточек
    const sortWindow = document.createElement('div')
    sortWindow.className = 'window__elem';
    sortWindow.style = `
        top: -15px;
        right: -150px;
        left: auto;
    `

    // кнопка для сортировки от большего к меньшему
    const upToDown_BTN = document.createElement('button');
    upToDown_BTN.className = 'buttonStyle';
    upToDown_BTN.innerHTML = 'Дата создания (сначала новые)';

    // кнопка для сортировки от большего к меньшему
    const downToUp_BTN = document.createElement('button');
    downToUp_BTN.className = 'buttonStyle';
    downToUp_BTN.innerHTML = 'Дата создания (сначала старые)';

    // кнопка для сортировки от большего к меньшему
    const letterSort_BTN = document.createElement('button');
    letterSort_BTN.className = 'buttonStyle';
    letterSort_BTN.innerHTML = 'Название карточки (по алфавиту)';

    sortWindow.appendChild(upToDown_BTN)
    sortWindow.appendChild(downToUp_BTN)
    sortWindow.appendChild(letterSort_BTN)


    // отображение окна сортировки
    sortButton.addEventListener('mouseenter', () => {
        sortButton.appendChild(sortWindow)
    })

    sortButton.addEventListener('click', () => {
        sortButton.appendChild(sortWindow)
    })

    sortButton.addEventListener('mouseleave', () => {
        sortWindow.remove();
    })



    // сортировка карточек
    upToDown_BTN.addEventListener('click', () => {
        sortFunctionality('upToDown', column)
        sortWindow.remove();
        window.remove();
    })

    downToUp_BTN.addEventListener('click', () => {
        sortFunctionality('downToUp', column)
        sortWindow.remove();
        window.remove();
    })

    letterSort_BTN.addEventListener('click', () => {
        sortFunctionality('letter', column)
        sortWindow.remove();
        window.remove();
    })


    window.appendChild(sortButton)
}


// изменение HEX цвета в RGB для отслеживания яркости цвета
function hexToRgb(hex) {
    // Убираем символ #
    hex = hex.replace('#', '');
    // Преобразуем в RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}


// Функция по добавлению кнопки изменения цвета выбранной нами карточки
function addColorButton(window, card, columnItemData) {
    // кнопка для перекраски карточки
    const colorButton = document.createElement('button');
    colorButton.className = 'buttonStyle';
    colorButton.innerHTML = 'Изменить цвет';

    // Создаем элемент input типа color
    const colorPicker = document.createElement('input');
    // colorPicker.type = 'color';
    colorPicker.setAttribute('data-coloris', '')
    colorPicker.value = '#FFFFFF';
    colorPicker.style = `
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width: 100%;
        cursor: pointer;
        `

    // изменение значеня colorChoosen (чтобы окно не исчезло)
    colorButton.addEventListener('click', () => {
        colorChoosen = true;
        console.log(`Значение colorChoosen: ${colorChoosen}`)
    })

    // функционал изменения цвета
    colorPicker.addEventListener('input', (e) => {

        // изменение значеня colorChoosen
        colorChoosen = false;
        console.log(`Значение colorChoosen: ${colorChoosen}`)

        const index = columnItemData.cards.findIndex(elem => elem.id == card.id);
        // Выводим выбранное значение цвета в консоль
        document.getElementById(card.id).style.background = e.target.value;
        document.getElementById(card.id).style.borderColor = e.target.value;

        // Изменяем цвет текста в зависимости от яркости фона
        const rgb = hexToRgb(e.target.value);
        const brightness = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);
        document.getElementById(card.id).children[0].style.color = brightness > 186 ? 'black' : 'white';

        // console.log(e.target.value);
        columnItemData.cards[index].color = e.target.value;
        console.log(columnItemData.cards[index])

        window.remove();
    })


    // добавляем сам input в кнопку, делая его невидимым
    colorButton.appendChild(colorPicker)

    // добавляем в окно эту кнопку
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
            changeColumn(item, input, columnItemData);
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

    // Функционал отображения и исчезновения окна для смартфонов/планшетов
    document.addEventListener('touchstart', (evt) => {
        const touch = evt.touches[0];

        // evt.target.type !== 'text' не позволит исчезнуть редактору цвета (я без понятия почему так это работает)
        if (touch.target.className !== 'window__elem' && touch.target.className !== 'buttonStyle' && evt.target.type !== 'text') {
            menuWindow.remove();
        }
    })

    // Функционал отображения и исчезновения окна для ПК
    menuWindow.addEventListener('mouseleave', (evt) => {
        if (colorChoosen !== true) {
            menuWindow.remove();
        }
    });

    // нужно определить позицию выбранной нами карточки, чтобы расположить его рядом с самой карточкой
    // Добавляем само меню для выбранного нами места (то есть, place)
    document.addEventListener('click', (event) => {
        if (type === 'card' && event.target.className !== 'buttonStyle' && event.target.type !== 'color') {
            menuWindow.style.top = (event.clientY - 45) + 'px'
            menuWindow.style.left = (event.clientX - 110) + 'px'
        }
        // }, {once: true})
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

        // удаление поле ввода описания
        tinymce.remove();
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

        // удаление поле ввода описания
        tinymce.remove();
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
        descIcon.innerHTML = '<img src="./icons/description.svg" title="У этой карточки есть описание" alt="#" style="width: 15px; height: 15px;">';
        descIcon.style = `
            position: absolute;
            bottom: 5px;
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
                }
            }
        }

        // удаление поле ввода описания
        tinymce.remove();
    })


    // Вторая кнопка закрытия модального окна, сделанная для options
    const secondCloseButton = document.createElement('button');
    secondCloseButton.innerHTML = 'Закрыть'

    // фунционал закрытия окна (то есть, удаляет modalWindowContainer с разметки)
    secondCloseButton.addEventListener('click', () => {
        modalWindowContainer.remove();

        // удаление поле ввода описания
        tinymce.remove();
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
        highlight_on_focus: false,
        license_key: 'gpl',
        statusbar: false,
        promotion: false,
        menubar: true,
        language: 'ru',
        plugins: 'lists emoticons',
        forced_root_block: 'div',
        newline_behavior: 'linebreak',
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
    // columnItem.draggable = true;

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
    // columnItemInput.value = columnItemData.value;
    columnItemInput.placeholder = 'Введите название'
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
        <input type="text" id="add_card_value" placeholder="Введите название">
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
                cardsButtonSpan.style.display = 'block';
                cardsButtonForm.style.display = 'none';
                cardsButtonInput.value = '';
            }
        })

        document.addEventListener('click', (evt) => {
            if (evt.target.className !== 'form-options' && evt.target.id !== 'add_card_value' && evt.target.id !== 'submit' && evt.target.className !== 'add_card' && evt.target.id !== 'card_btn_title') {
                cardsButtonSpan.style.display = 'block';
                cardsButtonForm.style.display = 'none';
                cardsButtonInput.value = '';
            }
        })

    });

    // функционал добавления карточки
    cardsButtonForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // находим дату и время создания карточки
        const formatUTC = new Date().toISOString().replace('T', ' ').split('.')[0];

        let cardData = {
            id: Date.now(),
            data: formatUTC,
            color: null,
            value: cardsButtonInput.value,
            description: null,
        };

        // необходимые данные даём функции addingCard (добавление карточки)
        addingCard(cardsList.id, cardData.id, cardData.value, cardData.color, columnItemData);

        if (cardData.value) {
            columnItemData.cards.push(cardData);
            cardsButtonInput.value = '';

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
        addMenuWindow(menuButton, columnItem, columnItem, 'column', columnItemInput, columnItemData);
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
function changeColumn(columnItem, input, columnItemData) {
    // Исчезновение названия колонки и отображение поля ввода
    columnItem.querySelector('.column__header').childNodes[0].style.display = 'none';

    // добавляем название колонки с данных в сам input (для этого используется columnItemData) 
    input.value = columnItemData.value
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
                console.log(columnsData);
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
            // // временный вариант проверки на уникальность названия карточки
            // if (columnsData.find(e => e.value === input.value)) {
            //     alert('Колонка с таким названием уже есть. Введите другое название')
            // }
            // else {
            saveNewName();
            // }
        }
    });

    // Обработчик события blur для input
    input.addEventListener('blur', () => {
        // // временный вариант проверки на уникальность названия карточки
        // if (columnsData.find(e => e.value === input.value)) {
        //     alert('Колонка с таким названием уже есть. Введите другое название')
        // }
        // else {
        saveNewName();
        // }
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
    let inputValue = form.querySelector('#add_column_value').value;

    let columnItemData = {
        id: Date.now(),
        value: inputValue,
        cards: []
    };

    // временный вариант проверки на уникальность названия карточки
    if (columnsData.find(e => e.value === inputValue)) {
        alert('Колонка с таким названием уже есть. Введите другое название')
    }

    // добавляем колонку в случае если название не пустое и уникальное от остальных колонок
    if (inputValue && !columnsData.find(e => e.value === inputValue)) {

        // добавляем данные о колонке в columnsData
        columnsData.push(columnItemData);

        // создаём колонку
        const columnItem = createColumnItem(columnItemData);
        addColumnItemToPage(columnItem);

        // скрываем формы заполнения
        hideForm();
    }



    // Фукционал Drag and Drop с библиотекой SortableJS для карточек
    // Он будет отслеживать перемещение карточек и добавлять сами карточки в пустые колонки после их создания
    const cardsListEl = document.querySelectorAll('.cards__list')

    cardsListEl.forEach(elem => {
        Sortable.create(elem, {
            group: 'selected',
            animation: 100,
            delay: window.innerWidth <= 900 ? 50 : 0,

            onChange: function () {
                console.log('Данные карточек обновились')
            },

            // с помощью onUnchoose можно реализовать перемещение карточек в самый конец списка, если мы перемещаем в низ колонки
            onUnchoose: function (evt) {
                if (evt.explicitOriginalTarget.className === 'column__item' && window.innerWidth > 1200) {
                    evt.explicitOriginalTarget.querySelector('ul').appendChild(evt.item)
                }
            },

        });
    })
});



// Функция по добавлению карточки
function addingCard(cardListId, cardDataId, value, color, columnItemData) {
    // находим id списка карточек 
    const cardsList = document.getElementById(cardListId);

    // создаём саму карточку
    const cardItem = document.createElement('li');
    cardItem.className = 'card__item';
    cardItem.id = cardDataId;
    // cardItem.draggable = true;
    cardItem.style.background = color;
    cardItem.style.borderColor = color === '#ffffff' ? '#36a4a4' : color;

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
