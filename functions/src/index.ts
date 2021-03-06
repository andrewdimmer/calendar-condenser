import * as functions from "firebase-functions";
import { getAuthURL, getToken } from "./authHandlers";
import { getUser } from "./databaseHandler";
import {
  getCalendarList,
  getCalendarEvents,
  createExportCalendar
} from "./calendarListHandlers";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// helloWorld exists as a debugging tool to make sure that the deployment is successful. TODO: REMOVE LATER!
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Auth functions
export const get_auth_url = getAuthURL;
export const get_token = getToken;

// Calendar List fuctions
export const get_calendar_list = getCalendarList;
export const create_export_calendar = createExportCalendar;

//Database functions
export const get_user = getUser;

// Other test functions
export const get_calendar_events = getCalendarEvents;
