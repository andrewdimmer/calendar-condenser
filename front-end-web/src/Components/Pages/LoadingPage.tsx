import {
  CircularProgress,
  Typography,
  makeStyles,
  Theme,
  createStyles
} from "@material-ui/core";
import React from "react";
import { Props } from "../../@Types";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
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
    }
  })
);

/**
 * TODO: Add Documentation
 */
const Loading: React.FunctionComponent<Props> = ({
  state,
  handlers,
  classes
}) => {
  const classes2 = styles();

  return (
    <div className={classes2.loadingContainer}>
      <div className={classes2.loadingContent}>
        <CircularProgress color="primary" className={classes2.loadingCircle} />
        <Typography variant="h3">{state.busyMessage}</Typography>
      </div>
    </div>
  );
};

export default Loading;
