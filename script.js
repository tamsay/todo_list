let todoSection = document.querySelector('#todoList')
let saveTodo = document.querySelector('#saveTodo')
let todoInput = document.querySelector('#todoInput')
let createTodoBtn = document.querySelector('#createTodoBtn')
let newTodoModal = document.querySelector('#newTodoModal')
let timeInput = document.querySelector('#timePicker')
let editTodoInput = document.querySelector('#editTodoInput')
let editDatePicker = document.querySelector('#editDatePicker')
let saveChanges = document.querySelector('#saveChanges')
let createTodoError = document.querySelector('.createTodoError')
let editTodoError = document.querySelector('.editTodoError')
let closeTodoModal = document.querySelector('#closeTodoModal')
let clearDatebase = document.querySelector('#clearDatabase')
let body = document.querySelector('body');
let todos = [];


let getDate=(value)=>{
    let myDate = new Date(value);
    const month = myDate.toLocaleString('default', { month: 'long' });
    const date = myDate.toLocaleString('default', {day: 'numeric'})
    const day = myDate.toLocaleString('default', {weekday: 'long'})

    return `${day}, ${date} ${month}`
}

let createTodoItem =(value, status, date)=>{

    let todoItem = document.createElement('div')
        todoItem.classList = "row todoItem";
    
    let firstSection = document.createElement('div')
        firstSection.classList = 'firstSection col-1 col'

    let checkBox = document.createElement('input')
        checkBox.setAttribute('type', 'checkbox')
        checkBox.checked = status;
        checkBox.classList = 'checkBox'
    
    firstSection.appendChild(checkBox)
    
    let secondSection = document.createElement('div')
        secondSection.classList = 'secondSection col-11 col'

    let content = document.createElement('div')
        content.classList = 'contentDiv row'
    
    let timeDiv = document.createElement('small')
        timeDiv.className = 'time'
        timeDiv.innerText = getDate(date)
    
    // let todoDataWrapper = document.createElement('div')
    //     todoDataWrapper.classList = 'todoDataWrapper row'
    
    let todoDataDiv = document.createElement('div')
        todoDataDiv.classList = 'todoData pending row col-12'
    
    let todoDataSpan = document.createElement('span')
        todoDataSpan.classList = 'todoSpan col-11'
        todoDataSpan.innerText = `${value}`
    
    
    let btnSection = document.createElement('div')
        btnSection.classList = 'btnDiv col-1 col'

    let rowWrapper = document.createElement('div')
        rowWrapper.className = 'btnRow row'
    
    let editBtn = document.createElement('i')
        editBtn.classList = 'editBtn btn fa fa-edit'        

    let deleteBtn = document.createElement('i')
        deleteBtn.classList = 'deleteBtn btn fa fa-trash'

    let completedBtn = document.createElement('i')
        completedBtn.classList = 'completedBtn btn fa fa-tasks'

        

    rowWrapper.appendChild(editBtn)
    rowWrapper.appendChild(deleteBtn)
    rowWrapper.appendChild(completedBtn)
    btnSection.appendChild(rowWrapper)

    todoDataDiv.appendChild(todoDataSpan)
    todoDataDiv.appendChild(btnSection)
    // todoDataWrapper.appendChild(todoDataDiv)
    // todoDataWrapper.appendChild(btnSection)

    content.appendChild(timeDiv)
    content.appendChild(todoDataDiv)

    secondSection.appendChild(content)
    // secondSection.appendChild(btnSection)

    todoItem.appendChild(firstSection)
    todoItem.appendChild(secondSection)

    todoSection.appendChild(todoItem)

    deleteBtn.addEventListener('click', ()=>{
        todoSection.removeChild(todoItem)
        getPendingTotal()
    })

    let completedCheck=()=>{
            content.classList.toggle('text-muted')

            if(completedBtn.classList.value === 'completedBtn btn fa fa-tasks'){
                
                checkBox.checked = true;
                completedBtn.classList.add(`fa-check-double`);
                completedBtn.classList.remove(`fa-tasks`)

                todoDataDiv.classList.remove('pending')
                todoDataDiv.classList.add('completed');
                
                setTimeout(() => {
                    getPendingTotal()
                }, 500);
            }
            else{
                completedBtn.classList.add(`fa-tasks`)
                completedBtn.classList.remove(`fa-check-double`)
                checkBox.checked = false;
                todoDataDiv.classList.add('pending')
                todoDataDiv.classList.remove('completed');

                setTimeout(() => {
                    getPendingTotal()
                }, 500);
            }
            saveToDatabase();
    }
    if(status === true){
        completedCheck()
    }
   
    completedBtn.addEventListener('click', ()=>{
        completedCheck();
    })

    checkBox.addEventListener('click', ()=>{
        completedCheck()
    })

    let todoContent = editBtn.parentElement.parentElement.parentElement.firstChild;
    let todoValue = todoContent.innerText;
    
    editBtn.addEventListener('click', ()=>{
        
           todoContent.setAttribute('contentEditable', 'true' )
           todoContent.classList.toggle('editable')
           todoContent.focus()           
    })

    todoContent.addEventListener('blur', ()=>{

        if((todoContent.innerText === '') || (todoContent.innerHTML === '<br>')){
            let editTodoError = document.createElement('small')
            editTodoError.classList = 'editError';
            editTodoError.innerText = 'Value cannot be empty. Reversing changes'

            content.appendChild(editTodoError)
            setTimeout(() => {
                todoContent.innerText = todoValue;
                content.removeChild(editTodoError)
            }, 2000);
        }
        else{
            todoContent.setAttribute('contentEditable', 'false' )
            todoContent.classList.toggle('editable')
        }
   })

   const todo = todoItem;
   todos.push(todo);

   saveToDatabase();

}



