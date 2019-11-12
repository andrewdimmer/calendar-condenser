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
import {
  LoginPage,
  AuthorizationPage,
  ExportPage,
  SelectionPage,
  SuccessPage
} from "./";
import LoadingPage from "./LoadingPage";
import { styles } from "../../Styles";

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
  const [
    {
      busyMessage,
      notification,
      userToken,
      calendars,
      selectedCalendars,
      stage
    },
    setState
  ] = React.useState(initialState);
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
      busyMessage,
      notification,
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
      notification,
      userToken,
      calendars,
      selectedCalendars,
      stage
    };
    setState(gettingAuthState);
    getAuthToken(userToken)
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
    if (selectedCalendars) {
      const selected = selectedCalendars.splice(0, 0);
      selected[index] = !selected[index];
      const newState: State = {
        busyMessage,
        notification,
        userToken,
        calendars,
        selectedCalendars: selected,
        stage
      };
      setState(newState);
    } else {
      // MAYBE: Should this be different?
      const selectErrorState: State = {
        busyMessage,
        notification,
        userToken,
        calendars,
        selectedCalendars,
        stage
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
            notification,
            userToken: userTokenFromCookie,
            calendars,
            selectedCalendars,
            stage
          };
          setState(loadingAuthState);
          setTimeout(() => {
            const userTokenState: State = {
              busyMessage: "Getting Calendar List...",
              notification,
              userToken: userTokenFromCookie,
              calendars,
              selectedCalendars,
              stage
            };
            setState(userTokenState);
            getUserCalendars(userTokenFromCookie)
              .then(calendarList => {
                // if (calendarList) {
                setTimeout(() => {
                  const calendarState: State = {
                    busyMessage: "",
                    notification,
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
            notification,
            userToken,
            calendars,
            selectedCalendars,
            stage
          };
          setState(notLoadingAnymoreState);
          // TODO: Write a function to pick up where the user
        }
      }, 2000);
    }
  };

  const handleChangeStage = (stage: number) => {
    const newStageState: State = {
      busyMessage,
      notification,
      userToken,
      calendars,
      selectedCalendars,
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

  const classes = styles();
  return (
    <Fragment>
      {handleLoad()}
      {busyMessage && (
        <LoadingPage
          state={{
            busyMessage,
            notification,
            userToken,
            calendars,
            selectedCalendars,
            stage
          }}
          handlers={handlers}
          classes={classes}
        />
      )}
      {!busyMessage && (
        <Fragment>
          <NavBar
            state={{
              busyMessage,
              notification,
              userToken,
              calendars,
              selectedCalendars,
              stage
            }}
            handlers={handlers}
            classes={classes}
          />
          <Container className={classes.topMargined}>
            <Stepper activeStep={stage}>
              <Step>
                <StepLabel>Log In to Calendar Condenser</StepLabel>
              </Step>
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
            {stage === 0 && (
              <Fragment>
                <Typography variant="h3">Login</Typography>
                <LoginPage
                  state={{
                    busyMessage,
                    notification,
                    userToken,
                    calendars,
                    selectedCalendars,
                    stage
                  }}
                  handlers={handlers}
                  classes={classes}
                />
              </Fragment>
            )}
            {stage === 1 && (
              <Fragment>
                <Typography variant="h3">Authorization</Typography>
                <AuthorizationPage
                  state={{
                    busyMessage,
                    notification,
                    userToken,
                    calendars,
                    selectedCalendars,
                    stage
                  }}
                  handlers={handlers}
                  classes={classes}
                />
              </Fragment>
            )}
            {stage === 2 && (
              <Fragment>
                <Typography variant="h3">Selection</Typography>
                <SelectionPage
                  state={{
                    busyMessage,
                    notification,
                    userToken,
                    calendars,
                    selectedCalendars,
                    stage
                  }}
                  handlers={handlers}
                  classes={classes}
                />
              </Fragment>
            )}
            {stage === 3 && (
              <Fragment>
                <Typography variant="h3">Export</Typography>
                <ExportPage
                  classes={classes}
                  handleExport={handleExport}
                  handleChangeStage={handleChangeStage}
                />
              </Fragment>
            )}
            {stage === 4 && (
              <SuccessPage
                state={{
                  busyMessage,
                  notification,
                  userToken,
                  calendars,
                  selectedCalendars,
                  stage
                }}
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
