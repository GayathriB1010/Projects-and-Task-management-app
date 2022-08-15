import { useDrag } from "react-dnd";
import React from 'react'
import { useContext, useEffect,useState } from "react"
import { useParams } from "react-router-dom";
import styled from "styled-components"
import LoadingWheel from "./LoadingScreen";
import { ManagefluentContext } from "./ManagefluentContext";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TaskModal from "./TaskModal";
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';


export default function TaskBoards() {
    const {todoTasks,setTodoTasks,selectedProjectId,name,setName,updateTodo,setUpdateTodo,taskClicked,setTaskClicked} = useContext(ManagefluentContext);
    const [isOpen,setIsOpen] = useState(false);
    //To set the task selected and pass it on to the task modal
    const [taskSelected,setTaskSelected] = useState(null);

    const [{isDragging},drag] = useDrag(() =>({
        type:"div",
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))

    useEffect(() =>{
        const getAllTodoTasks = async() =>{
            const response = await fetch(`/api/project/${selectedProjectId}/todo`);
            const data = await response.json();
            setTodoTasks(data.data)
        }
        if(localStorage.getItem("user")){
            getAllTodoTasks();
        }
    },[updateTodo]);

    const newTask = (e) =>{
        setName(e.target.value);
    }

    const addnewTask = (e) =>{
        fetch(`/api/project/${selectedProjectId}/add-task`,{
            method : "POST",
            body : JSON.stringify({
                name : name,
            }),
            headers:{
                "Content-type" :"application/json",
            },
        })
        .then((res) => res.json())
        .then((data) =>{
            setUpdateTodo(!updateTodo);
        })
    }


    const taskClickFn = (todoTask) =>{
        setTaskClicked(!taskClicked)
        setTaskSelected(todoTask)
        setIsOpen(true);
    }


  return (
      <>
    <Todo>
    <Head>To do</Head>
        <NewTask>
        <TaskName onChange={(e) => newTask(e)}></TaskName>
        <AddTask type="button" onClick={(e) => addnewTask(e)}>Add task</AddTask>
        </NewTask>
        {todoTasks!==[] ? todoTasks.map((todoTask) =>{
            return <TodoTask onClick={() => taskClickFn(todoTask)}>{todoTask.name}{todoTask.assignedTo.map((assignee) =>{
                return <Assignees>
                <Assignee>
                {assignee.split("@")[0]}
                </Assignee></Assignees>
            })}
            </TodoTask>
        }):<LoadingWheel></LoadingWheel>}
    </Todo>
    <InProgress>
        <Head>In Progress</Head>
    </InProgress>
    <Done>
        <Head>Done</Head>
    </Done>
    <TaskModal open = {isOpen} onClose ={() => setIsOpen(false)} taskSelected = {taskSelected}>
        </TaskModal>
        </>
  )
}



const Todo = styled.div`
border:1px solid white;
width:25%;
margin-top : 20px;
box-shadow : 2px 2px 2px 2px lightgray;
`

const InProgress = styled.div`
border:1px solid white;
width:25%;
margin-top : 20px;
box-shadow : 2px 2px 2px 2px lightgray;
&:isDragging{
    border:1px solid pink;
}`

const Done = styled.div`
border:1px solid white;
box-shadow : 2px 2px 2px 2px lightgray;
width:25%;
margin-top : 20px; `

const NewTask = styled.div`
height : 20vh;
border : .5px solid lightgray;
margin : 20px;
display:flex;
flex-direction:column;
font-family: var(--font);
`;

const Head = styled.h4`
margin:10px;
color:#484848;`

const AddTask = styled.button`
position : relative;
font-family: var(--font);
  padding: 10px;
  border: none;
  background: #2bd4d4;;
  color : white;
  width : calc(100% - 20px);
  margin : 10px 10px 10px 10px;
`
const TaskName = styled.textarea`
margin : 10px;
height : 50%;
border : .5px solid lightgray;
`
const TodoTask = styled.div`
margin : 20px;
border : 1px solid white;
box-shadow : 2px 2px 2px 2px lightgray;
padding : 20px;
color:black;
font-size:15px;
`

const Assignee = styled.li`
border:1px solid lightgray;
align-items:center;
font-size:12px;
list-style-type:none;
background:#F0F8FF;
`
const Assignees = styled.ul`
display:flex;
margin-right:0px;
`
