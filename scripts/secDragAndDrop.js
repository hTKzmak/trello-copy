document.addEventListener('dragstart', (evt) => {
    if (evt.target.classList.contains('card__item')) {
        evt.target.classList.add('choosen');
    }
});

document.addEventListener('dragover', (evt) => {
    // Разрешаем сбрасывать элементы в эту область
    evt.preventDefault();

    const activeElement = document.querySelector('.choosen');

    // Проверяем если событие dragover произошёл на действительном/не в пустом goals__ist или card__item 
    if (activeElement && (evt.target.classList.contains('cards__list') || evt.target.classList.contains('card__item'))) {
        const currentElement = evt.target;

        // проверка на наличие подзадач в goals__list (он как бы должен работать, но не работает)
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
});

document.addEventListener('dragend', (evt) => {
    if (evt.target.classList.contains('choosen')) {
        evt.target.classList.remove('choosen');
    }
});
