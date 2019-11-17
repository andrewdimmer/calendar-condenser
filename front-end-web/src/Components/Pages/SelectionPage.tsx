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
      {
        <List>
          {state.calendars &&
            state.calendars.items &&
            state.calendars.items.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  button
                  onClick={() => {
                    handlers.handleSelect(index);
                  }}
                >
                  <Checkbox
                    checked={
                      state.selectedCalendars && state.selectedCalendars[index]
                        ? state.selectedCalendars[index]
                        : false
                    }
                  />

                  {state.calendars && state.calendars.items
                    ? state.calendars.items[index].summary
                    : ""}
                </ListItem>
              );
            })}
        </List>
      }

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
