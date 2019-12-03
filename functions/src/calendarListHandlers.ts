import * as functions from "firebase-functions";
import { google, calendar_v3 } from "googleapis";
import { getOauth2Client } from "./authHandlers";
import firebaseapp from "./firebaseConfig";
import { ExportCalendar, SelectedCalendarShorthand } from "./@Types";

/**
 * getCalendarList
 * TODO: Add documentation
 */
export const getCalendarList = functions.https.onRequest(
  async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*"); // FIXME: Make more secure later!
    // Gets the user's keys from the database
    const userId = request.body;
    firebaseapp
      .firestore()
      .collection("keys")
      .doc(userId)
      .get()
      .then(keyData => {
        const data = keyData.data();
        if (data) {
          const accountIdsAndTokens = [];
          for (const accountId in data.accounts) {
            accountIdsAndTokens.push(data.accounts[accountId]);
          }
          Promise.all(
            accountIdsAndTokens.map(accountIdandToken => {
              return getCalendarListHelper(accountIdandToken);
            })
          )
            .then(resolvedPromises => {
              const returnData: {
                [key: string]: calendar_v3.Schema$CalendarList;
              } = {};
              console.log(data.accounts);
              console.log(resolvedPromises);
              let errorOccured = false;
              for (const accountId in data.accounts) {
                const accountData = resolvedPromises.shift();
                if (accountData) {
                  returnData[accountId] = accountData;
                } else {
                  console.log(
                    "Mismatch number of accounts and calendar lists!"
                  );
                  errorOccured = true;
                  break;
                }
              }
              if (errorOccured) {
                response
                  .status(500)
                  .send("Unable to get one or more calendars.");
              } else {
                response.status(200).send(JSON.stringify(returnData));
              }
            })
            .catch(err => {
              console.log(err);
              console.log(
                "One or more calendar request had a rejected promise."
              );
              response.status(500).send("Unable to get one or more calendars.");
            });
        } else {
          console.log("User's keys do not exist in the database.");
          response.status(500).send("Unable to get one or more calendars.");
        }
      })
      .catch(err => {
        console.log(err);
        console.log("User does not exist in the database.");
        response.status(500).send("Unable to get one or more calendars.");
      });
  }
);

/**
 * getCalendarListHelper
 * TODO: Add documentation
 * @param param0
 */
const getCalendarListHelper = async ({
  accountId,
  refresh_token
}: {
  accountId: string;
  refresh_token: string;
}): Promise<calendar_v3.Schema$CalendarList | null> => {
  // Create an OAuth client for the current key
  try {
    const oauth2Client = getOauth2Client("");
    oauth2Client.setCredentials({
      refresh_token
    });

    // After getting the OAuth client, get the calendar list
    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client
    });
    // MAYBE: Add params later? Possibly to handle paging?
    /*const params: calendar_v3.Params$Resource$Calendarlist$List = {
      maxResults: 100
    };*/
    return calendar.calendarList
      .list(/*params*/)
      .then(calendarList => calendarList.data)
      .catch(err => {
        console.log(err);
        console.log(`Unable to get calendar list for accountId ${accountId}`);
        return null;
      });
  } catch (err) {
    console.log(err);
    console.log(
      `Unable to create OAuth client for refresh token ${refresh_token}`
    );
    return null;
  }
};

/**
 * getCalendarEventsSingleCalendar
 * TODO: Add Documentation
 * @param param0
 * @param params
 */
const getCalendarEventsSingleCalendar = (
  { accountId, refresh_token }: { accountId: string; refresh_token: string },
  params: {
    calendarId: string;
    pageToken?: string;
    minStartTime?: Date;
    minUpdateTime?: Date;
  }
) => {
  // Create an OAuth client for the current key
  try {
    const oauth2Client = getOauth2Client("");
    oauth2Client.setCredentials({
      refresh_token
    });

    // After getting the OAuth client, get the events on the specified calendar
    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client
    });
    return calendar.events
      .list(params)
      .then(events => {
        return events.data;
      })
      .catch(err => {
        console.log(err);
        console.log(
          `Unable to get calendar ${params.calendarId} for accountId ${accountId}`
        );
        return null;
      });
  } catch (err) {
    console.log(err);
    console.log(
      `Unable to create OAuth client for refresh token ${refresh_token}`
    );
    return new Promise(() => {
      return null;
    });
  }
};

/**
 * getCalendarEvents
 * NOTE: This is a test function, and likely should not be used publically.
 */
