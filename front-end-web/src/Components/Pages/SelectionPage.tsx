import { Checkbox, List, ListItem, Button } from "@material-ui/core";
import React, { Fragment } from "react";
import { Props } from "../../@Types";

/**
 * TODO: Add Documentation
 */
const SelectionPage: React.FunctionComponent<Props> = ({
  state,
  handlers,
  classes
}) => {
  return (
    <Fragment>
      {/*<List>
          {state.calendars.map((item: any, i: number) => {
            console.log(i);

            return (
              <Fragment key={i}>
                <ListItem
                  button
                  onClick={() => {
                    handlers.handleSelect(i);
                  }}
                >
                  <Checkbox checked={state.selectedCalendars[i]} />

                  {state.calendars[i].summary}
                </ListItem>
              </Fragment>
            );
          })}
        </List>*/}

      <Button
        size="large"
        color="primary"
        variant="contained"
        onClick={() => {
          handlers.handleChangeStage(3);
        }}
      >
        Next
      </Button>

      <br />
    </Fragment>
  );
};

export default SelectionPage;
