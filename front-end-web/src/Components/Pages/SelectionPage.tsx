import { Button, Checkbox, List, ListItem } from "@material-ui/core";
import { calendar_v3 } from "googleapis";
import React, { Fragment } from "react";
declare interface SelectionProps {
  classes: any;
  calendars: calendar_v3.Schema$CalendarList | null;
  handleSelect: (index: number) => void;
  selectedCalendars: boolean[] | null;
  handleChangeStage: (stage: number) => void;
}
/**
 * TODO: Add Documentation
 */
const SelectionPage: React.FunctionComponent<SelectionProps> = ({
  classes,
  calendars,
  handleSelect,
  selectedCalendars,
  handleChangeStage
}) => {
  return (
    <Fragment>
      {
        <List>
          {calendars &&
            calendars.items &&
            calendars.items.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  button
                  onClick={() => {
                    handleSelect(index);
                  }}
                >
                  <Checkbox
                    checked={
                      selectedCalendars && selectedCalendars[index]
                        ? selectedCalendars[index]
                        : false
                    }
                  />

                  {calendars && calendars.items
                    ? calendars.items[index].summary
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
        className={classes.button}
        onClick={() => {
          handleChangeStage(4);
        }}
      >
        Next
      </Button>

      <br />
    </Fragment>
  );
};

export default SelectionPage;
