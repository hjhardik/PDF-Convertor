import React, {useState, useEffect} from 'react'
import {serverURL} from "../../config";
import Button from "../Elements/Button";
import {Link, useHistory} from "react-router-dom";

const fetchFiles = async (email) => {
    return await fetch(`${serverURL}/contracts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
      }).then((data)=> data.json())
}

const MergeFile = () => {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState(null)
    const [pdfFiles, setPdfFiles] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([])
    const [mergedName, setMergedName] = useState('')
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
        if(selectedMembers.length< 2){
            setErrorMessage("Select atleast two files")
            return
        }
        if(mergedName === null || mergedName === ""){
            setErrorMessage("Please enter a name for resultant merged file")
            return
        }
        let stat = await fetch(`${serverURL}/mergefiles`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({selectedFiles: selectedMembers, mergedFileName:mergedName})
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

    const updateSelectedMembers = (memberName, isSelected) => {
        isSelected? setSelectedMembers([...selectedMembers, memberName])
        :
        setSelectedMembers(selectedMembers.filter( mem => mem !== memberName)) 
    }

    return (
        <div className="ind-comp">
        <br/>
            { errorMessage && <h4 className="error"> { errorMessage } </h4> }
            <br/>
            <form onSubmit={(e) => handleSubmit(e)}>
            <h5>Select the files to be merged:</h5>
            <div className="presentFiles">
            { 
              pdfFiles.map((member, idx) => (
                    <React.Fragment key={idx}>
                        <input type="checkbox" name={`member${idx}`} value={member} onChange={(e) => {updateSelectedMembers(e.currentTarget.value, e.currentTarget.checked);if(errorMessage) setErrorMessage(null)} }/>
                        <label htmlFor={idx}>{member}</label>
                        <br/>   
                    </React.Fragment>
                ))
            }
            </div>
            <br/>
            <label>Please select a name for resultant merged file (.pdf)</label>
            <br/>
            <input
              type='text'
              placeholder='Enter resultant merged file name (.pdf)'
              value={mergedName}
              onChange={(e) => {setMergedName(e.target.value); if(errorMessage) setErrorMessage(null);}}
            />
            <br/>
            <br/>
            <div className="create-draft-buttons">
                <div>
                    <Button class="btn btn-primary" btnType="submit" text="Merge" onClick={(e)=> handleSubmit(e)}/>
                    <Button class="btn btn-outline-danger" onClick={(e) => cancelHandler(e)} text="Cancel" /> 
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

export default MergeFile
