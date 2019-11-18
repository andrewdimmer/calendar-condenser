import React, { Fragment } from "react";
import { Props } from "../../@Types";
import { Typography } from "@material-ui/core";
/**
 * TODO: Add Documentation
 */
declare interface SuccessProps {
  classes: any;
}
const SuccessPage: React.FunctionComponent<SuccessProps> = ({ classes }) => {
  return (
    <Fragment>
      <Typography variant="h4"> Success! </Typography>
      {
        //TODO
      }
    </Fragment>
  );
};

export default SuccessPage;
