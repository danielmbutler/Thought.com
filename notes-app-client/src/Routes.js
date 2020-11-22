import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import Settings from "./containers/Settings";
import Search from "./containers/Search";
import Photos from "./containers/Photos";
import Profile from "./containers/Profile";
import ProfilePhoto from "./containers/ProfilePhoto";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
      <Login />
    </UnauthenticatedRoute>
    <AuthenticatedRoute exact path="/search">
      <Search />
    </AuthenticatedRoute>
    <AuthenticatedRoute exact path="/photos">
      <Photos />
    </AuthenticatedRoute>
    <UnauthenticatedRoute exact path="/signup">
      <Signup />
    </UnauthenticatedRoute>
    <AuthenticatedRoute exact path="/settings">
      <Settings />
    </AuthenticatedRoute>
    <AuthenticatedRoute exact path="/notes/new">
      <NewNote />
    </AuthenticatedRoute>
    <AuthenticatedRoute exact path="/profile/profilephoto">
      <ProfilePhoto />
    </AuthenticatedRoute>
    <AuthenticatedRoute exact path="/notes/:id">
      <Notes />
    </AuthenticatedRoute>
    <AuthenticatedRoute exact path="/profile/:id">
      <Profile />
    </AuthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
    <Route>
    <NotFound />
    </Route>
    </Switch>
  );
}