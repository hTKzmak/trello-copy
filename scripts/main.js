// кнопка добавления задачи
const add_column_button = document.querySelector(`.add_column`);

// находим форму заполнения
const form = document.querySelector(`form`)


// здесь будут храниться задачи (item_data)
let columnsData = [];


// событие по отображению формы заполнения
add_column_button.addEventListener('click', () => {
    // делаем форму зыполнения видимым
    form.style.display = 'grid'

    // убираем текст тега span
    add_column_button.querySelector('span').style.display = 'none'
})



// событие по добавлению задачи
form.addEventListener('submit', (e) => {
    // глушитель
    e.preventDefault();

    // значение input
    let input_value = form.querySelector('#add_column_value').value

    // если значение input_value не пустое, то выполняется следущее условие
    if (input_value) {

        // данные, которые будут храниться в блоках с задачами
        let column_item_data = {
            id: Date.now(),
            value: input_value,
            cards: []
        }

        // добавляем данные в columnsData
        columnsData.push(column_item_data)

        // находим основной список задач на странице
        const columnsListElement = document.querySelector('.columns__list')



        // создаём column_item
        const column_item = document.createElement('li')

        // создание header для карточки, где будет название карточки и меню
        const column_header = document.createElement('div')
        column_header.className = 'column__header'

        // создание названия карточки
        const column_item_value = document.createElement('span')
        column_item_value.innerHTML = column_item_data.value


        // доп. параметры column_item
        column_item.className = 'column__item'
        column_item.id = column_item_data.id
        // column_item.innerHTML = column_item_data.value
        column_item.draggable = true


        // удаление column_item
        column_item.addEventListener('dblclick', () => {
            // удаляем задачу из массива columnsData
            columnsData = columnsData.filter(elem => elem.id !== column_item_data.id)
            // удаляем задачу со страницы
            document.getElementById(column_item_data.id).remove();
        })

        // добавляем название карточки в header самой карточки
        column_header.appendChild(column_item_value)
        // добавляем сам header карточки в саму карточку
        column_item.appendChild(column_header)


        // создаём column_content, где будет находиться кнопка и список подзаголовков
        const column_content = document.createElement('div')
        column_content.className = 'column__content'


        // создаём список задач и добавляем в column_item 
        const cards_list = document.createElement('ul')
        cards_list.className = 'cards__list'
        cards_list.id = "id" + Math.random().toString(16).slice(2) // второй способ создания рандомного id (чтобы он не совпадал с id переменной column_item)
        column_content.appendChild(cards_list)


        // создаём кнопку для добавления задач, делаем для него функционал и добавляем в column_item 
        const cards_button = document.createElement('button')
        cards_button.className = 'cards__button'
        cards_button.innerHTML = 'Добавить карточку'

        // добавление подзаголовка 
        cards_button.addEventListener('click', () => {
            // данные для подзадачи
            let card_data = {
                id: Date.now(),
                value: prompt('Write card name', 'card 1'),
            }

            // функция по добавлению подзадач
            addingCard(cards_list.id, card_data.id, card_data.value, column_item_data)

            column_item_data.cards.push(card_data)
            console.log(column_item_data)
        })

        // добавление кнопки для добавления подзадач
        column_content.appendChild(cards_button)

        // добавляем в column_item наш column_content, где находится список и кнопка
        column_item.appendChild(column_content)


        // добавляем на сайт
        columnsListElement.appendChild(column_item)


        // отображает данные (содержимое массива) в консоле
        console.log(columnsData)


        // убираем форму заполнения
        form.style.display = 'none'

        // делаем текст span видимым
        add_column_button.querySelector('span').style.display = 'block'
    }

})

// функция по добавлению подзадачи
function addingCard(cardListId, cardDataId, value, data) {
    const cards_list = document.getElementById(cardListId)

    const card_item = document.createElement('li')
    card_item.className = 'card__item'
    card_item.id = cardDataId
    card_item.innerHTML = value
    card_item.draggable = true

    // удаление подзадачи по клику
    card_item.addEventListener('click', () => {

        // удаление подзадачи в данных
        const index = data.cards.findIndex(elem => elem.id == cardDataId)

        if (index !== -1) {
            // Удаляем элемент из массива cards
            data.cards.splice(index, 1);

            // Удаляем  из DOM
            document.getElementById(card_item.id).remove();

            console.log('result');
            console.log(data.cards); // Проверяем, что элемент был удален из массива
            console.log(data);
        }

    })

    if (value) {
        cards_list.appendChild(card_item)
    }

}