// список задач
const columnsListElement = document.querySelector(`.columns__list`);

// сам элемент задачи 
const columnElements = columnsListElement.querySelectorAll(`.column__item`);


// Фукционал Drag and Drop с библиотекой SortableJS для колонок
// https://github.com/SortableJS/Sortable

Sortable.create(columnsListElement, {
    animation: 100, // скорость анимации
    handle: '.column__header', // перетаскиваем колонку, удерживая выбранный нами элемент (в нашем случае это .column__header)
    delay: 50, // время в миллисекундах, чтобы определить, когда должна начаться сортировка

    // вызов функции при изменении положений колонок
    onChange: function () {
        console.log('Данные колонок обновились')
    }
});
