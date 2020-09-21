let todoSection = document.querySelector('#todoList')
let saveTodo = document.querySelector('#saveTodo')
let todoInput = document.querySelector('#todoInput')
let createTodoBtn = document.querySelector('#createTodoBtn')
let newTodoModal = document.querySelector('#newTodoModal')
let dateInput = document.querySelector('#datePicker')
let timeInput = document.querySelector('#timePicker')
let editTodoInput = document.querySelector('#editTodoInput')
let editDatePicker = document.querySelector('#editDatePicker')
let saveChanges = document.querySelector('#saveChanges')
let createTodoError = document.querySelector('.createTodoError')
let editTodoError = document.querySelector('.editTodoError')
let closeTodoModal = document.querySelector('#closeTodoModal')

let getDate=(value)=>{
    let myDate = new Date(value);
    const month = myDate.toLocaleString('default', { month: 'long' });
    const date = myDate.toLocaleString('default', {day: 'numeric'})
    const day = myDate.toLocaleString('default', {weekday: 'long'})

    return `${day}, ${date} ${month}`
}

let createTodoItem =()=>{

    let todoItem = document.createElement('div')
        todoItem.classList = "row todoItem";
    
    let firstSection = document.createElement('div')
        firstSection.classList = 'firstSection col-1 col'

    let checkBox = document.createElement('input')
        checkBox.setAttribute('type', 'checkbox')
        checkBox.classList = 'checkBox'
    
    firstSection.appendChild(checkBox)
    
    let secondSection = document.createElement('div')
        secondSection.classList = 'row secondSection col-11 col'

    let content = document.createElement('div')
        content.classList = 'col-10 contentDiv'
    
    let timeDiv = document.createElement('small')
        timeDiv.className = 'time'
        timeDiv.innerText = getDate(dateInput.value)
        
    
    let todoDataDiv = document.createElement('div')
        todoDataDiv.classList = 'todoData pending'
    
    let todoDataSpan = document.createElement('span')
        todoDataSpan.classList = 'todoSpan'
        todoDataSpan.innerText = `${todoInput.value}`
    

    todoDataDiv.appendChild(todoDataSpan)
    
    content.appendChild(timeDiv)
    content.appendChild(todoDataDiv)

    let rowWrapper = document.createElement('div')
        rowWrapper.className = 'row btnRow'
    
    let btnSection = document.createElement('div')
        btnSection.classList = 'col-2 btnDiv'
    
    let editBtn = document.createElement('button')
        editBtn.classList = 'editBtn btn btn-primary'        
        editBtn.innerText = 'Edit'

    let deleteBtn = document.createElement('button')
        deleteBtn.classList = 'deleteBtn btn btn-danger'
        deleteBtn.innerText = 'Delete'

    let completedBtn = document.createElement('button')
        completedBtn.classList = 'completedBtn btn btn-secondary'
        completedBtn.innerText = 'Pending'

    rowWrapper.appendChild(editBtn)
    rowWrapper.appendChild(deleteBtn)
    rowWrapper.appendChild(completedBtn)
    btnSection.appendChild(rowWrapper)

    secondSection.appendChild(content)
    secondSection.appendChild(btnSection)

    todoItem.appendChild(firstSection)
    todoItem.appendChild(secondSection)

    todoSection.appendChild(todoItem)

    deleteBtn.addEventListener('click', ()=>{
        todoSection.removeChild(todoItem)
        getPendingTotal()
    })

    let completedCheck=()=>{
        completedBtn.classList.toggle('btn-secondary');
            content.classList.toggle('text-muted')
            if(completedBtn.textContent === 'Pending'){
                completedBtn.innerText = 'Done'
                checkBox.checked = true;
                completedBtn.classList = 'btn-success'
                todoDataDiv.classList.remove('pending')
                todoDataDiv.classList.add('completed');
                
                setTimeout(() => {
                    getPendingTotal()
                }, 500);
            }
            else{
                completedBtn.innerText = 'Pending'
                checkBox.checked = false;
                todoDataDiv.classList.add('pending')
                todoDataDiv.classList.remove('completed');
                completedBtn.classList = 'btn-secondary'

                setTimeout(() => {
                    getPendingTotal()
                }, 500);
            }
    }
   
    completedBtn.addEventListener('click', ()=>{
        completedCheck();
    })

    checkBox.addEventListener('click', ()=>{
        completedCheck()
    })

    let todoContent = editBtn.parentElement.parentElement.parentElement.firstChild.lastChild.firstChild;
    let todoValue = todoContent.innerText;

    editBtn.addEventListener('click', ()=>{
        
           todoContent.setAttribute('contentEditable', 'true' )
           todoContent.classList.toggle('editable')
           todoContent.focus()           

            saveChanges.addEventListener('click', ()=>{
                // editTodoError.innerText = "";
                // if(editTodoInput.value === ''){
                //     // editTodoError.innerText = 'Kindly provide a valid input or close modal to retain todo'
                // }
                // else{
        
                // console.log(editTodoInput.value)
    
                    // todoContent.innerText = editTodoInput.value;
        
                    // editTodoInput.value = '';
                // }
        
                // if(editDatePicker.value === ''){
                //     // do nothing
                // }
                // else{
                //     timeDiv.innerText = getDate(editDatePicker.value)
                // }
            })
    })
    todoContent.addEventListener('blur', ()=>{
        if(todoContent.innerText === ''){
            let editTodoError = document.createElement('small')
            editTodoError.classList = 'editError'
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
}



saveTodo.addEventListener('click', ()=>{
    if(todoInput.value === ''){
        createTodoError.innerText = 'Please enter a todo item or close modal to exit'
    }
    else if(dateInput.value === ''){
        createTodoError.innerText = 'Please enter a valid date or close modal to exit'
    }
    else{
        createTodoError.innerText = ''
        createTodoItem();
        getPendingTotal();
        todoInput.value = '';
        todoInput.focus();
    }
})
closeTodoModal.addEventListener('click', ()=>{
    // todoItemIndex();
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

let todoItemIndex = () =>{
    // let allBtns = [...document.querySelectorAll('.editBtn')]
    // let todoDataContent = [...document.querySelectorAll('.todoData')]

    
    // allBtns.map((element, index)=>{
        let todoContent = element.parentElement.parentElement.parentElement.firstChild.lastChild;

        element.addEventListener('click', ()=>{
            $('#editTodoModal').modal('toggle')
            setTimeout(() => {
                editTodoInput.innerText = ''; 
                editTodoInput.innerText = todoContent.innerText;
                editTodoInput.focus();

                saveChanges.addEventListener('click', ()=>{
                    // editTodoError.innerText = "";
                    // if(editTodoInput.value === ''){
                    //     // editTodoError.innerText = 'Kindly provide a valid input or close modal to retain todo'
                    // }
                    // else{
            
                    console.log(editTodoInput.value)
        
                        // todoContent.innerText = editTodoInput.value;
            
                        // editTodoInput.value = '';
                    // }
            
                    // if(editDatePicker.value === ''){
                    //     // do nothing
                    // }
                    // else{
                    //     timeDiv.innerText = getDate(editDatePicker.value)
                    // }
                })
            }, 100); 

        //    console.log(todoContent.textContent)
        })
        
    
    
    // for(let x=0; x < todoDataContent.length; x++){
    //     let todoContent = allBtns[x].parentElement.parentElement.parentElement.firstChild.lastChild;

    //     allBtns[x].addEventListener('click', ()=>{
    //             console.log(todoContent)

    //             $('#editTodoModal').modal('toggle')
    //     // setTimeout(() => {
    //     //     editTodoInput.innerText = ''; 
    //     //     editTodoInput.innerText = todoContent.innerText;
    //     //     editTodoInput.focus();
    //     // }, 700); 

    //             saveChanges.addEventListener('click', ()=>{
    //                 // editTodoError.innerText = "";
    //                 // if(editTodoInput.value === ''){
    //                 //     // editTodoError.innerText = 'Kindly provide a valid input or close modal to retain todo'
    //                 // }
    //                 // else{
            

    //                     // todoContent.textContent = editTodoInput.value;
            
    //                     // editTodoInput.value = '';
    //                 // }
            
    //                 // if(editDatePicker.value === ''){
    //                 //     // do nothing
    //                 // }
    //                 // else{
    //                 //     timeDiv.innerText = getDate(editDatePicker.value)
    //                 // }
    //             })
            
    //     })
    // }
}


let allBtns = document.querySelectorAll('.editBtn')