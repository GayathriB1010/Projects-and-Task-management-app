import { useEffect,useContext,useState } from "react";
import styled from "styled-components";
import { ManagefluentContext } from "./ManagefluentContext";
import LoadingWheel from "./LoadingScreen";
import { useNavigate } from "react-router-dom";
import {FiPlusCircle} from "react-icons/fi";
import ModalElement from "./ModalElement";
import {FiHome} from "react-icons/fi";
import waterImage1 from "../images/waterImage1.png"
import { ToastContainer,toast } from "react-toastify";

const Dashboard = () =>{
    const {projects,setProjects,updateProjects,adminUsers,setAdminUsers,createProjectClicked,setCreateProjectClicked,setSelectedProjectId,recentProjects,setRecentProjects,projectClicked,setProjectClicked} = useContext(ManagefluentContext);
    const [isOpen,setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [isAdmin,setIsAdmin] = useState(false);
    const [currentPage,setCurrentPage]  = useState(1);
    const [projectsPerPage,setProjectsPerPage] = useState(9);

    //This use effect is to get all projects of the signed in user. User signed in stored in local storage
    useEffect(() =>{
        const getAllProjects = async() =>{
            const response = await fetch(`/api/all-projects/${localStorage.getItem("user")}`);
            const data = await response.json();
            setProjects((data['data']));
        }
        if(localStorage.getItem("user")){
            getAllProjects();
        }
    },[localStorage.getItem("user"),updateProjects]);


    //This use effect is to get recent projects of the signed in user
    useEffect(() =>{
        const getRecentProjects = async() =>{
            const response = await fetch(`/api/get-recentProjects/${localStorage.getItem("user")}`);
            const data = await response.json();
            setRecentProjects((data['data']));
        }
        if(localStorage.getItem("user")){
            getRecentProjects();
        }
    },[localStorage.getItem("user"),updateProjects]);

    //This method is to navigate to the project when clicked
    const navigateToProjectTasks = (projectId) =>{
        navigate(`/project/${projectId}`);
        setSelectedProjectId(projectId);
    }

    const CreateProjectClicked = () =>{
        setIsOpen(true);
        setCreateProjectClicked(!createProjectClicked)
    }

    const projectClickedFn = (recentProject) =>{
        navigateToProjectTasks(recentProject.projectId)
    }
    
    //This use effect is to get admin users. Only admin user can create a project. Admin users is looped through to find if the signed in user is admin
    useEffect(() =>{
        const getAdminUsers = async() =>{
            const response = await fetch(`api/get-adminUsers`);
            const data = await response.json();
            setAdminUsers((data['data']));
        }
        if(localStorage.getItem("user")){
            getAdminUsers();
        }
        if(adminUsers.length>0){
            adminUsers.map((adminUser) =>{
                if(adminUser.email === localStorage.getItem("user")){
                  setIsAdmin(true);
                }
            })
        }
    },[localStorage.getItem("user")]);

    //This method is to click pages
    const handlePageClick =(e) =>{
        setCurrentPage(Number(e.target.id));
        console.log(currentPage)
    }
 
    //If project is not null,project page is rendered
    if(projects.length > 0){
        const indexOfLastProject = currentPage * projectsPerPage;
        const indexOfFirstProject = indexOfLastProject - projectsPerPage;
        const currentProjects = projects.slice(indexOfFirstProject,indexOfLastProject)
          // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(projects.length / projectsPerPage); i++) {
            pageNumbers.push(i);
          }
    return(
        <PageWrapper>
        {/* Side bar displays the recent project and create project option*/}
        <Sidebar>
        <DashboardIcon>
                <FiHome></FiHome>
                  <Span>Dashboard</Span>
                </DashboardIcon>
            <NewProject>
                {adminUsers.map((adminUser) =>(
                    adminUser.email === localStorage.getItem("user")? 
                            <>
                            <CreateProjectIcon>
                        <FiPlusCircle onClick={() => CreateProjectClicked()}></FiPlusCircle>
                        </CreateProjectIcon><CreateProject>Create a new project</CreateProject>
                        </>: null))}
                </NewProject>
                <RecentProjects>RECENT PROJECTS</RecentProjects>
                <RecentProjectDiv>{recentProjects.length>0?
                    recentProjects.map((recentProject) =>{
                        return <RecentProjectItems onClick={() => projectClickedFn(recentProject)}>{recentProject.projectName}</RecentProjectItems>
                    })
               :null}
               </RecentProjectDiv>
                </Sidebar>
        <MainDiv>
      {currentProjects.map((project) =>{
          return(
           <ProjectWrapper onClick={() => navigateToProjectTasks(project.projectId)}>
           <Projects>
                <Name>{project.projectName}</Name>
                <Description>{project.projectDescription}</Description>
                <CreatedBy>Project Owner: {project.createdBy}</CreatedBy>
                </Projects>
           </ProjectWrapper>
          )
       })}
       {/* This ul, iterates the number of pages and display each page number*/ }
       {pageNumbers.length>1?<PageNumberul>
       {pageNumbers.map((number) =>{
           return(
               <Li
               key = {number}
               id = {number}
               onClick = {(e) => handlePageClick(e)}
               >{number}</Li>
           )
       })}
       </PageNumberul>:null}
       </MainDiv>
       <ModalElement open = {isOpen} onClose ={() => setIsOpen(false)}>
                </ModalElement> 
       </PageWrapper>
    )
}
    else{
        return (
            <>
            <ToastContainer/>
            <NewProject>
                {adminUsers.map((adminUser) =>(
                    adminUser.email === localStorage.getItem("user")? 
                            <>
                            <CreateProjectIcon>
                        <FiPlusCircle onClick={() => setIsOpen(true)}></FiPlusCircle>
                        </CreateProjectIcon><CreateProject>Create a new project</CreateProject>
                        </>: null))}
                </NewProject>
                {/* Project modal element is opened when is open is set and its passed as props to the modalElement*/}
                <ModalElement open = {isOpen} onClose ={() => setIsOpen(false)}>
                </ModalElement> 
                </>
          );
    }
}

