import {
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography
} from "@material-ui/core";
import React, { Fragment } from "react";
import firebase, { User } from "firebase";
import {
  State,
  notificationTypes,
  UpdateState,
  CookieState,
  NotificationMessage
} from "../../@Types";
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
import { calendar_v3 } from "googleapis";

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
      stage: newStage ? newStage : stage
    };
    setState(newState);
    const cookieState: CookieState = {
      notification: newNotification ? newNotification : notification,
      currentUser: newCurrentUser !== undefined ? newCurrentUser : currentUser,
      stage: newStage ? newStage : stage
    };
    document.cookie = `state=${JSON.stringify(cookieState)}`;
  };

  /**
   * handleLogout
   * Clears the state data, logs out of firebase, and resets the state resume cookie.
   */
  const handleLogout = (): void => {
    firebase.auth().signOut();
    handleUpdateState({
      newNotification: {
        message: "Sign Out Successful",
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
      getAuthUrl(
        currentUser.uid,
        window.location.href.indexOf("localhost") >= 0
      )
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
      /*setTimeout(() => {
        if (window.location.href.indexOf("?mode=select") > -1) {
          handleUpdateState({ newBusyMessage: "", newStage: 1 });
        } else {
          const currentUser = firebase.auth().currentUser;
          if (currentUser) {
            console.log(getUserInfo(currentUser.uid));
          }

          const url = window.location.href;
          if (url.indexOf("auth") > -1) {
            const codeStartIndex = url.indexOf("?code=") + 6;
            const codeStopIndex = url.indexOf("&scope=");
            handleUpdateState({
              newBusyMessage: "Loading User Token...",
              newUserToken: currentUser ? currentUser.uid : ""
            });
            const oauthFromURL = url.substring(codeStartIndex, codeStopIndex);
            if (oauthFromURL.indexOf("4/") === 0) {
              getAuthToken(
                oauthFromURL,
                currentUser ? currentUser.uid : "",
                window.location.href.indexOf("localhost") >= 0
              )
                .then(successMessage => {
                  window.location.href = "../";
                })
                .catch(() => {
                  handleUpdateState({
                    newBusyMessage: "",
                    newNotification: {
                      message:
                        "Unable to get token at this time. Please try again later!",
                      type: "error",
                      open: true
                    }
                  });
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
                newCalendars: null,
                newSelectedCalendars: null,
                newStage: 2
              });
            }
          } else {
            handleUpdateState({
              newBusyMessage: "",
              newStage: currentUser ? 2 : 0
            });
          }
        }
      }, 2000); */
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
                <LoginPage
                  handleChangeStage={handleChangeStage}
                  classes={classes}
                />
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
