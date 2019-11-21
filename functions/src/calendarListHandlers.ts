import * as functions from "firebase-functions";
import { google } from "googleapis";
import { getOauth2Client } from "./authHandlers";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const getCalendarList = functions.https.onRequest(
  async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*"); // FIXME: Make more secure later!
    const oauth2Client = getOauth2Client("");
    oauth2Client.setCredentials({
      refresh_token: request.body
    });
    try {
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      /*const params: calendar_v3.Params$Resource$Calendarlist$List = {
        maxResults: 100
      };*/
      calendar.calendarList
        .list(/*params*/)
        .then(calendarListFulfilled => {
          response.send(calendarListFulfilled);
        })
        .catch((err: any) => {
          console.log(err);
          response.status(500).send("Calendar Error!");
        });
    } catch (err) {
      console.log(err);
      response.send(null);
    }
  }
);
