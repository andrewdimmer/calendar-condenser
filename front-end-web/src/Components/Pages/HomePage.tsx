import { Button, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
/**
 * TODO: Add Documentation
 */
declare interface HomeProps {
  classes: any;
  handleChangeStage: (newStage: number) => void;
}
const HomePage: React.FunctionComponent<HomeProps> = ({
  classes,
  handleChangeStage
}) => {
  return (
    <Fragment>
      <Typography variant="h4"> What is Calendar Condenser?</Typography>
      <Typography variant="body1">
        Users with many calendars will be able to make them into one calendar to
        share with others, and control how much a person will be able to see.
        This will allow users to keep things organized and keep track of events
        and scheduling. Primary users will more than likely be Google Calendar
        users and users with multiple calendars.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        className={classes.button}
        onClick={function() {
          handleChangeStage(1);
        }}
      >
        Login
      </Button>
    </Fragment>
  );
};

export default HomePage;
