document.addEventListener('DOMContentLoaded', function(){
    
    load_task();
    document.querySelector('#create1').addEventListener('click', function () {
        create_inp();
    })
});


//To load every task in list form
function load_task(){
    document.getElementById('Add_to-do').style.display='none';
    document.getElementById('edit_to-do').style.display = 'none';
    document.getElementById('task-detail').style.display = 'none';

    //parse converts JSON from string to array obj
    var info = localStorage.getItem("todo");
    var parsedobj =[];
    if (info !== null) {
        parsedobj = JSON.parse(info);
    }

    
    document.querySelector(".delete-all").addEventListener('click', () => {
        if (confirm("All Task will be deleted, Are you sure?")){
            delete_all();
        }
        
    });

    for(let i=0;i<parsedobj.length;i++){
        if(parsedobj[i]!==null){
            
            const task = document.createElement('div');
            task.className = 'tasks';
            task.innerHTML = `<span class='list_name'>${parsedobj[i].Task}</span>
                            <span class='list_type'>${parsedobj[i].type}</span>
                            <span class='list_time'>${parsedobj[i].CreatedAt}</span>`;
            if (!parsedobj[i].completed) {  
                document.querySelector('.not_comp').appendChild(task);
            }   
            else{
                task.innerHTML +='&#10004' ;
                document.querySelector('.comp').appendChild(task);  
            }
            task.addEventListener('click', () => task_details(i));
        }
    }
}

//create task
function create_inp(){
    document.getElementById('Add_to-do').style.display = 'block';
    document.getElementById('task-detail').style.display = 'none';
    document.getElementById('edit_to-do').style.display = 'none';
    

    //so no empty task gets added
    document.querySelector('#task-submit').disabled = true;
    document.querySelector('#add-task-name').onkeyup = () => {
        if (document.querySelector('#add-task-name').value.length > 0) {
            document.querySelector('#task-submit').disabled = false;
        }
        else {
            document.querySelector('#task-submit').disabled = true;
        }
    }

    let to_do_arr = [];
    let task_dic = {
        "Task": '',
        "CreatedAt": '',
        "Details": "",
        "type": "",
        "completed": false,
        "Deadline": '',
        'Date': "",
        'Day': ""
    };
    
    const currtime = new Date();
    var time = currtime.toLocaleString('en-US', { hour: 'numeric', minute: "numeric", hour12: false })
    var date = new Date();
    let todo = localStorage.getItem("todo");
    if (todo !== null) {
        to_do_arr = JSON.parse(todo);
    }
    document.querySelector('#task-submit').addEventListener('click', function () {
        const task = document.querySelectorAll(".add-task");
        const detail = document.querySelector('#add_details');
        task_dic = {"Task": task[0].value,
                    "CreatedAt": time,
                    "Date": date.toISOString().split('T')[0],
                    "Day": week_day(currtime.getDay()),
                    "completed": false, 
                    "Deadline": task[1].value,
                    "Details": detail.value,
                    "type": task[2].value
                    }
        to_do_arr.push(task_dic);
        localStorage.setItem("todo", JSON.stringify(to_do_arr));
        task_details(to_do_arr.length-1)
        location.reload();  
        return false;
    })
    
}



function task_details(i){
    document.getElementById('Add_to-do').style.display = 'none';
    document.getElementById('task-detail').style.display = 'block';
    document.getElementById('edit_to-do').style.display = 'none';

    document.querySelector('.button-set').style.display = 'flex';
    
    var info = localStorage.getItem("todo");
    var parsedobj = [];
    if (info == null) {
        parsedobj = [];
    }
    else {
        parsedobj = JSON.parse(info);
    }
    var deadline = `${parsedobj[i].Deadline.split('T')[0]} ${parsedobj[i].Deadline.split('T')[1]}`;
    if (parsedobj[i].Deadline==""){
        deadline="None"
    }
    const task = document.querySelector(".task")
    task.innerHTML = `<p class='task_name'><b>${parsedobj[i].Task}</b></p>
                    <p class='task_deadline'><span class="task_dets">Deadline: </span>${deadline}</p>
                    <p class='task_type'><span class="task_dets">Type: </span>${parsedobj[i].type}</p>
                    <p class='task_details'>${(parsedobj[i].Details !== undefined) ? parsedobj[i].Details : ""}</p>
                    <p class='task_time'>${parsedobj[i].CreatedAt}</p>
                    <p class='task_time'>${parsedobj[i].Date}</p>
                    <p class='task_time'>${parsedobj[i].Day}</p>`;
    document.querySelector('#task-detail').appendChild(task);
    
    const btton = document.querySelector('.Done');
    btton.textContent = !(parsedobj[i].completed) ? "Mark as Done" : "Restore Task";
    
    
   
    document.querySelector(".Done").addEventListener('click', () => {
        task_completed(i);
    });
    document.querySelector("#bttn_edit").addEventListener('click', () => {
        edit_task(i);
    });
    document.querySelector("#bttn_delete").addEventListener('click', () => {
        delete_task(i);
    });
}


function week_day(n){
    var day = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return day[n];
}

function edit_task(i){
    document.getElementById('Add_to-do').style.display = 'none';
    document.getElementById('task-detail').style.display = 'none';
    document.getElementById('edit_to-do').style.display = 'block';

    var task=JSON.parse(localStorage.todo)
    const edit_task = document.querySelectorAll('.edit_task');
    edit_task[0].value = task[i].Task;
    edit_task[3].value = task[i].type;
    edit_task[1].value = task[i].Details;
    edit_task[2].value = task[i].Deadline;
    
    document.querySelector("#edit-submit").addEventListener('click', () => {
        task[i].Task = edit_task[0].value;
        task[i].type = edit_task[3].value;
        task[i].Details = edit_task[1].value;
        task[i].Deadline = edit_task[2].value;
        localStorage.setItem("todo",JSON.stringify(task));
        task_details(i);
    });
    
}

function delete_task(i){
    var task = JSON.parse(localStorage.todo)
    delete task[i];
    localStorage.setItem("todo", JSON.stringify(task));
    location.reload();
    load_task();
}

function task_completed(i) {
    var info = localStorage.getItem("todo");
    const clsname = document.querySelector(".Done");
    var parsedobj = [];
    if (info !== null) {
        parsedobj = JSON.parse(info);
    }
    if(!parsedobj[i].completed){
        parsedobj[i].completed = true;
        clsname.textContent =  "Restore Task"
        document.querySelector("#bttn_edit").style.display="none";
    }
    else{
        parsedobj[i].completed = false;
        clsname.textContent = "Mark as Done" ;
        document.querySelector("#bttn_edit").style.display = "block";
    }
    localStorage.setItem('todo', JSON.stringify(parsedobj));
    location.reload();
    load_task();
}

function delete_all(){
    var info = localStorage.getItem("todo");
    if (info!=='[]') {
        let parse=[];
        localStorage.setItem('todo', JSON.stringify(parse));
        location.reload();
    }
    else{
         return alert("There's nothing to delete");
    }  
}
