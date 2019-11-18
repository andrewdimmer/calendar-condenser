import { makeStyles, createStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { THEME } from "./theme";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    padded: {
      padding: theme.spacing(2)
    },
    margined: {
      margin: theme.spacing(2)
    },
    topMargined: {
      marginTop: theme.spacing(2)
    },
    button: {
      margin: theme.spacing(2)
    },
    loadingContainer: {
      width: "100vw",
      height: "100vh",
      textAlign: "center"
    },
    loadingContent: {
      // TODO: Add Style Here to Center it Vertically
    },
    loadingCircle: {
      margin: "40px"
    },
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

export const theme = THEME;
