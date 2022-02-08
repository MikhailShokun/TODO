const input = document.querySelector('.tasks__input'),
    container = document.querySelector('.tasks__list'),


    allTasks = document.querySelector('.counter__all-span'),
    checkedTasks = document.querySelector('.counter__checked-span'),
    uncheckedTasks = document.querySelector('.counter__unchecked-span'),
    clearButton = document.querySelector('.btn-clear');

let state = [];
let checkedCounter = 0;
let uncheckedCounter = 0;
let allCounter = 0;

input.addEventListener('keyup', (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
        if (event.target.value != '') {
            addTaskToState(event.target.value.trim());
            changeStatus();
            renderTasks(state);
            event.target.value = '';
            throughText();
        }
    }
})

function addTaskToState(title) {
    state.push({ id: generateId(), title: title, checked: false })
    allCounter = state.length;
}

let currentId = 1;

function generateId() {
    return currentId++;
}

function changeStatus() {
    checkedCounter = 0;
    uncheckedCounter = 0;
    state.forEach(task =>
        task.checked ? checkedCounter++ : uncheckedCounter++)
}

function renderTasks(arr) {
    container.innerHTML = '';
    arr.sort((a, b) => b.id - a.id);
    arr.forEach(task => {
        container.innerHTML +=
            `
           <div class="list__item ${task.checked ? 'checked' : 'unchecked'}" data-id="${task.id}">
               <li class="list__item-text">${task.title}</li>
               <span class="list__item-delete">❌</span>
           </div>
            `
    })
    checkedTasks.innerHTML = checkedCounter;
    uncheckedTasks.innerHTML = uncheckedCounter;
    allTasks.innerHTML = allCounter;
    rerenderListeners();
}


function rerenderListeners() {
    let listItems = document.querySelectorAll('.list__item');
    listItems.forEach(listItem => {
        listItem.addEventListener('click', function(event) {
            let targetItem = event.target;
            if (targetItem.closest('li')) {
                let taskId = listItem.getAttribute('data-id');
                let newTask = {
                    ...state.find(elem => elem.id == taskId),
                    checked: !state.find(elem => elem.id == taskId).checked
                }
                state = state.filter(task => task.id != taskId);
                state = [...state, newTask];

                if (newTask.checked) {
                    listItem.classList.add('list__item-text_through');
                    checkedCounter++;
                    uncheckedCounter--;
                } else {
                    listItem.classList.remove('list__item-text_through');
                    checkedCounter--;
                    uncheckedCounter++;
                }
                checkedTasks.innerHTML = checkedCounter;
                uncheckedTasks.innerHTML = uncheckedCounter;
            }


            if (targetItem.closest('.list__item-delete')) {
                let deleteTaskId = listItem.getAttribute('data-id');
                if (listItem.classList.contains('list__item-text_through')) { checkedCounter-- } else {
                    uncheckedCounter--
                }
                listItem.remove();
                state = state.filter(task => +task.id != +deleteTaskId);
                allCounter = state.length;

                checkedTasks.innerHTML = checkedCounter;
                uncheckedTasks.innerHTML = uncheckedCounter;
                allTasks.innerHTML = allCounter;
            }
        });
    });
}

function throughText() {
    let taskItems = document.querySelectorAll('.list__item');
    taskItems.forEach(taskItem => {
        if (taskItem.classList.contains('checked')) {
            taskItem.classList.add('list__item-text_through')
        }
    })
}

const buttonsField = document.querySelector('.counter')
buttonsField.addEventListener('click', function(event) {
    let target = event.target;

    if (target.closest('.allCounter')) {
        renderTasks(state);
        throughText()
    }

    if (target.closest('.checkedCounter')) {
        let checkedState = state.filter(item => {
            return item.checked == true;
        })
        renderTasks(checkedState);
        throughText();
    }

    if (target.closest('.uncheckedCounter')) {
        let uncheckedState = state.filter(item => {
            return item.checked == false;
        })
        renderTasks(uncheckedState);
    }

    if (target.closest('.clear')) {
        state = [];
        allCounter = 0;
        checkedCounter = 0;
        uncheckedCounter = 0;
        renderTasks(state);
    }
})

changeStatus();
renderTasks(state);