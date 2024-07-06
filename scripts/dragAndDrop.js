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

    if(activeElement){
        // Находим элемент, над которым в данный момент находится курсор
        const currentElement = evt.target;
    
        // Проверяем, что событие сработало:
        // 1. не на том элементе, который мы перемещаем,
        // 2. именно на элементе списка
        const isMoveable = activeElement !== currentElement &&
            currentElement.classList.contains(`tasks__item`);
    
        // Если нет, прерываем выполнение функции
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

// Для элементов goals__item
document.querySelectorAll('.goals__list').forEach(goalsList => {
    goalsList.addEventListener('dragstart', (evt) => {
        if (evt.target.classList.contains('goals__item')) {
            evt.target.classList.add(`selected`);
        }
    });

    goalsList.addEventListener('dragover', (evt) => {
        evt.preventDefault();

        const activeElement = document.querySelector(`.selected`);

        if(activeElement){
            const currentElement = evt.target;

            const isMoveable = activeElement !== currentElement &&
                currentElement.classList.contains(`goals__item`);

            if (!isMoveable) {
                return;
            }

            const nextElement = (currentElement === activeElement.nextElementSibling) ?
                currentElement.nextElementSibling :
                currentElement;

            goalsList.insertBefore(activeElement, nextElement);
        }
    });

    goalsList.addEventListener('drop', (evt) => {
        evt.preventDefault();

        const activeElement = document.querySelector('.selected');
        if (activeElement) {
            activeElement.classList.remove('selected');
        }
    });

    goalsList.addEventListener('dragend', (evt) => {
        if (evt.target.classList.contains('goals__item')) {
            evt.target.classList.remove('selected');
        }
    });
});
