import {
  Button,
  TextField,
  Radio,
  RadioGroup,
  Typography,
  FormControlLabel
} from "@material-ui/core";
import React, { Fragment } from "react";
import { UserDatabse } from "../../@Types";

/**
 * TODO: Add Documentation
 */
let calendarName: string = "";

declare interface ExportProps {
  classes: any;
  handleExport: (calendarName: string) => void;
  handleChangeStage: (newStage: number) => void;
  userDatabase: UserDatabse.Document | null;
}

const ExportPage: React.FunctionComponent<ExportProps> = ({
  classes,
  handleExport,
  handleChangeStage,
  userDatabase
}) => {
  const [ownerID, setOwnerID] = React.useState(
    userDatabase && userDatabase.accounts.length > 0
      ? userDatabase.accounts[0].accountId
      : ""
  );
  return (
    <Fragment>
      <TextField
        variant="outlined"
        label="Calendar name"
        fullWidth={true}
        onChange={e => (calendarName = e.target.value)}
      ></TextField>
      <Typography variant="h5">Set Account Owner</Typography>
      <RadioGroup value={ownerID}>
        {userDatabase &&
          userDatabase.accounts.map(({ accountId, label }) => {
            return (
              <FormControlLabel
                value={accountId}
                label={label}
                control={<Radio />}
                onClick={() => {
                  setOwnerID(accountId);
                }}
              >
                <div>
                  <Typography variant="h5">{label}</Typography>
                </div>
              </FormControlLabel>
            );
          })}
      </RadioGroup>
      <Button
        variant="contained"
        color="primary"
        size="large"
        className={classes.button}
        onClick={function() {
          handleExport(calendarName);
          handleChangeStage(5);
        }}
      >
        Export
      </Button>
    </Fragment>
  );
};

export default ExportPage;
