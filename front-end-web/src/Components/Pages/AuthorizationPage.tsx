import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  Typography,
  TextField
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React, { Fragment } from "react";
import { UserDatabse } from "../../@Types";

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
                  <EditIcon onClick={FormDialog}></EditIcon>
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

const FormDialog: React.FunctionComponent<any> = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <EditIcon color="primary" onClick={handleClickOpen}>
        Rename Label
      </EditIcon>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Rename Label</DialogTitle>
        <TextField value={value} onChange={v => setValue(v)}></TextField>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
