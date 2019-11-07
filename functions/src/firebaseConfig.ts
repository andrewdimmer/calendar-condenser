import * as functions from "firebase-functions";
import * as firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: functions.config().firebaseconfig.apikey,
  authDomain: functions.config().firebaseconfig.authdomain,
  databaseURL: functions.config().firebaseconfig.databaseurl,
  projectId: functions.config().firebaseconfig.projectid,
  storageBucket: functions.config().firebaseconfig.storagebucket,
  messagingSenderId: functions.config().firebaseconfig.messagingsenderid,
  appId: functions.config().firebaseconfig.appid
});

export default firebaseApp;
