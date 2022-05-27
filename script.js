const startBtn = document.getElementById("startBtn");
const saveBtn = document.getElementById("modal-content");
const timeOutput = document.getElementById("timeOutput");
const timeBtns = document.getElementsByClassName("timer-top");
const taskParent = document.getElementById("tasks");
const body = document.body;
let storedTasks = [];
let currTask = undefined;
let store = {
  tasks: [],
  currTask: undefined,
};

// initialization
const pomodoro_tm = "25:00";
const short_break_tm = "5:00";
const long_break_tm = "15:00";

const init = () => {
  timeOutput.innerHTML = pomodoro_tm;

  const tmp_store = JSON.parse(localStorage.getItem("ls_tasks"));
  if (tmp_store) {
    if (tmp_store.tasks) {
      tmp_store.tasks.forEach((element) => {
        if (!storedTasks.includes(element)) {
          storedTasks.push(element);
        }
      });

      storedTasks.forEach((element) =>
        addTask(element.name, element.est, element.act, element.selected, false)
      );
    }

    if (tmp_store.currTask) {
      currTask = tmp_store.currTask;
      const workingTask = document.getElementById("working-task");
      workingTask.innerHTML = currTask.name;
    }
  }
};

const addTask = (taskname, est, act, selected, storage) => {
  const taskHtml = `<div class="left">
    <h1 class="title">
      <a href="#">
        <i class="fa fa-check-circle" aria-hidden="true"></i>
        ${taskname}
      </a>
    </h1>
  </div>
  <div class="right">
    <div class="task-tracking">${act}/${est}</div>
    <button id="deleteBtn" class="task-btn"">
      <i id="deleteBtnIcon" class="fa fa-minus-circle" aria-hidden="true"></i>
    </button>
  </div>`;

  const newDiv = document.createElement("div");
  newDiv.innerHTML = taskHtml;
  newDiv.className = selected ? "task task-selected" : "task";
  // newDiv.setAttribute("onclick", "clickMe(e);");
  const deleteBtn = newDiv.querySelector("#deleteBtn");
  deleteBtn.addEventListener("click", deleteTask);
  newDiv.addEventListener("click", taskClicked);
  taskParent.appendChild(newDiv);
  if (storage) {
    storedTasks.push({
      name: taskname,
      act: act,
      est: est,
      selected: selected,
    });
    store.tasks = storedTasks;
    localStorage.setItem("ls_tasks", JSON.stringify(store));
  }
};

const deleteTask = (e) => {
  e.preventDefault();
  console.log("Delete task clicked");
  console.log(e);

  // show popup
  let text = "Delete task";
  if (confirm(text) == true) {
    // get task div
    const clickedTask = e.target.closest(".task");
    const taskName = clickedTask.querySelectorAll("div h1 a");

    console.log(clickedTask);
    const taskNameStr = taskName[0].innerText.trim();
    console.log(taskNameStr);
    const foundTask = storedTasks.find(getTaskByName(taskNameStr));

    // update text on current task if currently selected
    if (foundTask.selected) {
      const workingTask = document.getElementById("working-task");
      workingTask.innerHTML = "";
    }

    // remove it from parent
    taskParent.removeChild(clickedTask);

    // update storedTasks
    const index = storedTasks.indexOf(foundTask);
    if (index > -1) {
      storedTasks.splice(index, 1);
    }

    // update ls
    store.tasks = storedTasks;
    localStorage.setItem("ls_tasks", JSON.stringify(store));
  }
};

const removeLeftBorder = () => {
  const matches = document.querySelectorAll(".task-selected");
  if (matches.length > 0) {
    matches[0].classList.remove("task-selected"); // should be only 1 match
    const foundTask = storedTasks.find(getTaskBySelected());
    if (foundTask && foundTask.selected) {
      foundTask.selected = false;
      store.tasks = storedTasks;
      localStorage.setItem("ls_tasks", JSON.stringify(store));
    }
  }
};

const updateTime = (text) => {
  if (text === "Pomodoro") {
    timeOutput.innerHTML = pomodoro_tm;
    body.classList.add("pomodoro-color");
    body.classList.remove("short-break-color");
    body.classList.remove("long-break-color");
  } else if (text === "Short Break") {
    timeOutput.innerHTML = short_break_tm;
    body.classList.remove("pomodoro-color");
    body.classList.add("short-break-color");
    body.classList.remove("long-break-color");
  } else {
    timeOutput.innerHTML = long_break_tm;
    body.classList.remove("pomodoro-color");
    body.classList.remove("short-break-color");
    body.classList.add("long-break-color");
  }

  const matches = document.querySelectorAll(".timer-top-btn.selected");
  matches[0].classList.remove("selected"); // should be only 1 match
};

const updateUI = () => {};

const getTaskByName = (htmlTaskName) => {
  return (task) => task.name === htmlTaskName;
};

const getTaskBySelected = () => {
  return (task) => task.selected === true;
};

const taskClicked = (e) => {
  let clickedTask = undefined;

  if (e.target === e.currentTarget) {
    clickedTask = e.target;
  } else {
    // we want to ignore the delete button and the icon clicked events
    // deleteBtn deleteBtnIcon ids
    if (e.target.id === "deleteBtn" || e.target.id === "deleteBtnIcon") {
      return;
    }

    clickedTask = e.target.closest(".task");
  }

  // console.log(clickedTask);
  // console.log(e);
  console.log("Task has been clicked");

  const currClasslist = clickedTask.classList.value;

  if (!currClasslist.includes("task-selected")) {
    removeLeftBorder();
    clickedTask.classList.add("task-selected");
    const taskName = clickedTask.querySelectorAll("div h1 a");
    const taskNameStr = taskName[0].innerText.trim();
    const foundTask = storedTasks.find(getTaskByName(taskNameStr));

    // update storedTask
    if (foundTask && !foundTask.selected) {
      foundTask.selected = true;
      currTask = foundTask;
      const workingTask = document.getElementById("working-task");
      workingTask.innerHTML = currTask.name;
      store.currTask = currTask;
      localStorage.setItem("ls_tasks", JSON.stringify(store));
    }

    // update ls
    store.tasks = storedTasks;
    localStorage.setItem("ls_tasks", JSON.stringify(store));
  }
};

startBtn.addEventListener("click", () => {
  console.log("start button clicked");
});

timeBtns[0].addEventListener("click", (e) => {
  console.log(`${e.target.innerHTML}`);
  updateTime(e.target.innerHTML);
  if (!e.target.classList.contains("selected")) {
    e.target.classList.add("selected");
  }
});

saveBtn.addEventListener("submit", (e) => {
  e.preventDefault();
  //console.log("Save button");
  //console.log(`Task ${taskText.value} ${est.value}`);
  if (taskText.value.trim() === "" || est.value.trim() === "") {
    console.log("error");
  } else {
    addTask(taskText.value, est.value, 0, false, true);
  }
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("add-task");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

init();
