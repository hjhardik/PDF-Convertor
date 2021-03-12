// LOGIN PAGE
import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {serverURL} from "../../config";
// function for sending credentials to the server
async function loginUser(credentials) {
  return await fetch(`${serverURL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

//eslint-disable-next-line
const Login = ({setToken}) => {
    let history = useHistory();
    const [errorMessage, setErrorMessage] = useState(null);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('') 
  
  const onSubmit = async (e) => {
    e.preventDefault()
    // validation
    if (!email || !password) {
      setErrorMessage(('Please fill out all fields'));
      return
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(! re.test(String(email).toLowerCase())){
      setErrorMessage("Please enter valid Email Id");
      return;
    } 
    
    const token = await loginUser({
           email,
           password,
    }); 
    if(token.success){
      setToken(token);
      setEmail('');
      setPassword('');
      history.push("/dashboard");
    }else{
      setErrorMessage(token.msg);
    }     
  }
    return(
        <>
        <br/>
        { errorMessage && <h4 className="error"> { errorMessage } </h4> }
        <form className='add-form' onSubmit={onSubmit}>
        <h3 className="login-header">Log In to your Account</h3>
        <br/> 
          <div>
          <div>
            <label>Email</label><br/>
            <input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => {setEmail(e.target.value); if(errorMessage) setErrorMessage(null);}}
            />
          </div>
          <div className=''>
            <label>Password</label><br/>
            <input
              type='password'
              placeholder='Enter Password'
              value={password}
              onChange={(e) => {setPassword(e.target.value);if (errorMessage) setErrorMessage(null);}}
            />
          </div>
          </div>
          <br/>
          <input type='submit' value='LOG IN' className='btn btn-primary' />
        </form>
        <div>
          <p>New User ?</p>
          <Link to='/register'>Register New User</Link>
        </div>
        </>
        )
}

export default Login