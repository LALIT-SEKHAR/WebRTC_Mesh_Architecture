import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "screens/Home";
import MeetRoom from "screens/MeetRoom";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:MeetId" component={MeetRoom} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
