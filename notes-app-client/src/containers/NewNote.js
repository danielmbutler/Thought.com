import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewNote.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import { Auth } from "aws-amplify";

export default function NewNote() {
  const file = useRef(null);
  const history = useHistory();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
    //document.getElementById("submitbutton").disabled = false
    //var btn = document.getElementById("submitbutton");
    //btn.parentNode.insertBefore.value = 'my value'; // will just add a hidden value
    //btn.parentNode.insertBeforeinnerHTML = 'Create';
    //console.log(file.current.name);
    //console.log(file.current.type);
    
  }
 
  async function handleSubmit(event) {
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      ); 
      return;
    }

    /*if (file.current.type !== 'image/jpeg') {
      console.log("upload error");
      document.getElementById("submitbutton").disabled = true
      var btn = document.getElementById("submitbutton");
      btn.parentNode.insertBefore.value = 'my value'; // will just add a hidden value
      btn.parentNode.insertBeforeinnerHTML = 'Create';
    } */
  
    setIsLoading(true);
  
    try {

      const attachment = file.current ? await s3Upload(file.current) : null;
      var loggedinuser = await Auth.currentUserInfo();
      var username = loggedinuser.attributes.email
      //console.log(loggedinuser);
      //console.log(content)

      // check for tagging
    
      var str = content; 

      function checkTag(str){
        return str.split('@').pop().split(' ')[0];
      }   

      if(str.includes("@")){
        var tagged = checkTag(str);
          // request parameters
          const requestOptionsTagInfo = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              
                "UserID"      : tagged,
                "Notification" : username + " has tagged you in the following status: "  + content ,
                
            })
        };
  
        console.log(requestOptionsTagInfo);

        

        fetch('', requestOptionsTagInfo)
          .then(res => res.json())
          .then(
              (result) => {}

          )    

      }
      
    
      await createNote({ content, attachment, username });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  
  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note,
    });
  }

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="content">
          <FormControl
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          id = "submitbutton"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}