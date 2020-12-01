import React from "react";
import "./Search.css";
import {
    HelpBlock,
    FormGroup,
    FormControl,
    ControlLabel
  } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";


export default function Search() {

    function GetResults() {
        var list = document.getElementById('posts');
        fetch("SEARCH API")
        .then(res => res.json())
        .then(
          (result) => {
            //console.log("helloworld");
            //console.log(result.Items);
            var data = result.Items
           
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
                var Profilelink  =    document.createElement('a');
                var linkText     =    document.createTextNode("Username:" + " " + obj.friendlyusername);
               
                Profilelink.title = obj.friendlyusername;
                Profilelink.href = `/profile/${obj.userId}`;
                
                Profilelink.appendChild(linkText);
                entry.appendChild(Profilelink);
                entry.appendChild(linebreak);
                entry.appendChild(Content);
                entry.appendChild(linebreak2);
                entry.appendChild(Time);
                list.appendChild(entry);
            })
            var elements = document.getElementsByTagName("li")
            for(var i=0;i<elements.length;i++){
                elements[i].style.color='blue';
                elements[i].style.margin='10px';
                elements[i].style.display='inline-block';
            }
            
            document.getElementById("submitbutton").disabled = true
            
        
        });

    }


    return (
      <div className="Header">
        <h3>Search</h3>
        <form>
        <LoaderButton
          block
          type="button"
          bsSize="large"
          id = "submitbutton"
          onClick={GetResults}
        >
         Thoughts
        </LoaderButton>
        </form>
        <ul id ="posts"></ul>
      </div>

   
    );
  }

