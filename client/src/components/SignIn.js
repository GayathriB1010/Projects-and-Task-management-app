import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router';
import { ManagefluentContext } from "./ManagefluentContext";
import { useContext } from "react";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import waterImage1 from "../images/waterImage1.png"

const SignIn = () => {
  const navigate = useNavigate();
  const {currentUser,setCurrentUser} = useContext(ManagefluentContext);
  const [email,setEmail] = useState(null);
  const [password,setPassword] = useState(null);
  const [error,setError] = useState(false);
  const [clicked,setClicked] = useState(false);
  const [errorMessage,setErrorMessage] = useState(null);

  //This will set email and password when the target is changed
  const handleInput = (e) =>{
    switch(e.target.id){
      case "email":
        setEmail(e.target.value);
        break;
        case "password":
          setPassword(e.target.value);
          break;
    }
  }

  //This will fetch the user with the email and password entered
  const handleSubmit = (e) =>{
    e.preventDefault();
    setClicked(true);
    fetch(`/api/user?email=${email}&password=${password}`)
    .then(res => res.json())
    .then(data =>{
      //If the status is 200, then email is set to current user and navigated to dashboard
      if(data.status === 200){
        setCurrentUser(email);
        localStorage.setItem("user",email);
        navigate("/dashboard")
      }
      //If the status is 400, this will show the error notification of incorrect password
      else if(data.status === 400){
        setError(true);
        toast.error('Incorrect password. Please try again !', {
          position: toast.POSITION.TOP_RIGHT
      });
      }
       //If the status is 404, this will show the error notification of incorrect user
      else if(data.status === 404){
        setError(true);
        toast.error('Incorrect email. Please try again !', {
          position: toast.POSITION.TOP_RIGHT
      });
      }
    })
    .catch(err => {
    })
  }
  
  return (
    <>
      <Wrapper>
      <Headings>
        <H1>Sign In!</H1>
      </Headings>
        <Form onSubmit ={handleSubmit}>
          <Email>
            <Input
              type="email"
              id="email"
              placeholder="Email Address"
              required
              onChange={(e) => handleInput(e)}
            />
          </Email>
          <Password>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              required
              onChange={(e) => handleInput(e)}
            />
          </Password>
          {clicked === true && error === true?<Error>{errorMessage}</Error>:null}
          <Button type="submit">Sign In</Button>
        </Form>
        <StyledLink to="/SignUp">
          Don't have an account? Sign up for Managefluent!
        </StyledLink>
        <ToastContainer autoClose={1000}/>
      </Wrapper>
    </>
  );
};

export default SignIn;

// ------------------------------------------------
// Main div
const Wrapper = styled.div`
  font-family: var(--font);
  margin: 0 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction:column;
  align-items: center;
  height:100vh;
  background-image:url(${waterImage1})
`;
// ------------------------------------------------
// Header
const H1 = styled.h1`
  font-size: 24px;
  padding: 15px 24px;
  font-family: var(--font);
  margin: 0 24px;
`;
// ------------------------------------------------
// Form
const Form = styled.form`
  box-sizing: border-box;
  border: 1px solid #E8E8E8;
  font-family: var(--font);
  margin: 0 24px;
  width:20%;
`;

const Email = styled.div``;
const Password = styled.div``;
const Button = styled.button`
 font-family: var(--font);
  padding: 10px;
  border: none;
  background: #2bd4d4;;
  color : white;
  width : calc(100% - 20px);
  margin : 10px 10px 10px 10px;
`;

const Headings = styled.div`
  text-align: center;
`;
const StyledLink = styled(Link)`
  margin: 20px 20px 10px 20px;
  color : #3333ff;
font:var(--font);
font-size:1rem;
`;

const Input = styled.input`
    padding: 10px;
  width: calc(100% - 48px);
  margin: 10px 10px 10px 10px;
  font-family: var(--font);
`;

const Error = styled.div`
color : red;
`