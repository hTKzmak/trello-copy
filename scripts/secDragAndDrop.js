// Use event delegation for goals__list elements

document.addEventListener('dragstart', (evt) => {
    if (evt.target.classList.contains('goals__item')) {
        evt.target.classList.add('choosen');
    }
});

document.addEventListener('dragover', (evt) => {
    // Разрешаем сбрасывать элементы в эту область
    evt.preventDefault();

    const activeElement = document.querySelector('.choosen');

    // Check if dragover event is happening on a valid goals__list or goals__item
    if (activeElement && (evt.target.classList.contains('goals__list') || evt.target.classList.contains('goals__item'))) {
        const currentElement = evt.target;

        // Handle dragging over empty goals__list
        if (currentElement.classList.contains('goals__list') && currentElement.children.length === 0) {
            currentElement.appendChild(activeElement);
        } else {
            const isMoveable = activeElement !== currentElement && currentElement.classList.contains('goals__item');

            if (!isMoveable) {
                return;
            }

            const nextElement = (currentElement === activeElement.nextElementSibling) ? currentElement.nextElementSibling : currentElement;

            // Insert activeElement before nextElement
            currentElement.parentElement.insertBefore(activeElement, nextElement);
        }
    }
});

document.addEventListener('dragend', (evt) => {
    if (evt.target.classList.contains('choosen')) {
        evt.target.classList.remove('choosen');
    }
});
