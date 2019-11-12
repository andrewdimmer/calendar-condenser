import * as functions from "firebase-functions";
import { google } from "googleapis";
import { getOauth2Client } from "./authHandlers";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const getCalendarList = functions.https.onRequest(
  async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*"); // TODO: Make more secure later!

    const oauth2Client = getOauth2Client("");
    console.log("refresh_token: ", request.body);
    oauth2Client.setCredentials({
      refresh_token: request.body
    });
    console.log("oauth2Client.credentials", oauth2Client.credentials);
    try {
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      /*const params: calendar_v3.Params$Resource$Calendarlist$List = {
        maxResults: 100
      };*/
      calendar.calendarList
        .list(/*params*/)
        .then(calendarListFulfilled => {
          console.log("Calendar Success!");
          response.send(calendarListFulfilled);
        })
        .catch((err: any) => {
          console.log("Calendar Error.");
          console.log(err);
          response.status(500).send("Calendar Error!");
        });
    } catch (err) {
      console.log("Calendar Error!");
      console.log(err);

      response.send(null);
    }
  }
);
