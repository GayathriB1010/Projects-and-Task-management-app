const express = require("express");
const app = express();
const port = 8000;
var cors = require("cors");

app.use(cors());
app.use(express.json());
const { getAllProjects, addProject,getRecentProjects,deleteProject} = require("./projectHandler");

const {
  getAllInProgressTasks,
  getAllDoneTasks,
  addTask,
  getAllTodoTasks,
  updateTask,
  deleteTask,
  updateStatus
} = require("./taskHandler");

const {
  getUserRole,
  getUsers,
  getUser,
  getUserNames,
  getprojectUsers,
  createUser
} = require("./userHandler");

app.get("/api/all-projects/:user", getAllProjects);
app.get("/api/project/:projectId/todo", getAllTodoTasks);
app.get("/api/project/:projectId/inProgress", getAllInProgressTasks);
app.get("/api/project/:projectId/done", getAllDoneTasks);
app.post("/api/project/:projectId/add-task", addTask);
app.post("/api/project/add-project", addProject);
app.get("/api/get-adminUsers", getUserRole);
app.get("/api/user/", getUser); //e.g. ?email=tom_smith@gmail.com&password=verystrongpassword
app.get("/api/get-users/", getUsers);
app.get("/api/getNames/:email", getUserNames);
app.patch("/api/update-task", updateTask);
app.get("/api/getProjectUsers/:projectId", getprojectUsers);
app.get("/api/get-recentProjects/:user",getRecentProjects)
app.delete("/api/delete-task/:taskId",deleteTask);
app.patch("/api/updateStatus/:taskId",updateStatus)
app.post("/api/create-user",createUser);
app.delete("/api/delete-project/:projectId",deleteProject);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
