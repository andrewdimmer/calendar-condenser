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
    }
  })
);

export const theme = THEME;
