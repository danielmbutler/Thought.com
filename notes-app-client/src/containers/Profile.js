import "./Profile.css";
import React from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";

export default function Profile() {
    var path = window.location.pathname.replace("/profile/","");
    
    console.log(path);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
    };
    fetch('https://0dx4tdpegb.execute-api.us-east-1.amazonaws.com/Prod/ThoughtProfile', requestOptions)
    .then(res => res.json())
    .then(
        (result) => {
            console.log(result);
            var data = result.Items
            console.log(result.Items[0].friendlyusername)
            var list = document.getElementById('posts');

            //generate thought list
           
            data.forEach(function(obj,index){

                
                var utcSeconds = obj.createdAt; // convert UTC Time
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(utcSeconds);
                //console.log(d);
                var entry = document.createElement('li');
                entry.setAttribute("id", "Div1");
                //var text = document.createTextNode(obj.userId  + " " + "Thought: " + obj.content + " " + "Time: " + obj.createdAt);
                var Content      =    document.createTextNode("Thought:" + " " +obj.content);
                var Time         =    document.createTextNode("Created Time:" + " " + d);
                var linebreak    =    document.createElement("br");
                var linebreak2   =    document.createElement("br");
                var linkText     =    document.createTextNode("Username:" + " " + obj.friendlyusername);
            
                
                entry.appendChild(linkText);
                entry.appendChild(linebreak);
                entry.appendChild(Content);
                entry.appendChild(linebreak2);
                entry.appendChild(Time);
                list.appendChild(entry);
            })
            //thoughts styling
            var elements = document.getElementsByTagName("li")
            for(var i=0;i<elements.length;i++){
                elements[i].style.color='blue';
                elements[i].style.margin='10px';
                elements[i].style.display='inline-block';
            }

            // generate Profile header
           
            var email = result.Items[0].friendlyusername;
            var Profilename   = email.substring(0, email.lastIndexOf("@"));
            var domain = email.substring(email.lastIndexOf("@") +1);
            var Header = document.getElementById('Header');
            var h = document.createElement("H1")                // Create a <h1> element
            var t = document.createTextNode(Profilename + "'s" + " " + "Profile");     // Create a text node
                h.appendChild(t);
            Header.appendChild(h);

            //list photos
            var imglink = path.split(':').join('%3A')
            console.log(imglink);
            var photolist = document.getElementById('photos');
            data.forEach(function(obj,index){

                if(obj.attachment){
                    //console.log("https://notes-app-uploads-db.s3.amazonaws.com/private/" + imglink + "/" + obj.attachment);
                    var entry = document.createElement('li');
                    const anchor = document.createElement('a');
                    anchor.href = "https://notes-app-uploads-db.s3.amazonaws.com/private/" + imglink + "/" + obj.attachment;
                    var x = document.createElement("IMG");
                    x.src = "https://notes-app-uploads-db.s3.amazonaws.com/private/" + imglink + "/" + obj.attachment;
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

            
        });


    
    return (
        <div>
          <h1 id="Header"> </h1>
          <ul id ="posts"></ul>
          <h2> Photos </h2>
          <ul id ="photos"></ul>
        </div>
  
     
      );
  };
         