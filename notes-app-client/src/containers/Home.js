import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";


export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  var ProfilePicIds = []
  

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const notes = await loadNotes();
        setNotes(notes);
        //console.log(notes);
        notes.forEach(function(obj,index){
          if(obj.attachment === "ProfilePic"){
            ProfilePicIds.push(obj.noteId);
          } 
        });
        if(ProfilePicIds.length > 1){
          await deleteNote(ProfilePicIds[1]);
          //console.log("deleting....");
        };
       
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
  function deleteNote(id) {
    return API.del("notes", `/notes/${id}`);
  }

  function Like(){
    //console.log("function run")
  }

  function GenerateButtons(note){
           
                
                return (
                 <div>
                  <button id = "like" className="likebutton" onClick="Like()" >Like</button>
                  <button id = "unlike" className="likebutton">Unlike</button>
                  </div>
                )
                
  }
  

  function renderNotesList(notes) {
    
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroupItem header={note.content.trim().split("\n")[0] }>
            {"Created: " + new Date(note.createdAt).toLocaleString()}
            <br></br>
            {"Likes: " + note.Likes}
            <br></br>
            {"Liked By: " + (note.Likedby || "") }
            <br></br>
            {GenerateButtons(note)}
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
      <h2> Photos </h2>
      <ul id = "photos"></ul>
        {!isLoading && GetPhotos(notes)}
    </div>
    );
          
    }

  function renderButtons(note) {
    return(
      <p>
      {!isLoading && GenerateButtons(note)}
      </p>
    )
  }

  function GetPhotos(notes) {
    
    // generate photos
    //console.log("getphotos");
    
    var photolist = document.getElementById('photos');
    notes.forEach(function(obj,index){
      if(obj.attachment === "ProfilePic"){
        ProfilePicIds.push(obj.noteId);
      } 
    });
    if(ProfilePicIds.length > 1){
      window.location.replace(window.location.pathname + window.location.search + window.location.hash)
    };
              notes.forEach(function(obj,index){

                if(obj.attachment){
                    //console.log(" + imglink + "/" + obj.attachment);
                    var entry = document.createElement('li');
                    const anchor = document.createElement('a');
                    anchor.href = "" + obj.userId.split(':').join('%3A') + "/" + obj.attachment;
                    var x = document.createElement("IMG");
                    x.src = " + obj.userId.split(':').join('%3A') + "/" + obj.attachment;
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


        function renderProfilePhoto() {

          return(
            <div id="profilepic">
              {!isLoading && GetProfilePhoto(notes)}
          </div>
          );
                
          }

        function GetProfilePhoto(notes){
          var ProfilePhoto = document.getElementById('profilepic');
          var ProfilePic = [];
          

          notes.forEach(function(obj,index){
            if(obj.attachment === "ProfilePic"){
              //console.log(obj);
              var x = document.createElement("IMG");
              x.src = "" + obj.userId.split(':').join('%3A') + "/" + obj.attachment;
              x.setAttribute("class", "ProfilePic")
              var br = document.createElement("br");
              ProfilePhoto.appendChild(x);
              ProfilePhoto.appendChild(br);
              ProfilePic.push("true");
            } 
          });

        //console.log(ProfilePic)
                   
            if(ProfilePic.includes("true")){

              var button = document.createElement("a");
              button.innerHTML = "update profile pic"
              button.href = "/profile/profilephoto"
              button.setAttribute('class', 'button')
              ProfilePhoto.appendChild(button);


            } else { 
              var button = document.createElement("a");
              button.innerHTML = "create profile pic"
              button.href = "/profile/profilephoto"
              button.setAttribute('class', 'button')
              ProfilePhoto.appendChild(button);

            }
          

          
        }
         
        function renderFollowing() {

          return(
            <div>
            <h2 id="followersTitle">Followers</h2>
            <ul id = "Followers"></ul>
            {!isLoading && GetFollowers()}
            <h2 id="followingTitle">Following</h2>
            <ul id = "Following"></ul>
            {!isLoading && GetFollowing()}
          </div>
          );
                
          }
        function GetFollowers(){

          
          Auth.currentUserInfo().then((user) => {
            const requestOptionsAccountInfo = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
               
                  "UserID" : user.id
                  
              })
          };
  
          fetch('', requestOptionsAccountInfo)
          .then(res => res.json())
          .then(
              (result) => {
                      //console.log(result);
                      var followersAmount 
                      var userInfo = result.Items
                      userInfo.forEach(function(obj,index){
                          
                          //followers
                          if(obj.Followers){
                              followersAmount = obj.Followers.length 
                          }
                          
                          var followlist = document.createElement('Li')
                          var followers  = document.createTextNode(obj.Followers || "");
                          var followersList = document.getElementById('Followers')
                          followlist.appendChild(followers)
                          followersList.appendChild(followlist)
                        
                      });
                      //console.log(followersAmount);
                      if(followersAmount){
                          var followersList = document.getElementById('followersTitle')
                          //console.log(followersList)
                          followersList.textContent =  followersList.textContent + "("+ followersAmount +")"
                      }
                      
                    
              });
          });
        }
        function GetFollowing(){
          Auth.currentUserInfo().then((user) => {
          const requestOptionsAccountInfo = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
             
                "UserID" : user.id,
                
            })
        };

        fetch('', requestOptionsAccountInfo)
        .then(res => res.json())
        .then(
            (result) => {
                    //console.log(result);
                    var followingAmount 
                    var userInfo = result.Items
                    userInfo.forEach(function(obj,index){
                        
                        if(obj.Following){
                          followingAmount = obj.Following.length 
                      }

                        //following
                        var followlist = document.createElement('Li')
                        var followers  = document.createTextNode(obj.Following || "");
                        var followersList = document.getElementById('Following')
                        followlist.appendChild(followers)
                        followersList.appendChild(followlist)
                    });
                    //console.log(followingAmount);
                    if(followingAmount){
                        var followersList = document.getElementById('followingTitle')
                        //console.log(followersList)
                        followersList.textContent =  followersList.textContent + "("+ followingAmount +")"
                    }
                    
                  
            });
          });
        }   
        
          // render description

          function renderProfileDescription() {

            return(
              <div id="Description">
              <h2> Description </h2>
                {!isLoading && GetProfileDescription()}
            </div>
            );
                  
            }
          function GetProfileDescription(){

            Auth.currentUserInfo().then((user) => {
              const requestOptionsAccountInfo = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                 
                    "UserID" : user.id,
                    
                })
            };
    
            fetch('', requestOptionsAccountInfo)
            .then(res => res.json())
            .then(
                (result) => {
                  var userInfo = result.Items
                    userInfo.forEach(function(obj,index){
                        
                        if(obj.Description){
                          //console.log(obj.Description)
                          var div = document.getElementById("Description");
                          var input = document.createElement("textarea");
                          input.name = "post";
                          input.maxLength = "5000";
                          input.cols = "80";
                          input.rows = "10";
                          input.id ="DescriptionTextArea"
                          input.value= obj.Description
                          div.appendChild(input); //appendChild

                          // Button 

                          var button = document.createElement("button");
                        button.innerHTML = "Update Description"
                        button.onclick = function() { 
                          var DescriptionTextBox = document.getElementById("DescriptionTextArea").value || ""
                          Auth.currentUserInfo().then((user) => {
                            const requestOptionsAccountInfo = {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                               
                                  "UserID"      : user.id,
                                  "Description" : DescriptionTextBox,
                                  "Action"      : "POST"
                                  
                              })
                          };

                          //console.log(DescriptionTextBox)

                          fetch('', requestOptionsAccountInfo)
                          .then(res => res.json())
                          .then(
                              (result) => {
                                window.location.replace(window.location.pathname + window.location.search + window.location.hash);
                              }

                          );

                        });
                        }
                        button.style.display="table"
                        button.setAttribute('class', 'button')
                        div.appendChild(button);
                      
                    

                      }

                      if (!obj.Description){
                        // Create Button
                        var div = document.getElementById("Description");
                        var input = document.createElement("textarea");
                        input.name = "post";
                        input.maxLength = "5000";
                        input.cols = "80";
                        input.rows = "10";
                        input.id ="DescriptionTextArea"
                        div.appendChild(input); //appendChild
                        // Create Button
                        var button = document.createElement("button");
                        button.innerHTML = "Update Description"
                        button.onclick = function() { 
                          var DescriptionTextBox = document.getElementById("DescriptionTextArea").value || ""
                          Auth.currentUserInfo().then((user) => {
                            const requestOptionsAccountInfo = {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                               
                                  "UserID"      : user.id,
                                  "Description" : DescriptionTextBox,
                                  "Action"      : "POST"
                                  
                              })
                          };

                          //console.log(DescriptionTextBox)

                          fetch('', requestOptionsAccountInfo)
                          .then(res => res.json())
                          .then(
                              (result) => {
                                window.location.replace(window.location.pathname + window.location.search + window.location.hash);
                              }

                          );

                        });
                        }
                        button.style.display="table"
                        button.setAttribute('class', 'button')
                        div.appendChild(button);
                      }
                    
                    
                    });
                    }
            )}
              

          )};

 

  return (
    <div className="Home">
      {isAuthenticated ? renderProfilePhoto() : renderLander()}
      {isAuthenticated ? renderProfileDescription() : ""}
      {isAuthenticated ? renderNotes()  : ""}
      {isAuthenticated ? renderPhotos() : ""}
      {isAuthenticated ? renderFollowing() : ""}
    </div>
  );
}
