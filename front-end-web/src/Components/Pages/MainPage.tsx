import React, { Fragment } from "react";
import { State, Handlers } from "../../@Types";
import { SelectionPage, AuthorizationPage, ExportPage, SuccessPage } from "./";
import { Container, Typography } from "@material-ui/core";
import { NavBar } from "../Layouts";
import LoadingPage from "./LoadingPage";

/**
 * TODO: Add Documentation
 */
const MainPage: React.FunctionComponent = () => {
  const initialState: State = {
    busyMessage: "Loading...",
    errorMessage: "",
    hasUserToken: false,
    userToken: "",
    calendars: null
  };
  const [state, setState] = React.useState(initialState);
  const handlers: Handlers = {
    // TODO
  };
  const classes = {
    // TODO
  };
  return (
    <Fragment>
      <NavBar state={state} handlers={handlers} classes={classes} />
      <Container>
        <Typography variant="subtitle1">AuthorizationPage</Typography>
        <AuthorizationPage
          state={state}
          handlers={handlers}
          classes={classes}
        />
        <Typography variant="subtitle1">SelectionPage</Typography>
        <SelectionPage state={state} handlers={handlers} classes={classes} />
        <Typography variant="subtitle1">ExportPage</Typography>
        <ExportPage state={state} handlers={handlers} classes={classes} />
        <Typography variant="subtitle1">SuccessPage</Typography>
        <SuccessPage state={state} handlers={handlers} classes={classes} />
        <Typography variant="subtitle1">LoadingPage</Typography>
        <LoadingPage state={state} handlers={handlers} classes={classes} />
      </Container>
      {
        //TODO: Add logic to control when each item is displayed
      }
    </Fragment>
  );
};

export default MainPage;
