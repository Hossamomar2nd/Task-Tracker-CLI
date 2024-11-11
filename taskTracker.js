import { fileURLToPath } from 'url';
import fs from "fs-extra";
import path from "path";
//dirname give me the absolute path to the directory of the current javascript file "E:\Projects\Task Tracker\taskTracker.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TASK_FILE = path.join(__dirname, "tasks.json");

function loadTasks() {
  if (!fs.existsSync(TASK_FILE)) {
    fs.writeFileSync(TASK_FILE, JSON.stringify({ tasks: [] }, null, 2));
  }
  const data = fs.readFileSync(TASK_FILE, "utf-8");
  return JSON.parse(data).tasks;
}

function saveTasks(tasks) {
  fs.writeFileSync(TASK_FILE, JSON.stringify({ tasks }, null, 2));
}

function addTask(description) {
  const tasks = loadTasks();

  const newTask = {
    id: tasks.length + 1,
    description,
    status: "todo",
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`task with ID:${newTask.id} save successfully`);
}

function updateTask(id, newDescription) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.description = newDescription;
    saveTasks(tasks);
    console.log(`task with ID:${id} updated successfully`);
  } else {
    console.log(`task with ID:${id} not found`);
  }
}

function deleteTask(id) {
  let tasks = loadTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  if (tasks.length < initialLength) {
    saveTasks(tasks);
    console.log(`task with ID:${id} deleted successfully`);
  } else {
    console.log(`task with ID:${id} not found`);
  }
}

function markTask(id, newstatus) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = newstatus;
    saveTasks(tasks);
    console.log(`task with ID:${id} marked successfully`);
  } else {
    console.log(`task with ID:${id} not found`);
  }
}

function listTasks(filter) {
  const tasks = loadTasks();
  const filteredTasks = filter
    ? tasks.filter((task) => task.status === filter)
    : tasks;
  if (filteredTasks.length > 0) {
    filteredTasks.forEach((task) => {
      console.log(`[${task.status}] ID: ${task.id} - ${task.description}`);
    });
  } else {
    console.log("no tasks found");
  }
}

const [, , command, ...args] = process.argv;

switch (command) {
  case "add":
    addTask(args.join(" "));
    break;
  case "update":
    updateTask(parseInt(args[0]), args.slice(1).join(" "));
    break;
  case "delete":
    deleteTask(parseInt(args[0]));
    break;
  case "mark-in-progress":
    markTask(parseInt(args[0]), "in-progress");
    break;
  case "mark-done":
    markTask(parseInt(args[0]), "done");
    break;
  case "list":
    listTasks(args[0]);
    break;
  default:
    console.log("not define order");
    break;
}
