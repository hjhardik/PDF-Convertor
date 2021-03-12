// handles the contract(PDF) viewer
import React,{useEffect} from 'react'
import {useParams} from "react-router-dom";

const Viewer = () => {
    let {pdf} = useParams();
    
    // attach external JS file for PDF view  
    useEffect(() => {
        const firstScript = document.createElement('script');
        firstScript.src = "https://documentcloud.adobe.com/view-sdk/main.js";
        firstScript.async = true;
        firstScript.type="text/javascript";
        const secondScript = document.createElement('script');
        secondScript.src = "/adobeview.js";
        secondScript.async = true;
        secondScript.type="text/javascript";
        document.body.appendChild(firstScript);
        document.body.appendChild(secondScript);
      return () => {
          document.body.removeChild(firstScript);
          document.body.removeChild(secondScript);
        }
      }, []);
    return (
        <div id="pdfviewercontainer" pdf-file={`${pdf}`}>
            <div id="adobe-dc-view"></div>
        </div>
    )
}

export default Viewer
