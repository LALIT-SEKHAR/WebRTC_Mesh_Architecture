import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "Routes";
import { AppContextProvider } from "hooks";

ReactDOM.render(
  <AppContextProvider>
    <Routes />
  </AppContextProvider>,
  document.getElementById("root")
);
