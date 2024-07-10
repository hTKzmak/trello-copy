// кнопка добавления задачи
const add_item_button = document.querySelector(`.add_item`);

// находим форму заполнения
const form = document.querySelector(`form`)


// здесь будут храниться задачи (item_data)
let tasksData = [];


// событие по отображению формы заполнения
add_item_button.addEventListener('click', () => {
    // делаем форму зыполнения видимым
    form.style.display = 'grid'

    // убираем текст тега span
    add_item_button.querySelector('span').style.display = 'none'
})



// событие по добавлению задачи
form.addEventListener('submit', (e) => {
    // глушитель
    e.preventDefault();

    // значение input
    let input_value = form.querySelector('#add_item_value').value

    // если значение input_value не пустое, то выполняется следущее условие
    if (input_value) {

        // данные, которые будут храниться в блоках с задачами
        let task_item_data = {
            id: Date.now(),
            value: input_value,
            goals: []
        }

        // добавляем данные в tasksData
        tasksData.push(task_item_data)

        // находим основной список задач на странице
        const tasksListElement = document.querySelector('.tasks__list')



        // создаём task_item
        const task_item = document.createElement('li')

        const task_item_value = document.createElement('span')

        task_item_value.innerHTML = task_item_data.value

        // доп. параметры task_item
        task_item.className = 'tasks__item'
        task_item.id = task_item_data.id
        // task_item.innerHTML = task_item_data.value
        task_item.draggable = true

        // удаление task_item
        task_item.addEventListener('dblclick', () => {
            // удаляем задачу из массива tasksData
            tasksData = tasksData.filter(elem => elem.id !== task_item_data.id)
            // удаляем задачу со страницы
            document.getElementById(task_item_data.id).remove();
        })

        task_item.appendChild(task_item_value)



        // создаём список задач и добавляем в task_item 
        const goals_list = document.createElement('ul')
        goals_list.className = 'goals__list'
        goals_list.id = "id" + Math.random().toString(16).slice(2) // второй способ создания рандомного id (чтобы он не совпадал с id переменной task_item)
        task_item.appendChild(goals_list)


        // создаём кнопку для добавления задач, делаем для него функционал и добавляем в task_item 
        const goals_button = document.createElement('button')
        goals_button.className = 'goals__button'
        goals_button.innerHTML = 'Добавить заголовок'

        goals_button.addEventListener('click', () => {

            // тут можно написать код для показа формы заполнения, ...

            // данные для подзадачи
            let goal_data = {
                id: Date.now(),
                value: prompt('Write goal name', 'goal 1'),
            }

            // функция по добавлению подзадач
            addingGoal(goals_list.id, goal_data.id, goal_data.value, task_item_data)

            task_item_data.goals.push(goal_data)
            console.log(task_item_data)

            // ... а тут можно написать код для показа текста кнопки и исчезновения формы заполнения
        })

        // добавление кнопки для добавления подзадач
        task_item.appendChild(goals_button)


        // добавляем на сайт
        tasksListElement.appendChild(task_item)


        // отображает данные (содержимое массива) в консоле
        console.log(tasksData)


        // убираем форму заполнения
        form.style.display = 'none'

        // делаем текст span видимым
        add_item_button.querySelector('span').style.display = 'block'
    }

})

// функция по добавлению подзадачи
function addingGoal(goalListId, goalDataId, value, data) {
    const goals_list = document.getElementById(goalListId)

    const goal_item = document.createElement('li')
    goal_item.className = 'goals__item'
    goal_item.id = goalDataId
    goal_item.innerHTML = value
    goal_item.draggable = true

    // удаление подзадачи по клику
    goal_item.addEventListener('click', () => {

        // удаление подзадачи в данных
        const index = data.goals.findIndex(elem => elem.id == goalDataId)

        if (index !== -1) {
            // Удаляем элемент из массива goals
            data.goals.splice(index, 1);

            // Удаляем  из DOM
            document.getElementById(goal_item.id).remove();

            console.log('result');
            console.log(data.goals); // Проверяем, что элемент был удален из массива
            console.log(data);
        }

    })

    if (value) {
        goals_list.appendChild(goal_item)
    }

}