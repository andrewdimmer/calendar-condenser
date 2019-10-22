import React, { Fragment } from "react";
import { Props } from "../../@Types";
import { Button, TextField } from "@material-ui/core";

/**
 * TODO: Add Documentation
 */
let calendarName: string = "";

const ExportPage: React.FunctionComponent<Props> = ({
  state,
  handlers,
  classes
}) => {
  return (
    <Fragment>
      <TextField
        variant="outlined"
        label="Calendar name"
        fullWidth={true}
        onChange={e => (calendarName = e.target.value)}
      ></TextField>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={function() {
          handlers.handleExport(calendarName);
          handlers.handleChangeStage(4);
        }}
      >
        Export
      </Button>
      {
        //TODO
      }
    </Fragment>
  );
};

export default ExportPage;
