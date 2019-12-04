import * as functions from "firebase-functions";
import firebaseApp from "./firebaseConfig";
const db = firebaseApp.firestore();

export const getUser = functions.https.onRequest((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // FIXME: Make more secure later!
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

export const editLabel = functions.https.onRequest((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // FIXME: Make more secure later!
  const userid = request.body;
  db.collection("users")
    .doc(userid)
    .get()
    .then(user => {
      let userId = "",
        label = "",
        accountId = "";
      try {
        const parsed = JSON.parse(request.body);
        userId = parsed.userId;
        label = parsed.label;
        accountId = parsed.accountId;
      } catch (err) {
        console.log(err);
      }
      const userData = user.data();
      if (userId && accountId && label && userData) {
        for (let i = 0; i < userData.accounts.length; i++) {
          if (userData.accounts[i].accountId === accountId)
            userData.accounts[i].accountId.label = label;
        }
      } else {
        response.status(500).send("Missing either userId or accountId");
      }
    })
    .catch(err => {
      console.log(err);
      response.send("Unable to get user");
    });
});
