import {
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography
} from "@material-ui/core";
import firebase, { User } from "firebase";
import React, { Fragment } from "react";
import {
  CookieState,
  NotificationMessage,
  State,
  UpdateState
} from "../../@Types";
import { getAuthToken, getAuthUrl } from "../../scripts";
import { getUserInfo } from "../../scripts/databaseScripts";
import { styles } from "../../Styles";
import { PrivacyPolicy } from "../Content";
import { NavBar, NotificationBar } from "../Layouts";
import {
  AuthorizationPage,
  ExportPage,
  HomePage,
  LoadingPage,
  LoginPage,
  SelectionPage,
  SuccessPage
} from "./";

/**
 * MainPage
 * TODO: Add Documentation
 */
const MainPage: React.FunctionComponent = () => {
  const initialState: State = {
    busyMessage: "Loading...",
    notification: { message: "", type: "info", open: false },
    currentUser: null,
    userDatabase: null,
    calendars: {},
    selectedCalendars: {},
    stage: 0
  };
  const [
    {
      busyMessage,
      notification,
      currentUser,
      userDatabase,
      calendars,
      selectedCalendars,
      stage
    },
    setState
  ] = React.useState(initialState);
  const [loaded, setLoaded] = React.useState(false);

  /**
   * handleUpdateState
   * Updates the react state baed off of the new values,
   * but keeps all of the values that are not being updated the same.
   * Also saves parts of the state to a cookie so the user can pick up
   * where they left off in the event that the page is refreshed or closes.
   * @param New State (note that it is of type State, but all fields are optional)
   *
   * TODO: Add to documentation
   */
  const handleUpdateState = ({
    newBusyMessage,
    newNotification,
    newCurrentUser,
    newUserDatabase,
    newCalendars,
    newSelectedCalendars,
    newStage
  }: UpdateState) => {
    const newState: State = {
      busyMessage: newBusyMessage !== undefined ? newBusyMessage : busyMessage,
      notification: newNotification ? newNotification : notification,
      currentUser: newCurrentUser !== undefined ? newCurrentUser : currentUser,
      userDatabase:
        newUserDatabase !== undefined ? newUserDatabase : userDatabase,
      calendars: newCalendars ? newCalendars : calendars,
      selectedCalendars: newSelectedCalendars
        ? newSelectedCalendars
        : selectedCalendars,
      stage: newStage !== undefined ? newStage : stage
    };
    setState(newState);
    const cookieState: CookieState = {
      notification: newNotification ? newNotification : notification,
      currentUserId:
        newCurrentUser !== undefined
          ? newCurrentUser
            ? newCurrentUser.uid
            : ""
          : currentUser
          ? currentUser.uid
          : "",
      stage: newStage !== undefined ? newStage : stage
    };
    document.cookie = `state=${JSON.stringify(cookieState)}`;
  };

  /**
   * handleLogin
   * Saves the currentUser and advances to the next page after a firebase login
   * Note: Refreshed the page, then restores state from cookie.
   */
  const handleLogin = (user: User) => {
    handleUpdateState({
      newBusyMessage: "Loading...",
      newNotification: {
        message: "Successfully Logged In",
        type: "success",
        open: true
      },
      newCurrentUser: user,
      newStage: 2
    });
    window.location.href = "../";
  };

  /**
   * handleLogout
   * Clears the state data, logs out of firebase, and resets the state resume cookie.
   */
  const handleLogout = (): void => {
    firebase.auth().signOut();
    handleUpdateState({
      newNotification: {
        message: "Successfully Logged Out",
        type: "success",
        open: true
      },
      newCurrentUser: null,
      newUserDatabase: null,
      newCalendars: {},
      newSelectedCalendars: {},
      newStage: 0
    });
  };

  /**
   * handleAuth
   * Gets the Google OAuth URL for a user to login and authorize access to Google Calendar.
   * Precondition: User must be logged in.
   * Note: Redirects the user off site, when the come back must resume state.
   */
  const handleAuth = () => {
    handleUpdateState({
      newBusyMessage: "Getting Auth URL..."
    });
    if (currentUser) {
      getAuthUrl(window.location.href.indexOf("localhost") >= 0)
        .then(url => {
          window.open(url, "_self");
        })
        .catch(err => {
          console.log(err);
          handleUpdateState({
            newBusyMessage: "",
            newNotification: {
              message:
                "Unable to get authorization url. Please try again later!",
              type: "error",
              open: true
            }
          });
        });
    } else {
      console.log(
        "User must be logged in before authorizing access to Google Calendar. (This error should never be thrown)"
      );
      handleChangeNotification({
        message:
          "Unable to authorize access to Google Calendar without being logged in.",
        type: "warning",
        open: true
      });
    }
  };

  /**
   * handleSelectCalendar
   * Toggles where a calendar should be included in the export or not.
   * @param accountId The accountId that the calendar list came from.
   * @param index The index of the calendar to update in the list.
   *
   * FIXME: Update to handle graular privacy control.
   */
  const handleSelectCalendar = (accountId: string, index: number) => {
    if (selectedCalendars) {
      const newSelectedCalendars = {} as { [key: string]: boolean[] };
      for (const key in selectedCalendars) {
        newSelectedCalendars[key] = selectedCalendars[accountId].splice(0);
      }
      newSelectedCalendars[accountId][index] = !newSelectedCalendars[accountId][
        index
      ];
      handleUpdateState({ newSelectedCalendars });
    } else {
      handleChangeNotification({
        message: "Oops! Something went wrong. Unable to select calendar.",
        type: "error",
        open: true
      });
    }
  };

  /**
   * handleExport
   * Create the export calendar based off of the settings specified.
   * @param name The name to give the export calendar.
   *
   * FIXME: Currently a stub
   * TODO: Update to actually do something.
   */
  const handleExport = (name: string) => {
    console.log(name);
  };

  // TODO: Add documentation
  // FIXME: The whole thing needs to be revamped
  const handleLoad = () => {
    if (!loaded) {
      setLoaded(true);
      setTimeout(() => {
        const url = window.location.href;
        if (url.indexOf("?mode=select") > -1) {
          // Just logging in, does not need to restore state from cookie.
          handleUpdateState({ newBusyMessage: "", newStage: 1 });
        } else if (url.indexOf("auth") > -1) {
          // Get the refresh token.
          // Note: Needs to restore from cookie to keep the userId correct.
          handleRestoreFromCookie(handleProcessAuthToken);
        } else {
          // Load data from restore cookie
          // After loading data from the cookie, get the database object
          // for the user, and the user's calendars.
          handleRestoreFromCookie();
        }
      }, 1);
    }
  };

  /**
   * handleProcessAuthToken
   * A helper method for handleLoad
   * Processes the return data from the OAuth login, and saves the token if the token exists.
   * Note that this method refreshes the page, and it needs to be restored from the cookie.
   * @param url The current URL of the page, which contains the OAuth return data
   */
  const handleProcessAuthToken = () => {
    const url = window.location.href;
    const currentUser = firebase.auth().currentUser;
    const codeStartIndex = url.indexOf("?code=") + 6;
    const codeStopIndex = url.indexOf("&scope=");
    handleUpdateState({
      newBusyMessage: "Getting Access Token..."
    });
    const oauthFromURL = url.substring(codeStartIndex, codeStopIndex);
    if (oauthFromURL.indexOf("4/") === 0) {
      getAuthToken(
        oauthFromURL,
        currentUser ? currentUser.uid : "",
        window.location.href.indexOf("localhost") >= 0
      )
        .then(() => {
          handleUpdateState({
            newNotification: {
              message:
                "Successfully Connected your Google Calendar Account to Calendar Condenser",
              type: "success",
              open: true
            },
            newCurrentUser: currentUser,
            newStage: 2
          });
          window.location.href = "../";
        })
        .catch(() => {
          handleUpdateState({
            newNotification: {
              message:
                "Unable to get token at this time. Please try again later!",
              type: "error",
              open: true
            },
            newCurrentUser: currentUser,
            newStage: 2
          });
          window.location.href = "../";
        });
    } else {
      handleUpdateState({
        newBusyMessage: "",
        newNotification: {
          message:
            "Unable to get token. This account may already be authorized.",
          type: "warning",
          open: true
        },
        newCurrentUser: currentUser,
        newStage: 2
      });
      window.location.href = "../";
    }
  };

  /**
   * handleRestoreFromCookie
   * A helper method for handleLoad
   * Restores the React state from the cookie.
   * Note: Only restores notifications, current user, and stage.
   * @param callback The function to run after the state is restored.
   * Note: The callback is only called if the user is logged in.
   */
  const handleRestoreFromCookie = (callback?: () => any) => {
    const cookie = document.cookie;
    if (cookie.indexOf("state=") < -1 || cookie.substring(6).length === 0) {
      // No cookie to restore from. Either the user has not been here or has logged out.
      // Just send the user to the home page.
      handleUpdateState({
        newBusyMessage: ""
      });
    } else {
      let cookieObject: CookieState | null;
      try {
        cookieObject = JSON.parse(cookie.substring(6));
      } catch (err) {
        console.log(err);
        cookieObject = null;
      }
      if (!cookieObject) {
        // Unable to read the cookie.
        // Just send the user to the home page.
        handleUpdateState({
          newBusyMessage: ""
        });
      } else {
        if (!cookieObject.currentUserId) {
          // The user is not logged in, or the cookie is out of date.
          // Restore just the notification and where the user was at.
          handleUpdateState({
            newBusyMessage: "",
            newNotification: cookieObject.notification,
            newStage: cookieObject.stage
          });
        } else {
          handleUpdateState({
            newBusyMessage: "Verifying Login Information",
            newNotification: cookieObject.notification,
            newStage: cookieObject.stage
          });
          const oneTimeLoadListener = firebase
            .auth()
            .onAuthStateChanged(user => {
              if (
                user &&
                cookieObject &&
                user.uid === cookieObject.currentUserId
              ) {
                // Restore everything, and get the database and calendars.
                handleUpdateState({
                  newBusyMessage: "",
                  newNotification: cookieObject.notification,
                  newCurrentUser: user,
                  newStage: cookieObject.stage
                });
                oneTimeLoadListener(); // Removes the listener, so that logout doesn't throw errors
                if (callback) {
                  callback();
                }
              } else {
                // The user has changed and the cookie is out of date.
                // Restore just the notification and where the user was at.
                handleUpdateState({
                  newBusyMessage: "",
                  newNotification: {
                    message:
                      "Login information has changed. Please login again.",
                    type: "warning",
                    open: true
                  },
                  newStage: 1
                });
                oneTimeLoadListener(); // Removes the listener, so that logout doesn't throw errors
              }
            });
        }
      }
    }
  };

  /**
   * handleGetCalendars
   * A helper method for handleLoad to get a list of a user's Google Calendars
   *
   * FIXME: Update to account for the fact that OAuth
   * tokens are now only stored in the database.
   * TODO: Add to documentation
   */
  /* const handleGetCalendars = (oauthToken: string) => {
    setTimeout(() => {
      handleUpdateState({
        newBusyMessage: "Getting Calendar List..."
      });
      getUserCalendars(oauthToken)
        .then(calendarList => {
          if (calendarList && calendarList.items) {
            setTimeout(() => {
              if (calendarList.items) {
                handleUpdateState({
                  newBusyMessage: "",
                  newNotification: {
                    message: "Successfully Retrieved Calendars",
                    type: "success",
                    open: true
                  },
                  newCalendars: calendarList,
                  newSelectedCalendars: calendarList.items.map(() => false, []),
                  newStage: 3
                });
              } else {
                throw new Error("This error should never occur!");
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
              userToken,
              calendars: null,
              selectedCalendars: null,
              stage: 2
            };
            setState(calendarErrorState);
          }, 1000);
        });
    }, 1000);
  }; */

  /**
   * handleChangeStage
   * A simple function to change just the stage in the state.
   * Calling this is basically the same as clicking a link.
   * @param newStage The stage to go to.
   */
  const handleChangeStage = (newStage: string | number) => {
    handleUpdateState({ newStage });
  };

  /**
   * handleChangeNotification
   * A simple funciton to just change the notificaiton in the state.
   * Mostly used to open or close notications, message changes are usually
   * updated via handleUpdateState as they change with other data.
   * @param newNotification The notification to set.
   */
  const handleChangeNotification = (newNotification: NotificationMessage) => {
    handleUpdateState({ newNotification });
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
            currentUser={currentUser}
            handleLogout={handleLogout}
            classes={classes}
          />
          <Container className={classes.topMargined}>
            <Stepper activeStep={typeof stage === "number" ? stage : 0}>
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
                <LoginPage classes={classes} handleLogin={handleLogin} />
              </Fragment>
            )}
            {stage === 2 && (
              <Fragment>
                <Typography variant="h3">Authorization</Typography>
                <AuthorizationPage
                  handleAuth={handleAuth}
                  classes={classes}
                  handleChangeStage={handleChangeStage}
                />
              </Fragment>
            )}
            {stage === 3 && (
              <Fragment>
                <Typography variant="h3">Selection</Typography>
                <SelectionPage
                  classes={classes}
                  userDatabase={userDatabase}
                  calendars={calendars}
                  selectedCalendars={selectedCalendars}
                  handleSelectCalendar={handleSelectCalendar}
                  handleChangeStage={handleChangeStage}
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
