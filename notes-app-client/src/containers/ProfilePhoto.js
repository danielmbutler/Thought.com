import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./ProfilePhoto.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsProfilePic";
import { Auth } from "aws-amplify";

export default function ProfilePhoto() {
  const file = useRef(null);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);


      


 
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

    function createNote(note) {
        return API.post("notes", "/notes", {
          body: note,
        });
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
      

      var username =  await Auth.currentAuthenticatedUser()
      .then(user => {
          return user.attributes.email;
      })

      var content = "Uploading New Profile Pic"

      await createNote({ content, attachment, username});
      window.location.replace("/");
      
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  


  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="file">
          <ControlLabel>Profile Photo</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          id = "submitbutton"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}