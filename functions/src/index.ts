import * as functions from "firebase-functions";
import { getAuthURL } from "./authHandlers";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const get_auth_url = getAuthURL;
