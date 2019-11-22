import { Button, Typography } from "@material-ui/core";
import React, { Fragment } from "react";

declare interface AuthorizationProps {
  classes: any;
  handleAuth: () => void;
  handleChangeStage: (newStage: string | number) => void;
}

/**
 * TODO: Add Documentation
 */
const AuthorizationPage: React.FunctionComponent<AuthorizationProps> = ({
  classes,
  handleAuth,
  handleChangeStage
}) => {
  return (
    <Fragment>
      <Typography>
        Press this button to log in to the Authorization page
      </Typography>
      {/* TODO: List Calendars that are already authorized here! */}
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.button}
        onClick={handleAuth}
      >
        Login and Authorize
      </Button>
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.button}
        onClick={() => {
          handleChangeStage(3);
        }}
      >
        Next
      </Button>
    </Fragment>
  );
};

export default AuthorizationPage;
