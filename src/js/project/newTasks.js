import {getProjectUrl, cleanTasksHTML} from "./functions.js";
// import { tasks } from "./projectTasks.js";
import {tasks, setTasks} from "./globalVariables.js";
// show tasks
import {showTasks} from "./projectTasks.js"


// show alert on IU
const showAlert = (message, type, reference) => {
  // prevent more > 1 alert
  const existAlert = document.querySelector(".alert");

  if (existAlert) {
    existAlert.remove();
  }

  //create element
  const newAlert = document.createElement("DIV");
  newAlert.classList.add("alert", type);

  // add text
  if (type === "error") {
    newAlert.innerHTML = `${message} <i class="fa-solid fa-triangle-exclamation"></i>
      `;
  } else {
    newAlert.textContent = message;
  }

  // insert alert in document
  reference.parentElement.insertBefore(newAlert, reference.nextElementSibling);

  // delete alert
  setTimeout(() => {
    newAlert.remove();
  }, 5000);
};

// consult Server and add new task to project
const addNewTask = async function (task) {
  const documentReference = document.querySelector(".form-task legend");
  const data = new FormData();

  data.append("name", task);
  data.append("project_id", getProjectUrl());

  try {
    const url = "http://localhost:3000/api/task";

    const answer = await fetch(url, {
      method: "POST",
      body: data,
    });

    const result = await answer.json();

    // show alert
    showAlert(result.message, result.type, documentReference);

    // close modal
    if (result.type === "succes") {
      const modal = document.querySelector(".modal");
      const formTask = document.querySelector(".form-task");

      setTimeout(() => {
        formTask.classList.add("close");
        setTimeout(() => {
          modal.remove();
        }, 500);
      }, 2000);

      // create new task object in browser
      const taskObj = {
        id: String(result.id),
        name: task,
        state: "0",
        project_id: result.project_id,
      };

      // saving the task object in
      // tasks = [...tasks, taskObj];
      setTasks([...tasks, taskObj]);
      cleanTasksHTML();
      showTasks();

      console.log(taskObj);
      console.log("desde newTask ", tasks);
    }
  } catch (error) {
    console.log(error);
  }
};

// submit task form
const submitNewTaskForm = () => {
  const newTask = document.querySelector("#taskName").value.trim();
  const documentReference = document.querySelector(".form-task legend");

  // validation
  if (!newTask) {
    // show alert
    showAlert("You need to set a Task Name", "error", documentReference);
    return;
  }
  if (newTask.length > 60) {
    showAlert(
      "The task name cannot be greater that 60 characters",
      "error",
      documentReference
    );
    return;
  }

  addNewTask(newTask);
};

// Show the modal && functions
export const showTaskForm = () => {
  const modal = document.createElement("DIV");
  modal.classList.add("modal");

  // add inner html -> so use  delegation
  modal.innerHTML = `
    <form class="form-task container-md">
      <legend>Add new task</legend>

      <div class="field">
        <label for="taskName">Task Name</label>
        <input type="text" id="taskName" name="taskName" value="" />
      </div>

      <div class="field form-task__buttons">
        <input type="submit" class="button-new-task" value="Add task" />
        <button type="button" class="close-modal">
          Cancel
        </button>
      </div>
    </form>
    `;

  // add animation to form when appear
  setTimeout(() => {
    const formTask = document.querySelector(".form-task");
    formTask.classList.add("animation");
  }, 100);

  // close modal
  modal.addEventListener("click", function (event) {
    event.preventDefault();

    // remove model && transition || Delegation
    if (event.target.classList.contains("close-modal")) {
      const formTask = document.querySelector(".form-task");
      formTask.classList.add("close");

      setTimeout(() => {
        modal.remove();
      }, 500);
    }

    //  add new task button
    if (event.target.classList.contains("button-new-task")) {
      submitNewTaskForm();
    }
  });

  // add modal to body
  document.querySelector(".dashboard").appendChild(modal);
};
