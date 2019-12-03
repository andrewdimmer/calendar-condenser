import {
  Button,
  Typography,
  TextField,
  Dialog,
  DialogContentText,
  DialogContent,
  DialogActions,
  DialogTitle
} from "@material-ui/core";
import React, { Fragment } from "react";
import firebase from "firebase";
import firebaseApp from "../../scripts/firebaseConfig";
import { NotificationMessage } from "../../@Types";
declare interface ProfileProps {
  openPage: boolean;
  handleToggleProfile: () => void;

  handleNewNotification: (NewNotification: NotificationMessage) => void;
}

/**
 * TODO: Add Documentation
 */

let newEmail: string = "";
let newPassword: string = "";
let newPasswordCheck: string = "";
let newName: string = "";
let currentName: string = "";
let currentEmail: string = "";

firebaseApp.auth();

const ProfilePage: React.FunctionComponent<ProfileProps> = ({
  openPage,
  handleToggleProfile,
  handleNewNotification
}) => {
  //const [open, setOpen] = React.useState(false);

  // const handleOpen = () => {
  //   setOpen(true);
  //};

  const handleChangeEmail = () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      currentUser.updateEmail(newEmail);
      handleNewNotification({
        message: "Email changed successfully.",
        type: "success",
        open: true
      });
    }
  };

  const handleChangePass = () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      currentUser.updatePassword(newPassword);
      handleNewNotification({
        message: "Password changed successfully",
        type: "success",
        open: true
      });
    }
  };
  const [openPass, setOpenPass] = React.useState(false);
  const handleOpenPasswordDia = () => {
    handleToggleProfile();
    setOpenPass(true);
  };
  const handleClosePasswordDia = () => {
    setOpenPass(false);
  };

  const handleNewPassword = () => {
    if (newPassword === newPasswordCheck) {
      handleChangePass();
      handleClosePasswordDia();
    } else {
      handleNewNotification({
        message: "Passwords do not match.",
        type: "error",
        open: true
      });
    }
  };

  const handleChangeName = () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      currentUser.updateProfile({ displayName: newName });
      handleNewNotification({
        message: "Display name changed successfully.",
        type: "success",
        open: true
      });
    }
  };
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    if (currentUser.displayName !== null) {
      currentName = currentUser.displayName;
    }
    if (currentUser.email !== null) {
      currentEmail = currentUser.email;
    }
  }
  return (
    <Fragment>
      <Dialog open={openPage} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">User Profile</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            margin="dense"
            helperText="Display Name"
            id="name"
            fullWidth
            defaultValue={currentName}
            onChange={e => (newName = e.target.value)}
          />
        </DialogContent>
        <Button onClick={handleChangeName} color="primary">
          Save new name
        </Button>
        <TextField
          margin="dense"
          helperText="Email"
          id="email"
          fullWidth
          type="email"
          defaultValue={currentEmail}
          onChange={e => (newEmail = e.target.value)}
        />
        <Button onClick={handleChangeEmail} color="primary">
          Save new email
        </Button>
        <DialogActions>
          <Button onClick={handleOpenPasswordDia} color="primary">
            Reset Password
          </Button>
          <Button onClick={handleToggleProfile} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openPass} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            margin="dense"
            helperText="Type a new password"
            id="passMain"
            fullWidth
            type="password"
            onChange={e => (newPassword = e.target.value)}
          />
        </DialogContent>
        <TextField
          margin="dense"
          helperText="Re-type the password"
          id="passCheck"
          fullWidth
          type="password"
          onChange={e => (newPasswordCheck = e.target.value)}
        />
        <Button onClick={handleNewPassword} color="primary">
          Save new password
        </Button>
        <DialogActions>
          <Button onClick={handleClosePasswordDia} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ProfilePage;
