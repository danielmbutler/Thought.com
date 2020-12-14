import "./Profile.css";
import React from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { Auth } from "aws-amplify";

export default function Profile() {
    
    var path = window.location.pathname.replace("/profile/","");
    Auth.currentAuthenticatedUser().then((user) => {
        console.log('user email = ' + user.attributes.email);
      });

    var followed = false
    
    // get notes
    const requestOptionsProfile = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
    };


    fetch('', requestOptionsProfile)
    .then(res => res.json())
    .then(
        (result) => {
            //console.log(result);
            var data = result.Items
            //console.log(result.Items[0].friendlyusername)
            var list = document.getElementById('posts');

            //generate thought list
           
            data.forEach(function(obj,index){

                var d = new Date(obj.createdAt).toLocaleString()
               
                //console.log(d);
                var entry = document.createElement('li');
                var likesAmount = document.createElement('p');
                var likedByUsers = document.createElement('p');
                likedByUsers.id = ("LikedBy" + obj.noteId)
                likesAmount.id = ("LikesAmount" + obj.noteId)
                entry.setAttribute("id", obj.noteId);
                entry.setAttribute("likecount", obj.Likes);
                entry.setAttribute("userid", obj.userId);
                entry.setAttribute("noteid", obj.noteId);
                entry.setAttribute("LikedBy", obj.Likedby);
                entry.setAttribute("Content", obj.content);
                var Content      =    document.createTextNode("Thought:" + " " +obj.content);
                var Time         =    document.createTextNode("Created Time:" + " " + d);
                var linebreak    =    document.createElement("br");
                var linebreak2   =    document.createElement("br");
                var linebreak3   =    document.createElement("br");
                var linebreak4   =    document.createElement("br");
                var linkText     =    document.createTextNode("Username:" + " " + obj.friendlyusername);
                var likes        =    document.createTextNode("Likes:" + " " + obj.Likes);

                //If no Likes leave empty
                if (obj.Likedby){
                    var likedBy      =    document.createTextNode("Liked By:" + " " + obj.Likedby);
                } else {
                    var likedBy      =    document.createTextNode("Liked By:");
                }

                

                //LIKE BUTTON

                var Likebutton          = document.createElement("button");
                Likebutton.innerHTML    = "Like"
                Likebutton.id           = ("like" + obj.noteId)
                Likebutton.setAttribute('class', 'likebutton')
                
                Likebutton.onclick = function() { 
                    //variable declaration

                    var notelikes       = document.getElementById(this.id.replace("like",""));
                    var PostNoteId      = notelikes.getAttribute('NoteId')
                    var LikeCount       = notelikes.getAttribute('likecount')
                    var UserId          = notelikes.getAttribute('userid')
                    var Content         = notelikes.getAttribute('Content')
                    var LikeAmountId    = ("LikesAmount" + this.id.replace("like",""))
                    var LikedById       = ("LikedBy"     + this.id.replace("like",""))
                    var LikedBy         = notelikes.getAttribute('LikedBy')
                   // console.log(LikedBy);

                    //if user has already liked post disable like button

                    if(LikedBy.includes(Auth.user.attributes.email)){
                        
                        document.getElementById(this.id).disabled = true;
                        
                       
                    } else {
                        
                        notelikes.setAttribute("LikedBy", LikedBy + " " + Auth.user.attributes.email)
                        var NewLikedBy = notelikes.getAttribute('LikedBy')
                        var PostContent = notelikes.getAttribute('Content')
                        //console.log("this is the new likedby" + NewLikedBy)
                        //backend actions
                        const requestOptionsLike = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                "Userid"    : UserId, 
                                "NoteId"    : PostNoteId, 
                                "Action"    : "Like",
                                "LikedBy"   : Auth.user.attributes.email
                            })
                        };

                        fetch('', requestOptionsLike)
                        .then(res => res.json())
                        .then(
                            (result) => {
                                    //console.log(result);
                            });

                            // Notification post
                            const NotificationPost = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                 
                                    "UserID"        : UserId,
                                    "Notification"  : Auth.user.attributes.email + " " + "has liked your post " + "Post: " + PostContent,
                                    "Action"       : "ADD"
                                    
                                })
                            };
        
                            fetch('', NotificationPost)
                            .then(res => res.json())
                            .then(
                                (result) => {

                                })

                        //front end actions
                    
                        
                        LikeCount ++
                        notelikes.setAttribute("likecount", LikeCount );
                        
                        document.getElementById(LikeAmountId).textContent = ("Likes:" + " " + LikeCount);
                        
                        // add comma or not 
                         
                        if (document.getElementById(LikedById).textContent === "Liked By:" ) {
                            document.getElementById(LikedById).textContent = document.getElementById(LikedById).textContent + " " + Auth.user.attributes.email
                         } else {
                            document.getElementById(LikedById).textContent = document.getElementById(LikedById).textContent + "," + Auth.user.attributes.email
                         }
                        
                        document.getElementById(this.id).disabled = true;
                        document.getElementById(this.id.replace("like","unlike")).disabled = false;
                    }
                }    
                //UNLIKE Button

                var UnLikebutton       = document.createElement("button");
                UnLikebutton.innerHTML = "Unlike"
                UnLikebutton.id        = ("unlike" + obj.noteId)
                UnLikebutton.setAttribute('class', 'likebutton')
                
                UnLikebutton.onclick = function() { 
                    //variable declarartion
                    var notelikes       = document.getElementById(this.id.replace("unlike",""));
                    var LikeCount       = notelikes.getAttribute('likecount');
                    var PostNoteId      = notelikes.getAttribute('NoteId')
                    var LikeAmountId    = ("LikesAmount" + this.id.replace("unlike",""))
                    var UserId          = notelikes.getAttribute('userid')
                    var LikedById       = ("LikedBy"     + this.id.replace("unlike",""))
                    var LikedBy         = notelikes.getAttribute('LikedBy')
                    
                    // 0 likes disable button
                    if(LikeCount <=0){
                        document.getElementById(this.id).disabled = true;
                        document.getElementById(this.id.replace("unlike","like")).disabled = false;
                    } else {
                            //backend action
                            
                            //user has not liked post disable button

                            if(!LikedBy.includes(Auth.user.attributes.email)){
                                
                                document.getElementById(this.id).disabled = true;
                                document.getElementById(this.id.replace("unlike","like")).disabled = false;
                                
                            } else {

                               

                                const requestOptionsUnLike = {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ 
                                        "Userid"        : UserId, 
                                        "NoteId"        : PostNoteId, 
                                        "Action"        : "Unlike",
                                        "UnlikedBy"     : Auth.user.attributes.email
                                    })
                                };

                                fetch('', requestOptionsUnLike)
                                .then(res => res.json())
                                .then(
                                    (result) => {
                                            //console.log(result);
                                    });

                            //front end
                            //console.log(LikedBy)
                            var RemoveUser = LikedBy.replace(Auth.user.attributes.email,"")
                            notelikes.setAttribute("LikedBy", RemoveUser);
                            //console.log(notelikes.getAttribute('LikedBy'))
                            LikeCount --
                            notelikes.setAttribute("likecount", LikeCount );
                            document.getElementById(LikeAmountId).textContent = ("Likes:" + " " + LikeCount);
                           
                            //console.log(document.getElementById(LikedById).textContent)
                            //console.log(document.getElementById(LikedById).textContent === "Liked By:" + Auth.user.attributes.email)

                            //remove comment or not(if user is first user no need to remove comment)
                            if (document.getElementById(LikedById).textContent.includes("Liked By: " + Auth.user.attributes.email)) {
                                document.getElementById(LikedById).textContent = document.getElementById(LikedById).textContent.replace(Auth.user.attributes.email + ",", "");
                                document.getElementById(LikedById).textContent = document.getElementById(LikedById).textContent.replace(" "+Auth.user.attributes.email, "");
                             } else {
                                document.getElementById(LikedById).textContent = document.getElementById(LikedById).textContent.replace("," + Auth.user.attributes.email, "");
                             }
                            
                            document.getElementById(this.id).disabled = true;
                            document.getElementById(this.id.replace("unlike","like")).disabled = false;
                        }
                    }  
                }
                entry.appendChild(linkText);
                entry.appendChild(linebreak);
                entry.appendChild(Content);
                entry.appendChild(linebreak2);
                entry.appendChild(Time);
                entry.appendChild(linebreak3);
                likesAmount.appendChild(likes);
                entry.appendChild(likesAmount);
                likedByUsers.appendChild(likedBy)
                entry.appendChild(likedByUsers);
                entry.appendChild(linebreak4);
                entry.appendChild(Likebutton);
                entry.appendChild(UnLikebutton);
                list.appendChild(entry);
            })
            //thoughts styling
            var elements = document.getElementsByTagName("li")
            for(var i=0;i<elements.length;i++){
                elements[i].style.color='blue';
                elements[i].style.margin='10px';
                elements[i].style.listStyle='none';
            }

            // generate Profile header
           
            var email = result.Items[0].friendlyusername.toLowerCase();
            var Profilename   = email.substring(0, email.lastIndexOf("@"));
            var domain = email.substring(email.lastIndexOf("@") +1);
            var Header = document.getElementById('Header');
            var h = document.createElement("H1")                // Create a <h1> element
            var t = document.createTextNode(Profilename + "'s" + " " + "Profile");     // Create a text node
                h.appendChild(t);
            Header.appendChild(h);

            //list photos
            var imglink = path.split(':').join('%3A')
            //console.log(imglink);
            var photolist = document.getElementById('photos');
            var HeaderPhoto = document.getElementById('Header');
            data.forEach(function(obj,index){

                if(obj.attachment){
                    //console.log("" + imglink + "/" + obj.attachment);
                    var entry = document.createElement('li');
                    const anchor = document.createElement('a');
                    anchor.href = "" + imglink + "/" + obj.attachment;
                    var x = document.createElement("IMG");
                    x.src = "" + imglink + "/" + obj.attachment;
                    x.setAttribute("class", "IMG");
                    entry.setAttribute("class", "grid");
                    entry.appendChild(x);
                    entry.appendChild(anchor)
                    photolist.appendChild(entry);
                    }
            if(obj.attachment === "ProfilePic"){
                console.log(obj);
                var x = document.createElement("IMG");
                x.src = "" + obj.userId.split(':').join('%3A') + "/" + obj.attachment;
                x.setAttribute("class", "ProfilePic")
                var br = document.createElement("br");
                HeaderPhoto.appendChild(x);
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

               //follow button
        
        var Followerbutton = document.createElement("button");
        console.log(followed)

        const FollowingInfo = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
             
                "UserID" : path,
                
            })
        };
    
        

        fetch('', FollowingInfo)
        .then(res => res.json())
        .then(
            (result) => {
                
                var data = result.Items
                data.forEach(function(obj,index){
                    console.log(obj);
                    if(!obj.Followers){
                        followed = false
                        Followerbutton.innerHTML = "Follow"
                        return
                    }
                    if(obj.Followers.includes(Auth.user.attributes.email)){
                        followed = true;
                        Followerbutton.innerHTML = "UnFollow"
                    } else {
                        followed = false;
                        Followerbutton.innerHTML = "Follow"
                    }
                    
                })
            });

        
        Followerbutton.setAttribute('class', 'likebutton')
        var followlocation = document.getElementById('Follow');
        followlocation.appendChild(Followerbutton);

        followlocation.onclick = async function(){

                console.log(followed);
                if(followed === true){
                    
                    let LoggedInuser = await Auth.currentUserInfo();
            

                    const requestOptionsUnFollow = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                        
                            "FollowedUserID"        : path,
                            "UnFollowingUserID"     : LoggedInuser.id,
                            "Action"                : "unfollow",
                            "FriendlyName"          : Auth.user.attributes.email,
                            "UnFollowedUser"        : email,
                            
                        })
                    };
        
        
                    fetch('', requestOptionsUnFollow)
                    .then(res => res.json())
                    .then(
                        (result) => {
                                console.log(result);
                        });

                    followed = false
                    
                    const listItems = document.querySelectorAll('#Followers li');
                    for (let i = 0; i < listItems.length; i++) {
                      if (listItems[i].textContent.includes(Auth.user.attributes.email)){
                        listItems[i].textContent = listItems[i].textContent.replace(Auth.user.attributes.email,"");
                      };
                    }

                    Followerbutton.innerHTML = "Follow"

                } else {
                    let LoggedInuser = await Auth.currentUserInfo();
            

                    const requestOptionsFollow = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                         
                            "FollowedUserID"      : path,
                            "FollowingUserID"     : LoggedInuser.id,
                            "Action"              : "follow",
                            "FriendlyName"        : Auth.user.attributes.email,
                            "FollowedUser"        : email,
                            "Notification"        : Auth.user.attributes.email + " " + "has now followed you"
                            
                        })
                    };
                
                    
                    console.log(requestOptionsFollow)
                    
                    fetch('', requestOptionsFollow)
                    .then(res => res.json())
                    .then(
                        (result) => {
                                console.log(result);
                        });
            
                        followed = true
                        Followerbutton.innerHTML = "Unfollow"
                        var followerElement = document.createElement('li')
                        var followerElementText = document.createTextNode(Auth.user.attributes.email);
                        followerElement.appendChild(followerElementText)
                        var followersListDiv = document.getElementById('Followers')
                        followersListDiv.appendChild(followerElement)
            
                }
                
              

            
        }

        
      
    

            
    

        

        //load followers/following

        const requestOptionsAccountInfo = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
             
                "UserID" : path,
                
            })
        };

        fetch('', requestOptionsAccountInfo)
        .then(res => res.json())
        .then(
            (result) => {
                    //console.log(result);
                    var followersAmount
                    var followingAmount 
                    var userInfo = result.Items
                    userInfo.forEach(function(obj,index){
                        
                        //followers
                        if(obj.Followers){
                            followersAmount = obj.Followers.length
                            var followlist = document.createElement('Li')
                            var followers  = document.createTextNode(obj.Followers || "");
                            var followersList = document.getElementById('Followers')
                            followlist.appendChild(followers)
                            followersList.appendChild(followlist)
                        }
                        if(obj.Following){
                            followingAmount = obj.Following.length
                              //following
                            var followlist = document.createElement('Li')
                            var followers  = document.createTextNode(obj.Following || "");
                            var followersList = document.getElementById('Following')
                            followlist.appendChild(followers)
                            followersList.appendChild(followlist)
                        }
                        if(obj.Description){
                            console.log("Description is here")
                            var header      = document.getElementById('Header');
                            var Description = document.createElement('p')
                            Description.style.fontSize = "x-large"
                            Description.textContent = obj.Description
                            var Title = document.createElement('H2')
                            var TitleText = document.createTextNode("Description");
                            Title.appendChild(TitleText)
                            header.appendChild(Title)
                            header.appendChild(Description)
    
                        }
                        
                    });
                    console.log(followersAmount);
                    if(followersAmount){
                        var followersList = document.getElementById('followersTitle')
                        console.log(followersList)
                        followersList.textContent =  followersList.textContent + "("+ followersAmount +")"
                    }
                    if(followingAmount){
                        var followersList = document.getElementById('followingTitle')
                        console.log(followersList)
                        followersList.textContent =  followersList.textContent + "("+ followingAmount +")"
                    }
                    
                  
            });

            
        });

     
    
    return (
        <div>
          <h1 id="Header"> </h1>
          <h2 id = "Follow"></h2>
          <h2> Posts </h2>
          <ul id ="posts"></ul>
          <h2> Photos </h2>
          <ul id ="photos"></ul>
          <h2 id = "followersTitle" > Followers </h2>
          <ul id="Followers"> </ul>
          <h2 id = "followingTitle"> Following </h2>
          <ul id="Following"> </ul>
        </div>
  
     
      );
  };
         