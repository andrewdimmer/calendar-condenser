import { Typography } from "@material-ui/core";
import React, { Fragment } from "react";
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
    </Fragment>
  );
};

export default SuccessPage;
