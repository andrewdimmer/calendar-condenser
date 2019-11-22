import * as functions from "firebase-functions";
import { google, calendar_v3 } from "googleapis";
import { getOauth2Client } from "./authHandlers";
import firebaseapp from "./firebaseConfig";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
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

const getCalendarListHelper = async ({
  accountId,
  refresh_token
}: {
  accountId: string;
  refresh_token: string;
}): Promise<calendar_v3.Schema$CalendarList | null> => {
  // For each key, create an OAuth client
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
