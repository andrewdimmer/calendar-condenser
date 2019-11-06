import * as functions from "firebase-functions";
import { google } from "googleapis";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const getAuthURL = functions.https.onRequest((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // TODO: Make more secure later!
  try {
    console.log("body", request.body);
    console.log("body type:", typeof request.body);
    let localhost;
    try {
      localhost = JSON.parse(request.body).localhost;
    } catch (err) {
      console.log(err);
      localhost = null;
    }
    const oauth2Client = new google.auth.OAuth2(
      functions.config().oauth.client_id,
      functions.config().oauth.client_secret,
      localhost
        ? "http://localhost:3000/auth.html"
        : "https://calendar-condenser-gcp.firebaseapp.com/auth.html"
    );

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
 * Built by hand becuase Google's API was broken.
 */
export const getToken = functions.https.onRequest(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // TODO: Make more secure later!
  try {
    /*const oauth2Client = new google.auth.OAuth2(
    functions.config().oauth.client_id,
    functions.config().oauth.client_secret,
    "https://calendar-condenser-gcp.firebaseapp.com/auth.html"
  );

  const { tokens } = await oauth2Client.getToken(
    
  );*/
    console.log(request.baseUrl);
    response.send(`Not yet getting tokens!`);
  } catch (err) {
    console.log(err);
    response.send("Unable to get tokens at this time. Please try again later!");
  }
});
