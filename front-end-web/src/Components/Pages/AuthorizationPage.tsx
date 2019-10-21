import React, { Fragment } from "react";
import { Props } from "../../@Types";
import { makeStyles } from "@material-ui/styles";
import { Button, Typography } from "@material-ui/core";

/**
 * TODO: Add Documentation
 */
const AuthorizationPage: React.FunctionComponent<Props> = ({
  state,
  handlers,
  classes
}) => {
  const useStyles = makeStyles(theme => ({
    button: {
      margin: "8px"
    },
    input: {
      display: "none"
    }
  }));
  const classes2 = useStyles();
  return (
    <Fragment>
      <Typography>
        Press this button to log in to the Authorization page
      </Typography>
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes2.button}
        onClick={handlers.handleAuth}
      >
        Login and Authorize
      </Button>
    </Fragment>
  );
};

export default AuthorizationPage;
