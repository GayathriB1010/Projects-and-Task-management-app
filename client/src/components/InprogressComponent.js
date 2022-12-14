import React from 'react'
import { useContext, useEffect,useState } from "react"
import styled from "styled-components"
import LoadingWheel from "./LoadingScreen";
import { ManagefluentContext } from "./ManagefluentContext";
import TaskModal from "./TaskModal";
import {FiTrash2, FiEdit} from "react-icons/fi";
import {FiRepeat} from "react-icons/fi";
import TaskUpdateModal from "./TaskUpdateModal"

import {
    Assignee,Assignees,TaskUpdateButtons,ButtonDiv,GoogleDocUrl,StyledLink
} from "./TaskboardCommonStyledComponents"

export default function InprogressComponent() {
    const {inProgressTasks,setInProgressTasks,selectedProjectId,name,setName,updateTaskFeed,setupdateTaskFeed,taskClicked,setTaskClicked, defaultValuesPreviouslySelected, setDefaultValuesPreviouslySelected,taskSelected,setTaskSelected} = useContext(ManagefluentContext);

    const [isOpen,setIsOpen] = useState(false);
    //state to set open for the taskupdateModal
    const [taskUpdateIsopen,setTaskUpdateisOpen] = useState(false);

    //This use effect will get all the in progress tasks when updateFeed changes
    //updateFeed is changed when a task status is updated
    useEffect(() =>{
        const getAllInProgressTasks = async() =>{
            const response = await fetch(`/api/project/${selectedProjectId}/inProgress`);
            const data = await response.json();
            setInProgressTasks(data.data)
        }
        if(localStorage.getItem("user")){
            getAllInProgressTasks();
        }
    },[updateTaskFeed]);

    //This function will get invoked when a task is clicked
    const taskClickFn = (todoTask) =>{
        let previouslySelectedOptions = [];
        setTaskClicked(!taskClicked)
        setTaskSelected(todoTask)
        setIsOpen(true)
    }

    //This function will set the taskupdate modal to be true
    const taskUpdateFn = (todoTask) =>{ 
        setTaskSelected(todoTask)
        setTaskUpdateisOpen(true)
        }


    //This function will get invoked when a delete task button is clicked
    const taskDeleteFn = (todoTask ) =>{
        let taskId = todoTask.taskId;
        fetch(`/api/delete-task/${taskId}`, {
            method: "DELETE", 
            headers: {
                "Content-Type": "application/json",
              },
          }).then((res) =>
          //When the task is deleted, updateTodo will be set to !updateTodo
          setupdateTaskFeed(!updateTaskFeed))
            }
    
  return (
      <>
    <InProgressMainDiv>
        {inProgressTasks!==[] ? inProgressTasks.map((inProgressTask) =>{
            return <InprogressTask>{inProgressTask.name}{inProgressTask.assignedTo.map((assignee) =>{
                return <Assignees>
                <Assignee>
                {assignee.split("@")[0]}
                </Assignee></Assignees>
            })}
               {inProgressTask.documents?<><GoogleDocUrl><StyledLink href={inProgressTask.documents}>Click here to open the Attachment</StyledLink></GoogleDocUrl></>:null}
            <TaskUpdateButtons>
                <ButtonDiv><FiEdit onClick={() => taskClickFn(inProgressTask)}></FiEdit></ButtonDiv>
                <ButtonDiv><FiRepeat onClick={()=> taskUpdateFn(inProgressTask)}></FiRepeat></ButtonDiv>
                <ButtonDiv><FiTrash2 onClick={() => taskDeleteFn(inProgressTask)}></FiTrash2></ButtonDiv>
            </TaskUpdateButtons>
            </InprogressTask>
        }):<></>}
    </InProgressMainDiv>
    <TaskModal open = {isOpen} onClose ={() => setIsOpen(false)} taskSelected = {taskSelected}>
    </TaskModal>
    <TaskUpdateModal taskSelected = {taskSelected} open = {taskUpdateIsopen} onClose ={() => setTaskUpdateisOpen(false)}></TaskUpdateModal>
        </>
  )
}


const InProgressMainDiv = styled.div`

`
const Done = styled.div`
border:1px solid white;
box-shadow : 2px 2px 2px 2px lightgray;
width:25%;
margin-top : 20px; `



const InprogressTask = styled.div`
margin : 20px;
border : 1px solid white;
box-shadow : 2px 2px 2px 2px lightgray;
padding : 20px;
color:black;
font-size:15px;
`
