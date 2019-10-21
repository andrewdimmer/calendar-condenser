import * as functions from "firebase-functions";
import { google } from "googleapis";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const getAuthURL = functions.https.onRequest((request, response) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    request.baseUrl
  );

  const scopes = ["https://www.googleapis.com/auth/calendar"];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",

    // If you only need one scope you can pass it as a string
    scope: scopes
  });

  response.send(url);
});
