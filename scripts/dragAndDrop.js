// список задач
const columnsListElement = document.querySelector(`.columns__list`);

// сам элемент задачи 
const columnElements = columnsListElement.querySelectorAll(`.column__item`);


// Фукционал Drag and Drop с библиотекой SortableJS для колонок
// https://github.com/SortableJS/Sortable

Sortable.create(columnsListElement, {
    gropup: 'selected',
    animation: 100, // скорость анимации
    handle: '.column__header', // перетаскиваем колонку, удерживая выбранный нами элемент (в нашем случае это .column__header)
    delay: window.innerWidth <= 900 ? 50 : 0, // время в миллисекундах, чтобы определить, когда должна начаться сортировка
    filter: '#ignore',

    // вызов функции при изменении положений колонок
    onChange: function () {
        console.log('Данные колонок обновились')
    },

});

