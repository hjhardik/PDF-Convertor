import React, {useState, useEffect} from 'react'
import {serverURL} from "../../config";
import Button from "../Elements/Button";
import {useHistory, Link} from "react-router-dom";

const fetchFiles = async (email) => {
    return await fetch(`${serverURL}/contracts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
      }).then((data)=> data.json())
}

const DeletePage = () => {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState(null)
    const [pdfFiles, setPdfFiles] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [resultFile, setResultFile] = useState('')

    useEffect(() => {
        const getTasks = async () => {
            let filesFromServer = await fetchFiles(localStorage.getItem('email'))
            setPdfFiles(filesFromServer)
        }
         
        getTasks()
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(selectedMembers.length === 0){
            setErrorMessage("Please select a file");
            return
        }
        let SP = document.getElementById("deleteSP").value;
        let EP = document.getElementById("deleteEP").value;
        if(parseInt(SP) > parseInt(EP)){
            setErrorMessage("Starting page can't be lower than ending page");
            return
        }
        let stat = await fetch(`${serverURL}/editcontract/reorderDelete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({selectedFiles: selectedMembers,SP, EP, id:0})
        }).then((data)=> data.json())
        if(stat.success){
            setResultFile(stat.fileName)
            setShowResult(true)
        }else{
            setShowResult(false)
            setResultFile('')
            setErrorMessage(stat.msg)
        }
    }

    const cancelHandler = (e) => {
        e.preventDefault();
        if(errorMessage)
        {   setErrorMessage(null)
        } 
        setSelectedMembers([])
        history.push("/dashboard");
    }
    function onlyOne(checkbox) {
        var checkboxes = document.getElementsByName('member')
        checkboxes.forEach((item) => {
            if (item.value !== checkbox) item.checked = false
        })
    }

    const updateSelectedMembers = (memberName, isSelected) => {
        isSelected? setSelectedMembers([...selectedMembers, memberName])
        :
        setSelectedMembers(selectedMembers.filter( mem => mem !== memberName)) 
        onlyOne(memberName)
    }

    return (
        <div className="ind-comp">
        <br/>
            { errorMessage && <h4 className="error"> { errorMessage } </h4> }
            <br/>
            <form onSubmit={(e) => handleSubmit(e)}>
            <h5>Select the file whose pages need to be deleted:</h5>
            <div className="presentFiles">
            { 
              pdfFiles.map((member, idx) => (
                    <React.Fragment key={idx}>
                        <input type="checkbox" name={`member`} value={member} onChange={(e) => {updateSelectedMembers(e.currentTarget.value, e.currentTarget.checked);if(errorMessage) setErrorMessage(null)} }/>
                        <label htmlFor={idx}>{member}</label>
                        <br/>   
                    </React.Fragment>
                ))
            }
            </div>
            <br/>
            <div className='form-control'>
                    <h4>Delete Pages</h4>
                    <input
                        type='number'
                        id='deleteSP'
                        min={1}
                        max={10}
                    />
                    <label>Enter starting page</label>
                    <br/>
                    <input
                        type='number'
                        id='deleteEP'
                        min={1}
                        max={10}
                    />
                    <label>Enter ending page</label>
                    <br/>
                    <div className="button-grp">
                    <Button class="btn btn-primary" text="Delete Pages" onClick={(e)=>handleSubmit(e)} />
                    <Button class="btn btn-outline-danger" text="Cancel" onClick={cancelHandler} />
                </div>
                </div>
            </form>
            <br/>
            {showResult &&
            <div>
               <h5>Resultant file : </h5>
               <i className="fa fa-file-pdf-o fa-2x"></i>
                <Link to={`/viewpdf/${resultFile}`}>{resultFile}</Link>  
            </div>
            }
        </div>

    )
}

export default DeletePage
