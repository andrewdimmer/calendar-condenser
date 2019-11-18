import React, { Fragment } from "react";
import { Props } from "../../@Types";
import { makeStyles } from "@material-ui/styles";
import firebase from "firebase";
import firebaseApp from "../../scripts/firebaseConfig";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
/**
 * TODO: Add Documentation
 */

declare interface LoginProps {
  classes: any;
  handleChangeStage: (stage: number) => void;
}
const LoginPage: React.FunctionComponent<LoginProps> = ({
  classes,
  handleChangeStage
}) => {
  const uiConfig = {
    signInFlow: "popup",
    signInSuccessUrl: "/signedIn",
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
