//DASHBOARD COMPONENT
import Button from "../Elements/Button";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom"
import {serverURL} from "../../config";
import axios from "axios";

// Fetch Tasks
const fetchFiles = async (email) => {
    return await fetch(`${serverURL}/contracts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
      }).then((data)=> data.json())
}

const Dashboard = () => {
    const [pdfFiles, setPdfFiles] = useState([])
    const [rendered, setRendered] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [errorMessage, setErrorMessage]  = useState(null);

    //GET ALL THE FILES
    useEffect(() => {
        const getTasks = async () => {
            let filesFromServer = await fetchFiles(localStorage.getItem('email'))
            setPdfFiles(filesFromServer)
        }
        if(rendered){ 
            getTasks()
        }
        if( ! rendered ) {  
            setRendered(true);
        }
    },[rendered]);

    const onFileChange = event => {
        console.log(event.target.files[0]);
        setSelectedFiles(event.target.files[0]);
    };

    const handleUploadFile = () => {
        if(selectedFiles === null){
            setErrorMessage("Please upload file")
            return
        }
        const data = new FormData();
        data.append('file', selectedFiles);
        data.append('name', selectedFiles.name);
        // '/files' is your node.js route that triggers our middleware
        axios.post(`${serverURL}/files`, data, { // receive two parameter endpoint url ,form data 
        })
        .then(() => { // then print response status
            setRendered(!rendered)
        })
    }

    return(
        <div>
        <nav className="navbar navbar-expand-md navbar-light bg-light">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                <Link to="/mergefiles">Merge Files</Link>     
                </li>
                <li className="nav-item">
                <Link to="/splitfiles">Split Files</Link>  
                </li>
                <li className="nav-item">
                <Link to="/deletepages">Delete Pages</Link>  
                </li>
                <li className="nav-item">
                <Link to="/reorderpages">Reorder Pages</Link>  
                </li>
                <li className="nav-item">
                <Link to="/signfiles">Send for Signing</Link>  
                </li>
                </ul>
            </div>
            </nav>
            <br/>
            { errorMessage && <h4 className="error"> { errorMessage } </h4> }
            <br/>
            <div className="upload-file">
                <div className="upload-file-box">
                    <h3>Upload New Files</h3>
                    <br/>
                    <input type="file" accept="application/pdf" onChange={onFileChange}/>
                    <Button class="btn btn-success" text="UPLOAD" onClick={handleUploadFile} />   
                </div>
                <div className="present-files">
                    <h3>Your Files</h3>
                    <div className="all-files files-viewer">
                        <div>
                        <ul className="presentFiles">
                        { 
                        pdfFiles.map((member, idx) => (
                            <li key={idx}>
                                <i className="fa fa-file-pdf-o fa-2x"></i>
                                <Link to={`/viewpdf/${member}`}>{member}</Link>  
                            </li>
                            ))
                        }
                        </ul>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Dashboard;