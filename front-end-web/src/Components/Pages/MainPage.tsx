import {
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography
} from "@material-ui/core";
import React, { Fragment } from "react";
import firebase from "firebase";
import { State, notificationTypes } from "../../@Types";
import { getAuthToken, getAuthUrl, getUserCalendars } from "../../scripts";
import { styles } from "../../Styles";
import { PrivacyPolicy } from "../Content";
import { NavBar, NotificationBar } from "../Layouts";
import { getUserInfo } from "../../scripts/databaseScripts";
import {
  AuthorizationPage,
  ExportPage,
  HomePage,
  LoginPage,
  SelectionPage,
  SuccessPage,
  LoadingPage
} from "./";

/**
 * TODO: Add Documentation
 */
const MainPage: React.FunctionComponent = () => {
  const initialState: State = {
    busyMessage: "Loading...",
    notification: { message: "", type: "info", open: false },
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
    document.cookie = "oauth=";
    firebase.auth().signOut();
    const newState: State = {
      busyMessage,
      notification: {
        message: "Sign Out Successful",
        type: "success",
        open: true
      },
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
    getAuthUrl(userToken, window.location.href.indexOf("localhost") >= 0)
      .then(url => {
        console.log(url);
        window.open(url, "_self");
      })
      .catch(err => {
        console.log(err);
        // apiError(err);     // Need to add err handler here
      });
  };

  // TODO: Add documentation
  const handleSelect = (index: number) => {
    if (selectedCalendars) {
      const selected = selectedCalendars.splice(0);
      console.log(selected);
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
      setLoaded(true);
      setTimeout(() => {
        if (window.location.href.indexOf("?mode=select") > -1) {
          const loginSelectState: State = {
            busyMessage: "",
            notification,
            userToken,
            calendars,
            selectedCalendars,
            stage: 1
          };
          setState(loginSelectState);
        } else {
          const currentUser = firebase.auth().currentUser;
          if (currentUser) {
            console.log(getUserInfo(currentUser.uid));
          }

          const url = window.location.href;
          if (url.indexOf("auth") > -1) {
            const codeStartIndex = url.indexOf("?code=") + 6;
            const codeStopIndex = url.indexOf("&scope=");
            const loadingAuthState: State = {
              busyMessage: "Loading User Token...",
              notification,
              userToken,
              calendars,
              selectedCalendars,
              stage
            };
            setState(loadingAuthState);
            const oauthFromURL = url.substring(codeStartIndex, codeStopIndex);
            if (oauthFromURL.indexOf("1/") === 0) {
              console.log("Found oauth code ", oauthFromURL);
              handleGetCalendars(oauthFromURL);
            } else if (oauthFromURL.indexOf("4/") === 0) {
              console.log("Found oauth code ", oauthFromURL);
              getAuthToken(
                oauthFromURL,
                window.location.href.indexOf("localhost") >= 0
              )
                .then(tokens => {
                  let tokenObject = JSON.parse(tokens);
                  console.log("tokenObject", tokenObject);
                  if (tokenObject && tokenObject.refresh_token) {
                    document.cookie = `oauth=${tokenObject.refresh_token}`;
                    handleGetCalendars(tokenObject.refresh_token);
                  } else {
                    const noRefreshTokenState: State = {
                      busyMessage: "",
                      notification: {
                        message: "No refesh token found.",
                        type: "error",
                        open: true
                      },
                      userToken,
                      calendars,
                      selectedCalendars,
                      stage
                    };
                    setState(noRefreshTokenState);
                    throw new Error("No refresh token");
                  }
                })
                .catch(err => {
                  console.log(err);
                  document.cookie = "oauth=";
                });
            } else {
              console.log("Unknown Token: ", oauthFromURL);
              console.log(
                "Likely the account is already authorized, or this is an access token."
              );
              const tokenErrorState: State = {
                busyMessage: "",
                notification: {
                  message:
                    "Unable to get token. Please logout and try re-authorizing.",
                  type: "error",
                  open: true
                },
                userToken: "",
                calendars: null,
                selectedCalendars: null,
                stage: 0
              };
              setState(tokenErrorState);
            }
          } else {
            const notLoadingAnymoreState: State = {
              busyMessage: "",
              notification,
              userToken,
              calendars,
              selectedCalendars,
              stage: currentUser ? 2 : 0
            };
            setState(notLoadingAnymoreState);
            // TODO: Write a function to pick up where the user
          }
        }
      }, 2000);
    }
  };

  /**
   * handleGetCalendars
   * A helper method for handleLoad
   */
  const handleGetCalendars = (oauthToken: string) => {
    setTimeout(() => {
      const userTokenState: State = {
        busyMessage: "Getting Calendar List...",
        notification,
        userToken: oauthToken,
        calendars,
        selectedCalendars,
        stage
      };
      setState(userTokenState);
      getUserCalendars(oauthToken)
        .then(calendarList => {
          if (calendarList && calendarList.items) {
            setTimeout(() => {
              if (calendarList.items) {
                const calendarState: State = {
                  busyMessage: "",
                  notification: {
                    message: "Successfully Retrieved Calendars",
                    type: "success",
                    open: true
                  },
                  userToken: oauthToken,
                  calendars: calendarList,
                  selectedCalendars: calendarList.items.map(() => false, []),
                  stage: 3
                };
                setState(calendarState);
              } else {
                console.log("Yike! This should never happen!");
              }
            }, 1000);
          } else {
            throw new Error("No CalendarList items returned!");
          }
        })
        .catch(err => {
          console.log(err);
          setTimeout(() => {
            const calendarErrorState: State = {
              busyMessage: "",
              notification: {
                message:
                  "Unable to get calendars. Please logout and try re-authorizing.",
                type: "error",
                open: true
              },
              userToken: oauthToken,
              calendars: null,
              selectedCalendars: null,
              stage: 2
            };
            setState(calendarErrorState);
          }, 1000);
        });
    }, 1000);
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

  const handleChangeNotification = (newNotification: {
    message: string;
    type: keyof typeof notificationTypes;
    open: boolean;
  }) => {
    const newNotificationState: State = {
      busyMessage,
      notification: newNotification,
      userToken,
      calendars,
      selectedCalendars,
      stage
    };
    setState(newNotificationState);
  };

  const classes = styles();
  return (
    <Fragment>
      <NotificationBar
        message={notification.message}
        type={notification.type}
        open={notification.open}
        update={handleChangeNotification}
      />
      {handleLoad()}
      {busyMessage && (
        <LoadingPage busyMessage={busyMessage} classes={classes} />
      )}
      {!busyMessage && (
        <Fragment>
          <NavBar
            userToken={userToken}
            handleLogout={handleLogout}
            classes={classes}
          />
          <Container className={classes.topMargined}>
            <Stepper activeStep={stage}>
              <Step>
                <StepLabel>Home</StepLabel>
              </Step>
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
                <Typography variant="h3">Home</Typography>
                <HomePage
                  handleChangeStage={handleChangeStage}
                  classes={classes}
                />
              </Fragment>
            )}
            {stage === 1 && (
              <Fragment>
                <Typography variant="h3">Login</Typography>
                <LoginPage
                  handleChangeStage={handleChangeStage}
                  classes={classes}
                />
              </Fragment>
            )}
            {stage === 2 && (
              <Fragment>
                <Typography variant="h3">Authorization</Typography>
                <AuthorizationPage handleAuth={handleAuth} classes={classes} />
              </Fragment>
            )}
            {stage === 3 && (
              <Fragment>
                <Typography variant="h3">Selection</Typography>
                <SelectionPage
                  calendars={calendars}
                  handleSelect={handleSelect}
                  selectedCalendars={selectedCalendars}
                  handleChangeStage={handleChangeStage}
                  classes={classes}
                />
              </Fragment>
            )}
            {stage === 4 && (
              <Fragment>
                <Typography variant="h3">Export</Typography>
                <ExportPage
                  classes={classes}
                  handleExport={handleExport}
                  handleChangeStage={handleChangeStage}
                />
              </Fragment>
            )}
            {stage === 5 && <SuccessPage classes={classes} />}
            <br />
            <PrivacyPolicy />
          </Container>
        </Fragment>
      )}
    </Fragment>
  );
};

export default MainPage;
