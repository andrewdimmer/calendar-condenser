import * as functions from "firebase-functions";
import { google } from "googleapis";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const getAuthURL = functions.https.onRequest((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // TODO: Make more secure later!
  try {
    const oauth2Client = getOauth2Client(request.body);

    const scopes = ["https://www.googleapis.com/auth/calendar"];

    const url = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",

      // If you only need one scope you can pass it as a string
      scope: scopes
    });
    response.send(url);
  } catch (err) {
    console.log(err);
    response.send(
      "Unable to get login URL at this time. Please try again later!"
    );
  }
});

/**
 * getToken
 * Gets an OAuth Token from an OAuth Code
 */
export const getToken = functions.https.onRequest(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // TODO: Make more secure later!
  try {
    const oauth2Client = getOauth2Client(request.body);
    let oauthCode;
    try {
      oauthCode = JSON.parse(request.body).oauthCode;
    } catch (err) {
      console.log(err);
      oauthCode = "";
    }
    const { tokens } = await oauth2Client.getToken(oauthCode);
    console.log(JSON.stringify(tokens));
    response.send(JSON.stringify(tokens));
  } catch (err) {
    console.log(err);
    response.send("Unable to get tokens at this time. Please try again later!");
  }
});

export const getOauth2Client = (body: string) => {
  let localhost;
  try {
    localhost = JSON.parse(body).localhost;
  } catch (err) {
    console.log(err);
    localhost = null;
  }
  return new google.auth.OAuth2(
    functions.config().oauth.client_id,
    functions.config().oauth.client_secret,
    localhost
      ? "http://localhost:3000/auth"
      : "https://calendar-condenser-gcp.firebaseapp.com/auth"
  );
};
