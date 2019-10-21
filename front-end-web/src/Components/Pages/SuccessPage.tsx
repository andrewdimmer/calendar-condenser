import React, { Fragment } from "react";
import { Props } from "../../@Types";
import { Typography } from "@material-ui/core";
/**
 * TODO: Add Documentation
 */

const SuccessPage: React.FunctionComponent<Props> = ({
  state,
  handlers,
  classes
}) => {
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
