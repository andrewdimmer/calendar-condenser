import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon
} from "@material-ui/core";
import { calendar_v3 } from "googleapis";
import React, { Fragment } from "react";
import { UserDatabse } from "../../@Types";
import EditIcon from "@material-ui/icons/Edit";

declare interface AuthorizationProps {
  classes: any;
  handleAuth: () => void;
  handleChangeStage: (newStage: string | number) => void;
  userDatabase: UserDatabse.Document | null;
}

/**
 * TODO: Add Documentation
 */
const AuthorizationPage: React.FunctionComponent<AuthorizationProps> = ({
  classes,
  handleAuth,
  handleChangeStage,
  userDatabase
}) => {
  return (
    <Fragment>
      <Typography>
        Press this button to log in to the Authorization page
      </Typography>
      <List>
        {userDatabase &&
          userDatabase.accounts.map(({ accountId, label }) => {
            return (
              <ListItem key={accountId}>
                <div>
                  <Typography variant="h5">{label}</Typography>
                </div>
              </ListItem>
            );
          })}
      </List>
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.button}
        onClick={handleAuth}
      >
        Login and Authorize
      </Button>
      <Button
        variant="contained"
        size="large"
        color="primary"
        className={classes.button}
        onClick={() => {
          handleChangeStage(3);
        }}
      >
        Next
      </Button>
    </Fragment>
  );
};

export default AuthorizationPage;
