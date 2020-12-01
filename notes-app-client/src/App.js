import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./libs/errorLib";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell} from '@fortawesome/free-solid-svg-icons';
import { Button,  ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'




function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const history = useHistory();

  function removeFadeOut( el, speed ) {
    var seconds = speed/1000;
    el.style.transition = "opacity "+seconds+"s ease";

    el.style.opacity = 0;
    setTimeout(function() {
        el.parentNode.removeChild(el);
    }, speed);
}


  

  async function GetNotifications(){
    var loggedinuser = await Auth.currentUserInfo()
    return new Promise(function(resolve, reject) {    
  
      //console.log(loggedinuser.id);
      const requestOptionsAccountInfo = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
         
            "UserID" : loggedinuser.id,
            
        })
    };
  
    fetch('NOTIFICATION API', requestOptionsAccountInfo)
    .then(res => res.json())
    .then(
        (result) => {
                //console.log(result);
                var NotificationAmount
                var userInfo = result.Items
                userInfo.forEach(function(obj,index){
                          
                  if(obj.Notifications){

                    function clicked(name) {
                      console.log(`${name}`);

                      removeFadeOut(document.getElementById(name), 2000);
                      console.log(loggedinuser.id)

                      //api
                      const NotificationRemoval = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                         
                            "UserID"        : loggedinuser.id,
                            "Notifications" : name,
                            "Action"       : "REMOVE"
                            
                        })
                    };

                    fetch('NOTIFICATION API', NotificationRemoval)
                    .then(res => res.json())
                    .then(
                        (result) => {})}
        
                    var Bell = document.getElementById('Bell')
                    Bell.style.color="red"
                    console.log(obj.Notifications)
                    var elements = obj.Notifications.map(obj => (
                      <button class="dropdown-item" type="button" id={obj} onClick={() => clicked(obj)}>{obj}</button>
                      ))
                    resolve(elements) ;
                }
              
            });
  
        }
      );
             
          
          
      })

  }

  function RenderNotifications(){
   var NotificationsList = []
   
  GetNotifications().then((elements) => {
  console.log(elements);
  NotificationsList.push(elements);
  });
  
  
  
    return(
      <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
      <FontAwesomeIcon icon={faBell} id="Bell" />
      </Dropdown.Toggle>
      <Dropdown.Menu id ="DropDown">
        {NotificationsList}
      </Dropdown.Menu>
    </Dropdown>
      )
  }
    

  

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
      
      
     
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }
  
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);
    console.log("user has logged out");
    history.push("/login");
  }
  return (
    !isAuthenticating && (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Thought.com</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {isAuthenticated ? (
                <>
                  
                  <LinkContainer to="/settings">
                    <NavItem>Settings</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/search">
                    <NavItem>Feed</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/photos">
                    <NavItem>Photos</NavItem>
                  </LinkContainer>
                  <NavItem onClick={handleLogout}>Logout</NavItem>
                  <NavItem>{RenderNotifications()}</NavItem>
                </>
              
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
              
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider
          value={{ isAuthenticated, userHasAuthenticated }}
        >
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
