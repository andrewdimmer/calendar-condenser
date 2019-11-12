import React, { Fragment } from "react";
import { Button, TextField } from "@material-ui/core";

/**
 * TODO: Add Documentation
 */
let calendarName: string = "";

declare interface ExportProps {
  classes: any;
  handleExport: (calendarName: string) => void;
  handleChangeStage: (stage: number) => void;
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
        onClick={function() {
          handleExport(calendarName);
          handleChangeStage(4);
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
