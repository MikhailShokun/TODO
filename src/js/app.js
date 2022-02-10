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



if (localStorage.getItem('state') != undefined) {
    state = JSON.parse(localStorage.getItem('state'));
    renderTasks(state);
    allCounter = state.length;
}

input.addEventListener('keyup', (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
        if (event.target.value.trim()) {
            addTaskToState(event.target.value.trim());
            changeStatus();
            renderTasks(state);
            event.target.value = '';
            throughText();
        }
    }
})

function setState() {
    localStorage.setItem('state',
        JSON.stringify(state));
}

function addTaskToState(title) {
    state.push({ id: generateId(), title: title, checked: false });
    setState();
    allCounter = state.length;
}

function generateId() {
    return (new Date()).getTime();
}

function changeStatus() {
    checkedCounter = 0;
    uncheckedCounter = 0;
    state.forEach(task =>
        task.checked ? checkedCounter++ : uncheckedCounter++);
    setState()
}

function renderTasks(arr) {
    container.innerHTML = '';
    arr.sort((b, a) => a.id - b.id);
    arr.forEach(task => {
        container.innerHTML +=
            `
           <div class="list__item ${task.checked ? 'checked' : 'unchecked'}" data-id="${task.id}">
               <li class="list__item-text">${task.title}</li>
               <span class="list__item-delete">❌</span>
           </div>
            `
    })
    throughText();
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
                setState();

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
                setState();

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
        throughText();
        setState()
    }

    if (target.closest('.checkedCounter')) {
        let checkedState = state.filter(item => {
            return item.checked == true;
        })
        renderTasks(checkedState);
        setState();
    }

    if (target.closest('.uncheckedCounter')) {
        let uncheckedState = state.filter(item => {
            return item.checked == false;
        })
        renderTasks(uncheckedState);
        setState()
    }

    if (target.closest('.clear')) {
        state = [];
        allCounter = 0;
        checkedCounter = 0;
        uncheckedCounter = 0;
        renderTasks(state);
        setState();
    }
});


changeStatus();
renderTasks(state);