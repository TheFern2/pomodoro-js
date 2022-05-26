const startBtn = document.getElementById("startBtn");
const saveBtn = document.getElementById("modal-content");
const timeOutput = document.getElementById("timeOutput");
const timeBtns = document.getElementsByClassName("timer-top");
const taskParent = document.getElementById("tasks");
const body = document.body;
let storedTasks = [];
let currIndex = 0;

// initialization
const pomodoro_tm = "25:00";
const short_break_tm = "5:00";
const long_break_tm = "15:00";

const init = () => {
  timeOutput.innerHTML = pomodoro_tm;

  tmp_tasks = JSON.parse(localStorage.getItem("ls_tasks"));
  if (tmp_tasks) {
    tmp_tasks.forEach((element) => {
      if (!storedTasks.includes(element)) {
        storedTasks.push(element);
      }
    });
    //storedTasks = tmp_tasks;

    storedTasks.forEach((element) => addTask(element.name, element.est, false));
  }

  //   addTask("My task", 3);
  //   addTask("My task 2", 2);
};

const addTask = (taskname, est, storage) => {
  const taskHtml = `<div class="left">
    <h1 class="title">
      <a href="#">
        <i class="fa fa-check-circle" aria-hidden="true"></i>
        ${taskname}
      </a>
    </h1>
  </div>
  <div class="right">
    <div class="task-tracking">0/${est}</div>
    <button class="task-btn">
      <i class="fa fa-cog" aria-hidden="true"></i>
    </button>
  </div>`;

  const newDiv = document.createElement("div");
  newDiv.innerHTML = taskHtml;
  newDiv.className = "task";
  taskParent.appendChild(newDiv);
  if (storage) {
    storedTasks.push({ index: currIndex, name: taskname, est: est });
    currIndex++;
    localStorage.setItem("ls_tasks", JSON.stringify(storedTasks));
  }
};

const removeLeftBorder = () => {
  const matches = document.querySelectorAll(".task-selected");
  if (matches.length > 0) {
    matches[0].classList.remove("task-selected"); // should be only 1 match
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
  console.log(`Task ${taskText.value} ${est.value}`);
  if (taskText.value.trim() === "" || est.value.trim() === "") {
    console.log("error");
  } else {
    addTask(taskText.value, est.value, true);
  }
});

taskParent.addEventListener("click", (e) => {
  const currClasslist = e.target.classList.value;

  if (!currClasslist.includes("task-selected")) {
    removeLeftBorder();
    e.target.classList.add("task-selected");
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
