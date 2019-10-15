import React, { Fragment } from "react";
import { Props } from "../../@Types";
import { Button, TextField } from "@material-ui/core";

/**
 * TODO: Add Documentation
 */

const ExportPage: React.FunctionComponent<Props> = ({
  state,
  handlers,
  classes
}) => {
  document.cookie = "stage=4";
  return (
    <Fragment>
      <Button
        variant="contained"
        onClick={function() {
          document.cookie = "stage=4";
        }}
      >
        Export
      </Button>
      <TextField variant="standard" label="Calendar name"></TextField>
      {
        //TODO
      }
    </Fragment>
  );
};

export default ExportPage;
