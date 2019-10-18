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
      <Button variant="outlined" color="primary" className={classes.button}>
        Primary
      </Button>
    </Fragment>
  );
};

export default AuthorizationPage;
