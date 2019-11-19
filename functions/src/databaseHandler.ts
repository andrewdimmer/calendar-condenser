import * as functions from "firebase-functions";
import firebaseApp from "./firebaseConfig";
const db = firebaseApp.firestore();

export const getUser = functions.https.onRequest((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // TODO: Make more secure later!
  const userid = request.body;
  db.collection("users")
    .doc(userid)
    .get()
    .then(user => {
      if (!user.exists) {
        const data = {
          userid,
          accounts: [],
          exports: {}
        };
        db.collection("keys")
          .doc(userid)
          .set({ accounts: {} })
          .then(() => {
            console.log("keys");
          })
          .catch(err => {
            console.log(err);
          });
        db.collection("users")
          .doc(userid)
          .set(data)
          .then(() => {
            console.log(data);
            response.send(JSON.stringify(data));
          })
          .catch(err => {
            console.log(err);
            response.send("Unable to get user");
          });
      } else {
        response.send(JSON.stringify(user.data()));
      }
    })
    .catch(err => {
      console.log(err);
      response.send("Unable to get user");
    });
});
