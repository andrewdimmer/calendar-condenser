import * as functions from "firebase-functions";
import firebaseApp from "./firebaseConfig";
const db = firebaseApp.firestore();

export const getUser = functions.https.onRequest((request, response) => {
  const userid = request.body;
  db.collection("users")
    .doc(userid)
    .get()
    .then(user => {
      if (!user.exists) {
        const data = {
          userid: ""
        };
        db.collection("users")
          .doc(userid)
          .set(data)
          .then(() => {
            response.send(JSON.stringify(data));
          })
          .catch(err => {
            console.log(err);
            response.send("Unable to get user");
          });
      } else {
        response.send(JSON.stringify(user));
      }
    })
    .catch(err => {
      console.log(err);
      response.send("Unable to get user");
    });
});
