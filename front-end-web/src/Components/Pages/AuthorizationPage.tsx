import React, { Fragment } from "react";
import { Props } from "../../@Types";
import { makeStyles } from "@material-ui/styles";
import { Button, Typography } from "@material-ui/core";

declare interface AuthorizationProps {
  classes: any;
  handleAuth: () => void;
}

/**
 * TODO: Add Documentation
 */
const AuthorizationPage: React.FunctionComponent<AuthorizationProps> = ({
  classes,
  handleAuth
}) => {
  return (
    <Fragment>
      <Typography>
        Press this button to log in to the Authorization page
      </Typography>
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.button}
        onClick={handleAuth}
      >
        Login and Authorize
      </Button>
    </Fragment>
  );
};

export default AuthorizationPage;
