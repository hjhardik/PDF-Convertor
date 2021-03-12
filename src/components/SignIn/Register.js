// REGISTER USER
import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {serverURL} from "../../config";

//function for sending credentials to server
async function registerUser(credentials) {
  return fetch(`${serverURL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }

//eslint-disable-next-line 
const Register = ({setToken}) => {
  let history = useHistory();
  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // selecting role (ie. teacher or student)
  
  const onSubmit = async (e) => {
    e.preventDefault();
    //validation
    if (!email || !password || !confirmPassword ) {
      setErrorMessage('Please fill all fields')
      return
    }
    if (! (password === confirmPassword)){
      setErrorMessage('Password and confirm password do not match')
      return
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(! re.test(String(email).toLowerCase())){
      setErrorMessage("Please enter valid Email Id");
      return;
    }
    
    //send credentials to registerUser function
    const token = await registerUser({email, password})
    if(token.success){
      setToken(token);
      setEmail('');
      setPassword('');
      setConfirmPassword(''); 
      history.push("/dashboard");
    }else{
      setErrorMessage(token.msg)
    }
  }

    return(
     <>
     <br/>
    { errorMessage && <h4 className="error"> { errorMessage } </h4> } 
    <form className='add-form' onSubmit={(e)=> onSubmit(e)}>
    <h3 className="login-header">Register New Account</h3>
    <br/>
      <div>
      <div className=''>
        <label>Email</label><br/>
        <input
          type='email'
          placeholder='Enter Email'
          value={email}
          onChange={(e) => {setEmail(e.target.value);if (errorMessage){
      setErrorMessage(null);
    }}}
        />
      </div>
      <div className=''>
        <label>Password</label><br/>
        <input
          type='password'
          placeholder='Enter Password'
          value={password}
          onChange={(e) => {setPassword(e.target.value);if (errorMessage){
      setErrorMessage(null);
    }}}
        />
      </div>
      <div className=''>
        <label>Confirm Password</label><br/>
        <input
          type='password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={(e) => {setConfirmPassword(e.target.value);if (errorMessage){
      setErrorMessage(null);
    }}}
        />
      </div>
      </div>
        <br/>
      <input type='submit' value='REGISTER' className='btn btn-primary' />
    </form>
    <div>
        <p>Already Registered ?</p>
        <Link to='/login'>Login</Link>
        </div>
    </>
    )
}

export default Register