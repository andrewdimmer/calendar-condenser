import * as functions from "firebase-functions";
import { google } from "googleapis";
import firebaseapp from "./firebaseConfig";
import nanoid = require("nanoid");

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const getAuthURL = functions.https.onRequest((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // FIXME: Make more secure later!
  try {
    const oauth2Client = getOauth2Client(request.body);

    const scopes = ["https://www.googleapis.com/auth/calendar"];

    const url = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",

      // If you only need one scope you can pass it as a string
      scope: scopes
    });
    response.status(200).send(url);
  } catch (err) {
    console.log(err);
    response
      .status(500)
      .send("Unable to get login URL at this time. Please try again later!");
  }
});

/**
 * getToken
 * Gets an OAuth Token from an OAuth Code
 */
export const getToken = functions.https.onRequest(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // FIXME: Make more secure later!
  try {
    const oauth2Client = getOauth2Client(request.body);
    let oauthCode = "",
      userId = "";
    try {
      const parsed = JSON.parse(request.body);
      oauthCode = parsed.oauthCode;
      userId = parsed.userId;
    } catch (err) {
      console.log(err);
    }
    if (userId && oauthCode) {
      const { tokens } = await oauth2Client.getToken(oauthCode);
      const { refresh_token } = tokens;
      const userDoc = firebaseapp
        .firestore()
        .collection("users")
        .doc(userId);
      userDoc.get().then(userData => {
        const data = userData.data();
        if (data) {
          const label = `Google Calendar Account ${data.accounts.length}`;
          const accountId = nanoid();
          data.accounts.push({ accountId, label });
          userDoc
            .set(data)
            .then(() => {
              const keysDoc = firebaseapp
                .firestore()
                .collection("keys")
                .doc(userId);
              keysDoc
                .get()
                .then(keyData => {
                  const data = keyData.data();
                  if (data) {
                    data.accounts[accountId] = {
                      accountId,
                      refresh_token,
                      valid: true
                    };
                    keysDoc
                      .set(data)
                      .then(() => {
                        response
                          .status(200)
                          .send("Account Authorized Successfully!");
                      })
                      .catch(err => {
                        console.log(err);
                        throw new Error(
                          "Unable to write key to keys collection in the database"
                        );
                      });
                  } else {
                    throw new Error(
                      "User's keys do not exist in the database."
                    );
                  }
                })
                .catch(err => {
                  console.log(err);
                  throw new Error("User does not exist in the database.");
                });
            })
            .catch(err => {
              console.log(err);
              throw new Error(
                "Unable to write label to user collection in the databse"
              );
            });
        } else {
          throw new Error("User does not exist in the database.");
        }
      });
    } else {
      throw new Error("Missing either userId or oauthCode");
    }
  } catch (err) {
    console.log(err);
    response
      .status(500)
      .send("Unable to get tokens at this time. Please try again later!");
  }
});

export const getOauth2Client = (body?: string) => {
  let localhost = null;
  try {
    if (body) {
      localhost = JSON.parse(body).localhost;
    }
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
