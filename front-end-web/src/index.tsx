import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { MainPage } from "./Components/Pages";
import { ThemeProvider } from "@material-ui/styles";
import { theme } from "./Styles";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <MainPage />
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
