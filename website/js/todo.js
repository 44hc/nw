let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completedTodosDiv = document.querySelector('.completed-todos')
const unCompletedTodosDiv = document.querySelector('.uncompleted-todos')
const audio = new Audio('../assets/click.mp3');

// Get the to-do list on first boot
window.onload = () => {
    let storageTodoItems = localStorage.getItem('todoItems')
    if (storageTodoItems !== null) {
        todoItems = JSON.parse(storageTodoItems)
    }

    render()
}

// Input
todoInput.onkeyup = (e) => {
    let value = e.target.value.replace(/^\s+/, "");
    if (value && e.keyCode == 13) { // Enter
        addTodo(value)

        todoInput.value = ''
        todoInput.focus()
    }
};

// Add to-do
function addTodo(text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })

    saveAndRender()
}

// Remove to-do
function removeTodo(id) {
    todoItems = todoItems.filter(todo => todo.id !== Number(id))
    saveAndRender()
}

// Mark as completed
function markAsCompleted(id) {
    todoItems = todoItems.filter(todo => {
        if (todo.id === Number(id)) {
            todo.completed = true
        }

        return todo
})

    audio.play(); // Sound

    saveAndRender()
}

// Mark as uncompleted
function markAsUncompleted(id) {
    todoItems = todoItems.filter(todo => {
        if (todo.id === Number(id)) {
            todo.completed = false
        }

        return todo
})

    saveAndRender()
}

// Local Storage
function save() {
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// Render
function render() {
    let unCompletedTodos = todoItems.filter(item => !item.completed)
    let completedTodos = todoItems.filter(item => item.completed)

    completedTodosDiv.innerHTML = ''
    unCompletedTodosDiv.innerHTML = ''

    if (unCompletedTodos.length > 0) {
        unCompletedTodos.forEach(todo => {
            unCompletedTodosDiv.append(createTodoElement(todo))
        })
    } else {
        unCompletedTodosDiv.innerHTML = `<div class='empty'>No uncompleted tasks</div>`
    }

    if (completedTodos.length > 0) {
        completedTodosDiv.innerHTML = `<div class='completed-title'>Completed (${completedTodos.length}/${todoItems.length})</div>`

        completedTodos.forEach(todo => {
            completedTodosDiv.append(createTodoElement(todo))
        })
    }
}

// Save and render
function saveAndRender() {
    save()
    render()
}

function createTodoElement(todo) {

// To-Do list
    const todoDiv = document.createElement("DIV");
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = "todo-item";

    const todoTextDiv = document.createElement("SPAN");
    todoTextDiv.innerHTML = todo.text;

// Checkbox
    const todoInputCheckbox = document.createElement("INPUT");
    todoInputCheckbox.type = "checkbox";
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
}

// Remove to-do button
    const todoRemoveBtn = document.createElement("A");
    todoRemoveBtn.href = "#";
    todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`;
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        removeTodo(id)
};

    todoTextDiv.prepend(todoInputCheckbox);
    todoDiv.appendChild(todoTextDiv);
    todoDiv.appendChild(todoRemoveBtn);

    return todoDiv
}
