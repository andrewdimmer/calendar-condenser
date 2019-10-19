import { Checkbox, List, ListItem, Button } from "@material-ui/core";
import React, { Fragment } from "react";
import { Props } from "../../@Types";
import { getUserCalendars } from "../../scripts";

/**
 * TODO: Add Documentation
 */
interface SelectionProps {
  calendars: calendar[];
  selectedCalendars: boolean[];
  handleSelect: Function;
  handleSubmit: Function;
  setStage: Function;
}

const SelectionPage: React.FunctionComponent<SelectionProps> = ({
  calendars,
  selectedCalendars,
  handleSelect,
  handleSubmit,
  setStage
}) => {
  return (
    <Fragment>
      {
        <List>
          {calendars.map((item: calendar, i: number) => {
            console.log(i);

            return (
              <Fragment key={i}>
                <ListItem
                  button
                  onClick={() => {
                    handleSelect(i);
                  }}
                >
                  <Checkbox
                    checked={selectedCalendars[i]}
                    value={calendars[i].key}
                  />

                  {calendars[i].label}
                </ListItem>
              </Fragment>
            );
          })}

          <Button
            onClick={() => {
              handleSubmit();
            }}
          >
            Next
          </Button>

          <br />
        </List>
      }
    </Fragment>
  );
};

export default SelectionPage;
