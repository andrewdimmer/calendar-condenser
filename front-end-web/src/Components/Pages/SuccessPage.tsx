import React, { Fragment } from "react";
import { Props } from "../../@Types";
import { Typography } from "@material-ui/core";
/**
 * TODO: Add Documentation
 */

var stage = 4;
const SuccessPage: React.FunctionComponent<Props> = ({
  state,
  handlers,
  classes
}) => {
  var successVal: string;
  if (document.cookie === "stage=4") {
    successVal = "Success!";
  } else {
    successVal = "Failure!";
  }
  return (
    <Fragment>
      <Typography> {successVal} </Typography>
      {
        //TODO
      }
    </Fragment>
  );
};

export default SuccessPage;
