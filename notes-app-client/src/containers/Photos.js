import "./Photos.css";
import React from "react";
import LoaderButton from "../components/LoaderButton";


export default function Photos() {

    function GetPhotos(){

        fetch("API")
        .then(res => res.json())
        .then(
          (result) => {
        
            //console.log(result.Items);
            var list = document.getElementById('photos');
            var data = result.body;
            console.log(data);
            data.forEach(function(obj,index){
                var entry = document.createElement('li');
                const anchor = document.createElement('a');
                anchor.href = "S3" + obj;
                var x = document.createElement("IMG");
                x.src = "S3" + obj;
                x.setAttribute("class", "IMG");
                entry.setAttribute("class", "grid");
                entry.appendChild(x);
                entry.appendChild(anchor)
                list.appendChild(entry);
            });
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
            document.getElementById("submitbutton").disabled = true
          });
    };


    
    return (
        <div className="Header">
          <h3>Photos</h3>
          <form>
          <LoaderButton
            block
            type="button"
            bsSize="large"
            id = "submitbutton"
            onClick={GetPhotos}
          >
           Load Photos
          </LoaderButton>
          </form>
          <ul id ="photos"></ul>
        </div>
  
     
      );
  };