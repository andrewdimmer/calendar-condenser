import React, { Fragment } from "react";
import { State, Handlers } from "../../@Types";
import { SelectionPage, AuthorizationPage, ExportPage, SuccessPage } from "./";
import { Container, Typography } from "@material-ui/core";
import { NavBar } from "../Layouts";
import LoadingPage from "./LoadingPage";
import { getAuthToken, getUserCalendars } from "../../scripts";

/**
 * TODO: Add Documentation
 */
const MainPage: React.FunctionComponent = () => {
  const initialState: State = {
    busyMessage: "Loading...",
    notification: { message: "", open: false },
    userToken: "",
    calendars: null,
    stage: 1,
    selectedCalendars: null
  };
  const [state, setState] = React.useState(initialState);

  // TODO: Add better documentation
  /**
   * handleLogout
   * Runs when someone clicks the logout button from the nav bar
   * Clears the userToken from the state and the cookie.
   */
  const handleLogout = (): void => {
    document.cookie = "";
    const newState: State = {
      busyMessage: state.busyMessage,
      notification: state.notification,
      userToken: "",
      calendars: null,
      selectedCalendars: null,
      stage: 1
    };
    setState(newState);
  };

  /**
   * handleAuth
   * TODO: Add documentation
   */
  const handleAuth = () => {
    const gettingAuthState: State = {
      busyMessage: "Getting Auth Token...",
      notification: state.notification,
      userToken: state.userToken,
      calendars: state.calendars,
      selectedCalendars: state.selectedCalendars,
      stage: state.stage
    };
    setState(gettingAuthState);
    getAuthToken(state.userToken)
      .then(userToken => {
        document.cookie = `userToken=${userToken}`;
        const userTokenState: State = {
          busyMessage: "Getting Calendar List...",
          notification: state.notification,
          userToken: userToken,
          calendars: state.calendars,
          selectedCalendars: state.selectedCalendars,
          stage: state.stage
        };
        setState(userTokenState);
        const calendars = getUserCalendars(state.userToken)
          .then(calendarList => {
            // TODO: ADD CODE HERE
            if (calendarList) {
              const calendarState: State = {
                busyMessage: "",
                notification: state.notification,
                userToken: userToken,
                calendars: calendarList,
                selectedCalendars: [false].fill(false, 0, 100), // TODO: ADD MAP FUNCTION HERE
                stage: 2
              };
              setState(calendarState);
            } else {
              const calendarErrorState: State = {
                busyMessage: "",
                notification: {
                  message: "Unable to get calendars. Please refresh the page.",
                  open: true
                },
                userToken: userToken,
                calendars: null,
                selectedCalendars: null,
                stage: 1
              };
              setState(calendarErrorState);
            }
          })
          .catch(err => {
            console.log(err);
            // apiError(err);     // Need to add err handler here
          });
      })
      .catch(err => {
        console.log(err);
        // apiError(err);     // Need to add err handler here
      });
  };

  // TODO: Add documentation
  const handleSelect = (index: number) => {
    if (state.selectedCalendars) {
      const selected = state.selectedCalendars.splice(0, 0);
      selected[index] = !selected[index];
      const newState: State = {
        busyMessage: state.busyMessage,
        notification: state.notification,
        userToken: state.userToken,
        calendars: state.calendars,
        selectedCalendars: selected,
        stage: state.stage
      };
      setState(newState);
    } else {
      const selectErrorState: State = {
        busyMessage: state.busyMessage,
        notification: state.notification,
        userToken: state.userToken,
        calendars: state.calendars,
        selectedCalendars: state.selectedCalendars,
        stage: state.stage
      };
      setState(selectErrorState);
    }
  };

  // TODO: Add documentation
  const handleExport = (name: string) => {
    console.log(name);
  };

  // TODO: Add documentation
  const handleLoad = () => {
    const cookie = document.cookie;
    // TODO: Write a function to pick up where the user
  };

  const handleChangeStage = (stage: number) => {
    const newStageState: State = {
      busyMessage: state.busyMessage,
      notification: state.notification,
      userToken: state.userToken,
      calendars: state.calendars,
      selectedCalendars: state.selectedCalendars,
      stage
    };
    setState(newStageState);
  };

  const handlers: Handlers = {
    handleAuth,
    handleChangeStage,
    handleExport,
    handleLogout,
    handleSelect
  };

  const classes = {
    // TODO
  };
  return (
    <Fragment>
      <NavBar state={state} handlers={handlers} classes={classes} />
      <Container>
        <Typography variant="h3">AuthorizationPage</Typography>
        <AuthorizationPage
          state={state}
          handlers={handlers}
          classes={classes}
        />
        <Typography variant="h3">SelectionPage</Typography>
        <SelectionPage state={state} handlers={handlers} classes={classes} />
        <Typography variant="h3">ExportPage</Typography>
        <ExportPage state={state} handlers={handlers} classes={classes} />
        <Typography variant="h3">SuccessPage</Typography>
        <SuccessPage state={state} handlers={handlers} classes={classes} />
        <Typography variant="h3">LoadingPage</Typography>
        <LoadingPage state={state} handlers={handlers} classes={classes} />
      </Container>
      {
        //TODO: Add logic to control when each item is displayed
      }
    </Fragment>
  );
};

export default MainPage;
