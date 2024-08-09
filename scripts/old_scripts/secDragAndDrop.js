const addChoosen = (evt) => {
    if (evt.target.classList.contains('card__item')) {
        evt.target.classList.add('choosen');
    }
}

const dragCard = (evt) => {
    // Разрешаем сбрасывать элементы в эту область
    evt.preventDefault();

    const activeElement = document.querySelector('.choosen');

    // Проверяем если событие dragover произошёл на действительном/не в пустом goals__ist или card__item 
    if (activeElement && (evt.target.classList.contains('cards__list') || evt.target.classList.contains('card__item'))) {
        const currentElement = evt.target;

        // проверка на наличие подзадач в goals__list
        if (currentElement.classList.contains('cards__list') && currentElement.children.length === 0) {
            currentElement.appendChild(activeElement);
        } else {
            const isMoveable = activeElement !== currentElement && currentElement.classList.contains('card__item');

            if (!isMoveable) {
                return;
            }

            const nextElement = (currentElement === activeElement.nextElementSibling) ? currentElement.nextElementSibling : currentElement;

            // Ставим перетаскиваемую нами подзадачу туда, куда нам надо
            currentElement.parentElement.insertBefore(activeElement, nextElement);
        }
    }
    // Проверяем если событие dragover произошёл на column__item
    else if (activeElement && (evt.target.classList.contains('column__item'))) {
        const currentElement = evt.target;

        const cardsList = currentElement.querySelector('.cards__list');

        cardsList.appendChild(activeElement)
    }
}

const removeChoosen = (evt) => {
    if (evt.target.classList.contains('choosen')) {
        evt.target.classList.remove('choosen');
    }
}


// событие добавления класса choosen
document.addEventListener('dragstart', addChoosen);

// событие перемещения карточки
document.addEventListener('dragover', dragCard);

// событие удаления класса choosen
document.addEventListener('dragend', removeChoosen);


