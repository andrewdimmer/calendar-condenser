import {
  Button,
  createStyles,
  Dialog,
  IconButton,
  List,
  ListItem,
  Theme,
  Typography,
  withStyles,
  WithStyles
} from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import React, { Fragment } from "react";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2)
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

/**
 * PrivacyPolicy
 * A component that displays as a button until the user clicks it, then it displays the privacy policy.
 * Based on the Customized dialogs example from Material-UI
 */
const PrivacyPolicy: React.FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Privacy Policy
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Privacy Notice
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h4">Privacy Notice</Typography>
          <Typography variant="body1" gutterBottom>
            This privacy notice discloses the privacy practices for Calendar
            Condenser. This privacy notice applies solely to information
            collected by this website. It will notify you of the following:
          </Typography>

          <List component="ul">
            <ListItem key={1}>
              <Typography variant="body1" gutterBottom>
                What personally identifiable information is collected from you
                through the website, how it is used and with whom it may be
                shared.
              </Typography>
            </ListItem>
            <ListItem key={2}>
              <Typography variant="body1" gutterBottom>
                What choices are available to you regarding the use of your
                data.
              </Typography>
            </ListItem>
            <ListItem key={3}>
              <Typography variant="body1" gutterBottom>
                The security procedures in place to protect the misuse of your
                information.
              </Typography>
            </ListItem>
            <ListItem key={4}>
              <Typography variant="body1" gutterBottom>
                How you can correct any inaccuracies in the information.
              </Typography>
            </ListItem>
          </List>

          <Typography variant="h5">
            Information Collection, Use, and Sharing
          </Typography>
          <Typography variant="body1" gutterBottom>
            We are the sole owners of the information collected on this site. We
            only have access to/collect information that you voluntarily give us
            via connecting your Google Calendar. We will not sell or rent this
            information to anyone.
          </Typography>

          <Typography variant="body1" gutterBottom>
            We will use this information to provide the services provided in the
            terms section. We will not share your information with any third
            party outside of our organization.
          </Typography>

          <Typography variant="body1" gutterBottom>
            Unless you ask us not to, we may contact you via email in the future
            to tell you about specials, new products or services, or changes to
            this privacy policy.
          </Typography>

          <Typography variant="h5">Cookies</Typography>
          <Typography variant="body1" gutterBottom>
            We use "cookies" on this site. A cookie is a piece of data stored on
            a site visitor's hard drive to help us improve your access to our
            site and identify repeat visitors to our site. For instance, when we
            use a cookie to identify you, you would not have to log in a
            password more than once, thereby saving time while on our site.
            Cookies can also enable us to track and target the interests of our
            users to enhance the experience on our site. Usage of a cookie is in
            no way linked to any personally identifiable information on our
            site.
          </Typography>

          <Typography variant="h5">
            Your Access to and Control Over Information
          </Typography>
          <Typography variant="body1" gutterBottom>
            You may opt out of any future contacts from us at any time. You can
            do the following at any time by contacting us via the email address
            given on our website:
          </Typography>
          <List component="ul">
            <ListItem key={1}>
              <Typography variant="body1" gutterBottom>
                See what data we have about you, if any.
              </Typography>
            </ListItem>
            <ListItem key={2}>
              <Typography variant="body1" gutterBottom>
                Change/correct any data we have about you.
              </Typography>
            </ListItem>
            <ListItem key={3}>
              <Typography variant="body1" gutterBottom>
                Have us delete any data we have about you.
              </Typography>
            </ListItem>
            <ListItem key={4}>
              <Typography variant="body1" gutterBottom>
                Express any concern you have about our use of your data.
              </Typography>
            </ListItem>
          </List>

          <Typography variant="h5">
            Security
            <Typography variant="body1" gutterBottom>
              We take precautions to protect your information. When you submit
              sensitive information via the website, your information is
              protected both online and offline.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Wherever we collect sensitive information, that information is
              encrypted and transmitted to us in a secure way. You can verify
              this by looking for a lock icon in the address bar and looking for
              "https" at the beginning of the address of the Web page.
            </Typography>
            <Typography variant="body1" gutterBottom>
              While we use encryption to protect sensitive information
              transmitted online, we also protect your information offline. Only
              employees who need the information to perform a specific job (for
              example, billing or customer service) are granted access to
              personally identifiable information. The computers/servers in
              which we store personally identifiable information are kept in a
              secure environment.
            </Typography>
            <Typography variant="body1" gutterBottom>
              If you feel that we are not abiding by this privacy policy, you
              should contact us immediately via email at
              contactandrewd@gmail.com.
            </Typography>
          </Typography>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default PrivacyPolicy;