export const getCalendarEvents = functions.https.onRequest(
  async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*"); // FIXME: Make more secure later!
    try {
      const jsonBody = JSON.parse(request.body);
      const userId = jsonBody.userId;
      const accountId = jsonBody.accountId;
      const calendarId = jsonBody.calendarId;
      if (!userId || !accountId || !calendarId) {
        throw new Error("Missing one or more required parameters.");
      }
      firebaseapp
        .firestore()
        .collection("keys")
        .doc(userId)
        .get()
        .then(keysDoc => {
          const keysData = keysDoc.data();
          if (keysData) {
            getCalendarEventsSingleCalendar(keysData.accounts[accountId], {
              calendarId
            })
              .then(calendarEventData => {
                if (calendarEventData) {
                  response.status(200).send(JSON.stringify(calendarEventData));
                } else {
                  console.log("Single calendar returned null");
                  response
                    .status(500)
                    .send("Unable to get one or more calendars.");
                }
              })
              .catch(err => {
                console.log(err);
                console.log("Error getting single calendar.");
                response
                  .status(500)
                  .send("Unable to get one or more calendars.");
              });
          } else {
            console.log("User's keys do not exist in the database.");
            response.status(500).send("Unable to get one or more calendars.");
          }
        })
        .catch(err => {
          console.log(err);
          console.log("User does not exist in the database.");
          response.status(500).send("Unable to get one or more calendars.");
        });
    } catch (err) {
      console.log(err);
      response.status(500).send("Missing userId, accountId and/or calendarID");
    }
  }
);

/**
 * createExportCalendar
 * TODO: Add Documentation
 */
export const createExportCalendar = functions.https.onRequest(
  async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*"); // FIXME: Make more secure later!
    try {
      // Process Input
      const jsonBody = JSON.parse(request.body);
      const userId = jsonBody.userId;
      const {
        calendarName,
        ownerAccountId,
        includedCalendars
      }: ExportCalendar = jsonBody.exportCalendar;
      if (!userId || !ownerAccountId || !calendarName) {
        throw new Error("Missing one or more required parameters.");
      }
      firebaseapp
        .firestore()
        .collection("keys")
        .doc(userId)
        .get()
        .then(keysDoc => {
          const keysData = keysDoc.data();
          if (keysData) {
            // Create the Google OAuth client
            const oauth2Client = getOauth2Client("");
            oauth2Client.setCredentials({
              refresh_token: keysData.accounts[ownerAccountId].refresh_token
            });
            const calendar = google.calendar({
              version: "v3",
              auth: oauth2Client
            });
            // Create the export calendar
            const params: calendar_v3.Params$Resource$Calendars$Insert = {
              requestBody: {
                description:
                  "This is an export calendar created by Calendar Condenser. " +
                  "Please do not edit this directly, aside from updating shareing settings. " +
                  "To manage this calendar, login to https://calendar-condenser-gcp.web.app to update the settings.",
                summary: calendarName
              }
            };
            calendar.calendars
              .insert(params)
              .then(createdCalendar => {
                // Save Created Calendar Information to Database
                const userDocRef = firebaseapp
                  .firestore()
                  .collection("users")
                  .doc(userId);
                userDocRef
                  .get()
                  .then(userDoc => {
                    const userData = userDoc.data();
                    const exportCalendarData = createdCalendar.data;
                    if (userData && exportCalendarData.id) {
                      userData.exports[exportCalendarData.id] = {
                        calendarName,
                        calendarId: exportCalendarData.id,
                        ownerAccountId,
                        includedCalendars
                      };
                      userDocRef.set(userData).then(() => {
                        console.log(
                          "Successfully created calendar and logged it in the database."
                        );
                        response
                          .status(200)
                          .send("Successfully created export calendar.");
                      });
                    } else {
                      console.log("User does not exist in the database.");
                      response
                        .status(500)
                        .send("Error creating export calendar.");
                    }
                  })
                  .catch(err => {
                    console.log(err);
                    console.log("User does not exist in the database.");
                    response
                      .status(500)
                      .send("Error creating export calendar.");
                  });
              })
              .catch(err => {
                console.log(err);
                console.log("Unable to create export calendar");
                response.status(500).send("Unable to create export calendar.");
              });
          } else {
            console.log("User's keys do not exist in the database.");
            response.status(500).send("Unable to get one or more calendars.");
          }
        })
        .catch(err => {
          console.log(err);
          console.log("User does not exist in the database.");
          response.status(500).send("Unable to get one or more calendars.");
        });
    } catch (err) {
      console.log(err);
      response
        .status(500)
        .send("Missing userId, accountId, and/or exportCalendarName");
    }
  }
);
