// список задач
const columnsListElement = document.querySelector(`.columns__list`);

// сам элемент задачи 
const columnElements = columnsListElement.querySelectorAll(`.column__item`);


// Фукционал Drag and Drop без библиотек

// Перебираем все элементы списка задач и присваиваем нужное значение
// for (const task of columnElements) {
//     task.draggable = true;
// }


// при перетаскивании будет у выбранного объекта класс selected
const addSelect = (evt) => {
    if (evt.target.classList.contains('column__item')) {
        evt.target.classList.add(`selected`);
    }
}

// Перетаскивание колонок
const dragColumn = (evt) => {
    // Разрешаем сбрасывать элементы в эту область
    evt.preventDefault();

    // Находим перемещаемый элемент
    const activeElement = columnsListElement.querySelector(`.selected`);

    if (activeElement) {
        // Находим элемент, над которым в данный момент находится курсор
        let currentElement = evt.target;

        // Ищем ближайший родительский элемент с классом column__item
        currentElement = currentElement.closest('.column__item');

        // Проверяем, что событие сработало:
        // 1. не на том элементе, который мы перемещаем,
        // 2. именно на элементе списка
        const isMoveable = activeElement !== currentElement &&
            currentElement !== null;

        if (!isMoveable) {
            return;
        }

        // Находим элемент, перед которым будем вставлять
        const nextElement = (currentElement === activeElement.nextElementSibling) ?
            currentElement.nextElementSibling :
            currentElement;

        // Вставляем activeElement перед nextElement
        columnsListElement.insertBefore(activeElement, nextElement);
    }
}

// когда отпустим элемент, то класс selected исчезнет
const removeSelect = (evt) => {
    if (evt.target.classList.contains('column__item')) {
        evt.target.classList.remove(`selected`);
    }
}


// событие добавления класса selected
columnsListElement.addEventListener('dragstart', addSelect)

// событие перетаскивания колоноки
columnsListElement.addEventListener(`dragover`, dragColumn)

// событие удаления класса selected
columnsListElement.addEventListener('dragend', removeSelect)

