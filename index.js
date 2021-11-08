const taskContainer = document.querySelector(".task_container");

const openTaskBody = document.querySelector(".open_task_body");

let globalTaskData = [];

const generateHTMLcode = (TaskData) => `<div id=${TaskData.id} class="col-lg-4 col-md-6 col-sm-12 my-4">
    <div class="card">
        <div class="card-header d-flex justify-content-end gap-2">
            <button class="btn btn-outline-info" name=${TaskData.id} onclick="editCard.apply(this, arguments)">
              <i class="far fa-pencil" name=${TaskData.id}></i>
          </button>
            <button class="btn btn-outline-danger" name=${TaskData.id} onclick="deleteCard.apply(this, arguments)">
            <i class="far fa-trash-alt" name=${TaskData.id}></i>
        </button>
        </div>
        <div class="card-body">
           <img src=${TaskData.image} alt="image" class="card-img">
            <h5 class="card-title mt-4">${TaskData.title}</h5>
            <p class="card-text">${TaskData.description}</p>
            <span class="badge bg-primary">${TaskData.type}</span>
        </div>
        <div class="card-footer">
            <button class="btn btn-outline-primary" name=${TaskData.id} data-bs-toggle="modal" data-bs-target="#OpenTask" onclick="openTask.apply(this, arguments)">
                  Open task
            </button>
        </div>
    </div>
</div>`;

const addNewCard = () => {

    //fetch task data
    const TaskData = {
        id: `${Date.now()}`,
        title: document.getElementById("title").value,
        image: document.getElementById("imageurl").value,
        type: document.getElementById("type").value,
        description: document.getElementById("taskDesc").value,
    };

    globalTaskData.push(TaskData);

    localStorage.setItem("task", JSON.stringify({ cards: globalTaskData }));

    //generate html code
    const newCard = generateHTMLcode(TaskData);

    //inject to the DOM
    taskContainer.insertAdjacentHTML("beforeend", newCard);

    //clear the form
    document.getElementById("title").value = "";
    document.getElementById("imageurl").value = "";
    document.getElementById("type").value = "";
    document.getElementById("taskDesc").value = "";

    return;
};


const loadExistingCards = () => {

    const getData = localStorage.getItem("task");

    if (!getData)
        return;
    const taskCards = JSON.parse(getData);

    globalTaskData = taskCards.cards;

    globalTaskData.map((task) => {
        const newCard = generateHTMLcode(task);


        taskContainer.insertAdjacentHTML("beforeend", newCard);
    });
    return;
};

const deleteCard = (e) => {
    const targetID = e.target.getAttribute("name");
    const elementType = e.target.tagName;

    const removeTask = globalTaskData.filter((task) => task.id !== targetID);
    globalTaskData = removeTask;

    localStorage.setItem("task", JSON.stringify({ cards: globalTaskData }));

    if (elementType === "BUTTON") {
        return taskContainer.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    } else {
        return taskContainer.removeChild(
            e.target.parentNode.parentNode.parentNode.parentNode
        );
    }
};

const editCard = (e) => {
    const targetID = e.target.getAttribute("name");
    const elementType = e.target.tagName;

    let taskType;
    let taskTitle;
    let taskDesc;
    let cardElement;
    let submitButton;

    if (elementType === "BUTTON") {
        cardElement = e.target.parentNode.parentNode;
    } else {
        cardElement = e.target.parentNode.parentNode.parentNode;
    }

    taskTitle = cardElement.childNodes[3].childNodes[3];
    taskType = cardElement.childNodes[3].childNodes[5];
    taskDesc = cardElement.childNodes[3].childNodes[7];

    submitButton = cardElement.childNodes[5].childNodes[1];

    taskTitle.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    taskDesc.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEdits.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
};

const saveEdits = (e) => {
    const targetID = e.target.getAttribute("name");
    const elementType = e.target.tagName;

    let cardElement;

    if (elementType === "BUTTON") {
        cardElement = e.target.parentNode.parentNode;
    } else {
        cardElement = e.target.parentNode.parentNode.parentNode;
    }

    const taskTitle = cardElement.childNodes[3].childNodes[3];
    const taskType = cardElement.childNodes[3].childNodes[5];
    const taskDesc = cardElement.childNodes[3].childNodes[7];

    const submitButton = cardElement.childNodes[5].childNodes[1];

    const updateData = {
        title: taskTitle.innerHTML,
        type: taskType.innerHTML,
        description: taskDesc.innerHTML,
    }

    const globaltaskData = globalTaskData.map((task) => {
        if (task.id === targetID) {
            return {...task, ...updateData }
        }
        return task;
    });

    globalTaskData = globaltaskData;

    localStorage.setItem("task", JSON.stringify({ cards: globalTaskData }));

    taskTitle.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    taskDesc.setAttribute("contenteditable", "false");
    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#OpenTask");
    submitButton.innerHTML = "Open Task";
};

const openTaskModal = (TaskData) => {
    const date = new Date(parseInt(TaskData.id));
    return ` <div id=${TaskData.id}>
    <img src=${TaskData.image} alt="card image" class="card-img mb-3"/>
    <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
    <h2 class="my-3">${TaskData.title}</h2>
    <p class="lead">${TaskData.description}</p>
    </div>`;
};

const openTask = (e) => {
    const cardId = e.target.getAttribute("name");

    const taskData = globalTaskData.filter((TaskData) => TaskData.id === cardId);

    openTaskBody.innerHTML = openTaskModal(taskData[0]);
};