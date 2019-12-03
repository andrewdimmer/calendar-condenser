import { Button, TextField } from "@material-ui/core";
import React, { Fragment } from "react";

/**
 * TODO: Add Documentation
 */
let calendarName: string = "";

declare interface ExportProps {
  classes: any;
  handleExport: (calendarName: string, ownerAccountId: string) => void;
  handleChangeStage: (newStage: number) => void;
}

const ExportPage: React.FunctionComponent<ExportProps> = ({
  classes,
  handleExport,
  handleChangeStage
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
        className={classes.button}
        onClick={function() {
          const ownerId = ""; //FIXME: Resolve in merge with James' branch
          handleExport(calendarName, ownerId);
        }}
      >
        Export
      </Button>
    </Fragment>
  );
};

export default ExportPage;
