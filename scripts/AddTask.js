const btn = document.querySelector(`.add_item`);

const btnCancel = document.querySelector(`#cancel`);

const btn_form = document.querySelector(`form`)


// здесь будут храниться задачи (item_data)
let tasksData = [];


// событие по отображению формы заполнения
btn.addEventListener('click', () => {
    // делаем форму зыполнения видимым
    btn_form.style.display = 'block'

    // убираем текст тега span
    btn.querySelector('span').style.display = 'none'
})



// событие по добавлению задачи
btn_form.addEventListener('submit', (e) => {
    e.preventDefault();

    // значение input
    let input_value = btn_form.querySelector('#add_item_value').value

    // если значение input_value не пустое, то выполняется следущее условие
    if (input_value) {

        // данные, которые будут храниться в блоках с задачами
        let item_data = {
            id: Date.now(),
            value: input_value,
            tasks: []
        }

        // добавляем данные в tasksData
        tasksData.push(item_data)

        // отображаем созданный нами задачу на сайте
        const new_item = document.createElement('li')

        const tasksListElement = document.querySelector('.tasks__list')

        new_item.className = 'tasks__item'
        new_item.id = item_data.id
        new_item.innerHTML = item_data.value
        new_item.draggable = true

        new_item.addEventListener('dblclick', () => {
            deleteTask(item_data.id)
        })


        // добавляем на сайт
        tasksListElement.appendChild(new_item)


        console.log(tasksData)


        // убираем форму заполнения
        btn_form.style.display = 'none'

        // делаем текст span видимым
        btn.querySelector('span').style.display = 'block'
    }

})

// функция по удалению задачи 
function deleteTask(id) {
    // удаляем задачу из массива tasksData
    tasksData = tasksData.filter(elem => elem.id !== id)
    // удаляем задачу со страницы
    document.getElementById(id).remove();
    console.log(tasksData)
}