const Wrapper = styled.div`
`
const MainDiv = styled.div`
height:100vh;
display:flex;
flex-wrap:wrap;
gap:10px;
justify-content:space-evenly;
width:85%;
background-image:url(${waterImage1})
`
const ProjectWrapper = styled.div`
display:flex;
flex-direction:column;
flex-wrap:wrap;
flex: 0 0 25%;

`
const Description = styled.div`
color:black;
margin-top : 10px;
font-size:15px;
`
const Name = styled.div`
color:black;
font-size :18px;
`

const CreateProject = styled.div`
font-size : 15px;
margin : 10px;
`
const NewProject = styled.div`
display:flex;
color:black;
margin : 0 0 20px 30px;
`

const CreateProjectIcon = styled.div`
margin-top :10px;
font-size:15px;
`
const PageWrapper = styled.div`
display:flex;
`

const DashboardIcon = styled.div`
font-size : 18px;
color:#2bd4d4;
margin : 20px 0 20px 30px;
`

const Sidebar = styled.div`
display:flex;
flex-direction:column;
width : 15%;
border-right:1px solid lightgray;
background:#f2f2f2;
height:100vh;
`
const Span = styled.span`
margin:10px;
color:#2bd4d4;
font-size:18px;
`
const Projects = styled.div`
height:120px;
border : 1px solid lightgray;
margin :20px;
padding : 20px;
box-shadow : 2px 2px 2px 2px lightgray;
width:400px;
`

const RecentProjects = styled.div`
font-size : 15px;
color:#2bd4d4;
margin : 20px 0 0px 30px;`

const RecentProjectDiv = styled.div`
margin : 20px 0 20px 30px;
`

const RecentProjectItems = styled.div`
font-size : 15px;
margin-bottom:15px;
`

const CreatedBy = styled.div`
font-size : 12px;
margin-top : 55px;
`
export const Li = styled.li`
list-style:none;
color:#2bd4d4;
cursor:pointer;
width : 20px;
align-items: center;
margin-right:20px;
box-shadow: -3px -3px 7px #ffffff73, 3px 3px 5px rgba(94, 104, 121, 0.288);
`

const PageNumberul = styled.ul`
display:flex;
width:200px;
height:30px;
margin-top : 10px;
border:1px solid lightgray;
justify-content:space-evenly;
box-shadow : 2px 2px 2px 2px lightgray;
`
export default Dashboard