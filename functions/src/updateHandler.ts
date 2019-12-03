import * as functions from "firebase-functions";
import firebaseApp from "./firebaseConfig";
const db = firebaseApp.firestore();

export const updateLabel = functions.https.onRequest((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // FIXME: Make more secure later!
});
