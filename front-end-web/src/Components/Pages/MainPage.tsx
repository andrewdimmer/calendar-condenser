import {
  Container,
  createStyles,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  Theme,
  Typography
} from "@material-ui/core";
import React, { Fragment } from "react";
import { Handlers, State } from "../../@Types";
import { getAuthToken, getUserCalendars } from "../../scripts";
import { PrivacyPolicy } from "../Content";
import { NavBar } from "../Layouts";
import { AuthorizationPage, ExportPage, SelectionPage, SuccessPage } from "./";
import LoadingPage from "./LoadingPage";

/**
 * TODO: Add Documentation
 */
const MainPage: React.FunctionComponent = () => {
  const initialState: State = {
    busyMessage: "Loading...",
    notification: { message: "", open: false },
    userToken: "",
    calendars: null,
    stage: 0,
    selectedCalendars: null
  };
  const [state, setState] = React.useState(initialState);
  const [loaded, setLoaded] = React.useState(false);

  // TODO: Add better documentation
  /**
   * handleLogout
   * Runs when someone clicks the logout button from the nav bar
   * Clears the userToken from the state and the cookie.
   */
  const handleLogout = (): void => {
    document.cookie = "userToken=";
    const newState: State = {
      busyMessage: state.busyMessage,
      notification: state.notification,
      userToken: "",
      calendars: null,
      selectedCalendars: null,
      stage: 0
    };
    setState(newState);
  };

  /**
   * handleAuth
   * TODO: Add documentation
   */
  const handleAuth = () => {
    // MAYBE: Move all of the code below into onLoad?
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
      .then(url => {
        console.log(url);
        window.open(url.data, "_self");
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
    if (!loaded) {
      setTimeout(() => {
        setLoaded(true);
        const cookie = document.cookie;
        console.log("cookie", cookie);
        const userTokenFromCookie = cookie.substr(
          cookie.indexOf("userToken=") + 10
        );
        if (userTokenFromCookie) {
          const loadingAuthState: State = {
            busyMessage: "Loading User Token...",
            notification: state.notification,
            userToken: userTokenFromCookie,
            calendars: state.calendars,
            selectedCalendars: state.selectedCalendars,
            stage: state.stage
          };
          setState(loadingAuthState);
          setTimeout(() => {
            const userTokenState: State = {
              busyMessage: "Getting Calendar List...",
              notification: state.notification,
              userToken: userTokenFromCookie,
              calendars: state.calendars,
              selectedCalendars: state.selectedCalendars,
              stage: state.stage
            };
            setState(userTokenState);
            getUserCalendars(userTokenFromCookie)
              .then(calendarList => {
                // if (calendarList) {
                setTimeout(() => {
                  const calendarState: State = {
                    busyMessage: "",
                    notification: state.notification,
                    userToken: userTokenFromCookie,
                    calendars: calendarList,
                    selectedCalendars: [false].fill(false, 0, 100), // TODO: ADD MAP FUNCTION HERE
                    stage: 1
                  };
                  setState(calendarState);
                }, 1000);
                /* } else {
                  setTimeout(() => {
                    document.cookie = "userToken=";
                    const calendarErrorState: State = {
                      busyMessage: "",
                      notification: {
                        message:
                          "Unable to get calendars. Please try re-authorizing.",
                        open: true
                      },
                      userToken: "",
                      calendars: null,
                      selectedCalendars: null,
                      stage: 0
                    };
                    setState(calendarErrorState);
                  }, 1000);
                }*/
              })
              .catch(err => {
                console.log(err);
                // apiError(err);     // Need to add err handler here
              });
          }, 1000);
        } else {
          const notLoadingAnymoreState: State = {
            busyMessage: "",
            notification: state.notification,
            userToken: state.userToken,
            calendars: state.calendars,
            selectedCalendars: state.selectedCalendars,
            stage: state.stage
          };
          setState(notLoadingAnymoreState);
          // TODO: Write a function to pick up where the user
        }
      }, 2000);
    }
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

  const styles = makeStyles((theme: Theme) =>
    createStyles({
      topMargined: {
        marginTop: theme.spacing(2)
      }
    })
  );

  const classes = styles();
  return (
    <Fragment>
      {handleLoad()}
      {state.busyMessage && (
        <LoadingPage state={state} handlers={handlers} classes={classes} />
      )}
      {!state.busyMessage && (
        <Fragment>
          <NavBar state={state} handlers={handlers} classes={classes} />
          <Container className={classes.topMargined}>
            <Stepper activeStep={state.stage}>
              <Step>
                <StepLabel>Authorize Access</StepLabel>
              </Step>
              <Step>
                <StepLabel>Select Calendars</StepLabel>
              </Step>
              <Step>
                <StepLabel>Export and Share</StepLabel>
              </Step>
            </Stepper>
            {state.stage === 0 && (
              <Fragment>
                <Typography variant="h3">Authorization</Typography>
                <AuthorizationPage
                  state={state}
                  handlers={handlers}
                  classes={classes}
                />
              </Fragment>
            )}
            {state.stage === 1 && (
              <Fragment>
                <Typography variant="h3">Selection</Typography>
                <SelectionPage
                  state={state}
                  handlers={handlers}
                  classes={classes}
                />
              </Fragment>
            )}
            {state.stage === 2 && (
              <Fragment>
                <Typography variant="h3">Export</Typography>
                <ExportPage
                  state={state}
                  handlers={handlers}
                  classes={classes}
                />
              </Fragment>
            )}
            {state.stage === 3 && (
              <SuccessPage
                state={state}
                handlers={handlers}
                classes={classes}
              />
            )}
            <br />
            <PrivacyPolicy />
          </Container>
        </Fragment>
      )}
    </Fragment>
  );
};

export default MainPage;
