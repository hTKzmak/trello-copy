// список задач
const tasksListElement = document.querySelector(`.tasks__list`);

// сам элемент задачи 
const taskElements = tasksListElement.querySelectorAll(`.tasks__item`);

// Перебираем все элементы списка задач и присваиваем нужное значение
for (const task of taskElements) {
    task.draggable = true;
}

// при перетаскивании будет у выбранного объекта класс selected
tasksListElement.addEventListener(`dragstart`, (evt) => {
    if (evt.target.classList.contains('tasks__item')) {
        evt.target.classList.add(`selected`);
    }
});

tasksListElement.addEventListener(`dragover`, (evt) => {
    // Разрешаем сбрасывать элементы в эту область
    evt.preventDefault();

    // Находим перемещаемый элемент
    const activeElement = tasksListElement.querySelector(`.selected`);

    if (activeElement) {
        // Находим элемент, над которым в данный момент находится курсор
        let currentElement = evt.target;

        // Ищем ближайший родительский элемент с классом tasks__item
        currentElement = currentElement.closest('.tasks__item');

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
        tasksListElement.insertBefore(activeElement, nextElement);
    }
});

// когда отпустим элемент, то класс selected исчезнет
tasksListElement.addEventListener(`dragend`, (evt) => {
    if (evt.target.classList.contains('tasks__item')) {
        evt.target.classList.remove(`selected`);
    }
});