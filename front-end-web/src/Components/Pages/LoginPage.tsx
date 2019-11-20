import firebase from "firebase";
import React, { Fragment } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebaseApp from "../../scripts/firebaseConfig";
import { getUserInfo } from "../../scripts/databaseScripts";
/**
 * TODO: Add Documentation
 */

declare interface LoginProps {
  classes: any;
  handleChangeStage: (newStage: number) => void;
}
const LoginPage: React.FunctionComponent<LoginProps> = ({
  classes,
  handleChangeStage
}) => {
  const uiConfig = {
    signInFlow: "popup",
    signInSuccessUrl: "",
    //Email as only provider
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
  };

  //MAYBE: Remove if not needed
  /*
  var ui = firebaseui.auth.AuthUI.getInstance();
  if (ui !== null) {
    ui.start("#firebaseui-auth-container", {
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
    });
  } else {
    ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", {
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
    });
  } */

  firebaseApp.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(getUserInfo(user.uid));
      handleChangeStage(2); //If we have a logged-in user, go to Calendar Auth page
    }
  });

  return (
    <Fragment>
      <div>
        <StyledFirebaseAuth //Use wrapper class to load widget
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    </Fragment>
  );
};
export default LoginPage;
