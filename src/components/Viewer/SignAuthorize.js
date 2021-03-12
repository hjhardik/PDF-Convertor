//handles the signing of PDF contract by user
// when user clicks on sign contract, redirects to OAUTH by adobe account,
// and then generates code and access/refresh tokens and then sends the document to be
// signed through TRANSIENT DOCUMENT and generates an AGREEMENT, which later will be used 
// to create a signing URL, which will then be sent to the candidate for signing
import React,{useState, useEffect} from 'react';
import Button from "../Elements/Button";
import {serverURL} from "../../config";
import {useHistory} from "react-router-dom";

const SignAuthorize = () => {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState(null)
    const [pdfFiles, setPdfFiles] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [content, setContent] = useState('OAUTH ....')
    const [showTasksUsers, setShowTasksUsers] = useState(true)

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const code = params.get('code');

        if(code === undefined || code===null){
            const getTasks = async () => {
                let filesFromServer = await fetch(`${serverURL}/contracts/`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email: localStorage.getItem('email')})
                  }).then((data)=> data.json())
                setPdfFiles(filesFromServer)
            }
            const getUsers = async () => {
                let usersFromServer = await fetch(`${serverURL}/findusers/`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email: localStorage.getItem('email')})
                  }).then((data)=> data.json())
                setUsers(usersFromServer)
            }
            getTasks();
            getUsers();
        }else{
            setShowTasksUsers(false);
            callFunc();
        }
    //eslint-disable-next-line   
    },[]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(selectedMembers === null){
            setErrorMessage("Select a file to send for signing")
            return
        }
        if(selectedUsers === null){
            setErrorMessage("Select a user to send for signing")
            return
        }

        callFunc();
    }

    const cancelHandler = (e) => {
        e.preventDefault();
        if(errorMessage)
        {   setErrorMessage(null)
        } 
        setSelectedMembers([])
        setSelectedUsers([])
        history.push("/dashboard");
    }

    function onlyOne(checkbox, id) {
        var checkboxes;
        if(id===0){
            checkboxes = document.getElementsByName('member')
        }else{
            checkboxes = document.getElementsByName('user')
        }
        checkboxes.forEach((item) => {
            if (item.value !== checkbox) item.checked = false
        })
    }
    const updateSelectedMembers = (memberName, isSelected, id) => {
        if(id===0){
            isSelected? setSelectedMembers(memberName):setSelectedMembers(null) 
        }else{
            isSelected? setSelectedUsers(memberName):setSelectedUsers(null) 
        }
        
        onlyOne(memberName, id);
    }


    const callFunc = async () => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const code = params.get('code');
        const state = params.get('state');
        const api_access_point = params.get('api_access_point');
        setErrorMessage(null);
        if(code === null || code === undefined){
            let redirectUrl = await fetch(`${serverURL}/signauth/redirect`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({contract:selectedMembers, email:selectedUsers , code, state, api_access_point})
            }).then((data)=>data.json());

            window.open(redirectUrl.data, "_self");  

        }else{
        let res = await fetch(`${serverURL}/signauth/redirect`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({contract:selectedMembers, email:selectedUsers, code, state, api_access_point})
        }).then((data)=>data.json());
        if(res.success){
            setContent('Authorization successful. Contract sent through email.') 
        }else{
            setErrorMessage(res.msg);
        }  
    } 
    }
    
    return (
        <div className="ind-comp">
        <br/>
            { errorMessage && <h4 className="error"> { errorMessage } </h4> }
            <br/>
            {
                showTasksUsers && 
                <>
                <form onSubmit={(e) => handleSubmit(e)}>
            <h5>Select the file to be signed:</h5>
            <div className="presentFiles">
            { 
              pdfFiles.map((member, idx) => (
                    <React.Fragment key={idx}>
                        <input type="checkbox" name="member" value={member} onChange={(e) => {updateSelectedMembers(e.currentTarget.value, e.currentTarget.checked, 0);if(errorMessage) setErrorMessage(null)} }/>
                        <label htmlFor={idx}>{member}</label>
                        <br/>   
                    </React.Fragment>
                ))
            }
            </div>
            <br/>
            <h5>Select the user for sending:</h5>
            <div className="presentFiles">
            { users.length !== 0 ?
              users.map((member, idx) => (
                    <React.Fragment key={idx}>
                        <input type="checkbox" name="user" value={member} onChange={(e) => {updateSelectedMembers(e.currentTarget.value, e.currentTarget.checked, 1);if(errorMessage) setErrorMessage(null)} }/>
                        <label>{member}</label>
                        <br/>   
                    </React.Fragment>
                ))
                :
                "No other users present"
            }
            </div>
            <br/>
            <br/>
            <div className="create-draft-buttons">
                <div>
                    <Button class="btn btn-primary" btnType="submit" text="Send for Signing" onClick={(e)=> handleSubmit(e)}/>
                    <Button class="btn btn-outline-danger" onClick={(e) => cancelHandler(e)} text="Cancel"/> 
                </div>
            </div>
            </form>
            <br/>
                </>
            }
            
            <br/>
            <div>
                <h1>{content}</h1>
                <Button class="btn btn-primary" onClick={(e) => cancelHandler(e)} text="Back To Dashboard"/> 
                <br/>
                <br/>
                <br/>
            </div>
        </div>
    )
}

export default SignAuthorize


    