saveTodo.addEventListener('click', ()=>{
    if(todoInput.value === ''){
        createTodoError.innerText = 'Please enter a todo item or close modal to exit'
    }
    else{
        let value = todoInput.value;
        let status = false;
        let date = new Date();

        createTodoError.innerText = ''
        createTodoItem(value, status, date);
        getPendingTotal();
        todoInput.value = '';
        todoInput.focus();
    }
})

createTodoBtn.addEventListener('click',()=>{
    todoInput.value = ''
    setTimeout(() => {
        todoInput.focus();
    }, 700);
})

let getPendingTotal =()=>{
    let checkBoxes = document.querySelectorAll('.checkBox')
    let pendingTasksLeft = document.querySelector('.pendingTasksLeft')
    let completedTasks = document.querySelector('.completedTasks')
    let totalTasks = document.querySelector('.totalTasks')

    let completed = 0;

    let list = [...checkBoxes];
        list.map(items=>{     
            if(items.checked){
                completed += 1;
            }
        })
    
    totalTasks.innerText = list.length
    completedTasks.innerText = completed;
    pendingTasksLeft.innerText = (list.length - completed)
}

let saveToDatabase=()=>{
    let currentTodos = [...document.querySelectorAll('.todoItem')]
    let db = []

    currentTodos.map(items=>{
        let value = items.querySelector('.todoSpan').innerText;
        let date = items.querySelector('.time').innerText;
        let status = items.querySelector('.checkBox').checked;

        let obj = {
            value: value,
            date: date,
            status: status
        }
        db.push(obj)

    })

    window.localStorage.setItem('myDatabase', JSON.stringify(db));
}

clearDatebase.addEventListener('click', ()=>{
    window.localStorage.clear();
    todoSection.innerHTML = ''
})
body.onload=()=>{
    let savedTodos = JSON.parse(window.localStorage.getItem('myDatabase'));

    console.log(savedTodos)

    if(savedTodos === null){
        console.log('nothing in the database')
    }
    else{
        savedTodos.map(item=>{
            createTodoItem(item.value, item.status, item.date)
            console.log(item.status)
        })
    }
}


