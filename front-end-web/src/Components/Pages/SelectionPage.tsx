import {
  Button,
  Checkbox,
  List,
  ListItem,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@material-ui/core";
import { calendar_v3 } from "googleapis";
import React, { Fragment } from "react";
import { UserDatabse, PrivacyTypes } from "../../@Types";

declare interface SelectionProps {
  classes: any;
  userDatabase: UserDatabse.Document | null;
  calendars: { [key: string]: calendar_v3.Schema$CalendarList };
  selectedCalendars: { [key: string]: PrivacyTypes[] };
  handleSelectCalendar: (accountId: string, index: number) => void;
  handleChangeStage: (newStage: number) => void;
  handleGetCalendars: () => void;
}

/**
 * TODO: Add Documentation
 */
const SelectionPage: React.FunctionComponent<SelectionProps> = ({
  classes,
  userDatabase,
  calendars,
  selectedCalendars,
  handleSelectCalendar,
  handleChangeStage,
  handleGetCalendars
}) => {
  /**
   * parseAccounts
   * Converts the calendar's object to an array that can use the map
   * function to render.
   */
  const parseAccounts = () => {
    const calendarAccounts: {
      accountId: string;
      label: string;
      calendarList: calendar_v3.Schema$CalendarList;
    }[] = [];
    if (userDatabase) {
      let fetchingCalendars = false;
      for (const { accountId, label } of userDatabase.accounts) {
        if (calendars[accountId]) {
          calendarAccounts.push({
            accountId,
            label,
            calendarList: calendars[accountId]
          });
        } else {
          console.log(
            "It looks like calendars are not properly loaded... re-fetching calendars..."
          );
          if (!fetchingCalendars) {
            fetchingCalendars = true;
            handleGetCalendars();
          }
        }
      }
    }
    return calendarAccounts;
  };

  return (
    <Fragment>
      <List>
        {parseAccounts().map(({ accountId, label, calendarList }) => {
          return (
            <ListItem key={accountId}>
              <div>
                <Typography variant="h5">{label}</Typography>
                <List>
                  {calendarList.items &&
                    calendarList.items.map((item, index) => {
                      return (
                        <ListItem
                          key={`${accountId}_${index}`}
                          button
                          onClick={() => {
                            handleSelectCalendar(accountId, index);
                          }}
                        >
                        
                          <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Select</FormLabel>
        <RadioGroup aria-label="" name="" value={selectedCalendars[accountId] &&
                              selectedCalendars[accountId][index]
                                ? selectedCalendars[accountId][index]
                                : PrivacyTypes.None} onChange={handleSelectCalendar}>
          <FormControlLabel value= {PrivacyTypes.None} control={<Radio />} label="None" />
          <FormControlLabel value= {PrivacyTypes.Busy} control={<Radio />} label="Busy" />
          <FormControlLabel value={PrivacyTypes.TitleOnly} control={<Radio />} label="Title Only" />
          <FormControlLabel value={PrivacyTypes.FullInformation} control={<Radio />} label="Full Information" />
          <FormControlLabel
            value="disabled"
            control={<Radio />}
            label="(Disabled option)"
          />
        </RadioGroup>
      </FormControl>

                          {calendarList.items && calendarList.items[index]
                            ? calendarList.items[index].summary
                            : ""}
                        </ListItem>
                      );
                    })}
                </List>
              </div>
            </ListItem>
          );
        })}
      </List>

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
