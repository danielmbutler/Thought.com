import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";


export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const notes = await loadNotes();
        setNotes(notes);
       
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function renderNotesList(notes) {
    
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroupItem header={note.content.trim().split("\n")[0]}>
            {"Created: " + new Date(note.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new Thought
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }
  function renderLander() {
    return (
      <div className="lander">
        <h1>Thought.com</h1>
        <p>Post your thoughts to the world..</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Thoughts</PageHeader>
        <ListGroup>
          {!isLoading && renderNotesList(notes)}
        </ListGroup>
      </div>
    );
  }

  
  function renderPhotos() {

    return(
      <div id="photolist">
      <ul id = "photos"></ul>
        {!isLoading && GetPhotos(notes)}
    </div>
    );
          
    }

  function GetPhotos(notes) {
    
    // generate photos
    console.log("getphotos");
    var photolist = document.getElementById('photos');
              notes.forEach(function(obj,index){

                if(obj.attachment){
                    //console.log("" + imglink + "/" + obj.attachment);
                    var entry = document.createElement('li');
                    const anchor = document.createElement('a');
                    anchor.href = "" + obj.userId.split(':').join('%3A') + "/" + obj.attachment;
                    var x = document.createElement("IMG");
                    x.src = "" + obj.userId.split(':').join('%3A') + "/" + obj.attachment;
                    x.setAttribute("class", "IMG");
                    entry.setAttribute("class", "grid");
                    entry.appendChild(x);
                    entry.appendChild(anchor)
                    photolist.appendChild(entry);
                    }
      
            }); 
          
                  //style photos
      
                  var listItems = document.getElementsByClassName("grid");
                  for(var i=0;i<listItems.length;i++){
                    listItems[i].style.display='inline-block';
                }
                  var elements = document.getElementsByClassName("IMG")
                  for(var i=0;i<elements.length;i++){
                      elements[i].style.color='blue';
                      elements[i].style.margin='10px';
                      elements[i].style.width = '200px';
                      elements[i].style.height = '200px';
                      elements[i].style.display='inline-block';
                  
  }
}
 

  return (
    <div className="Home">
      
      {isAuthenticated ? renderNotes() : renderLander()}
      <h2> Photos </h2>
      {isAuthenticated ? renderPhotos() : renderLander()}
    
    </div>
  );
}
