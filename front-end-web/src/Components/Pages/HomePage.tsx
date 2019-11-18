import { Button, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
/**
 * TODO: Add Documentation
 */
declare interface HomeProps {
  classes: any;
  handleChangeStage: (stage: number) => void;
}
const HomePage: React.FunctionComponent<HomeProps> = ({
  classes,
  handleChangeStage
}) => {
  return (
    <Fragment>
      <Typography variant="h4"> What Calendar Condenser is </Typography>
      {
        //TODO
      }
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
