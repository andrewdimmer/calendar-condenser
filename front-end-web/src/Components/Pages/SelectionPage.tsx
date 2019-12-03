import {
  Button,
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
import { UserDatabase, PrivacyLevel } from "../../@Types";

declare interface SelectionProps {
  classes: any;
  userDatabase: UserDatabase.Document | null;
  calendars: { [key: string]: calendar_v3.Schema$CalendarList };
  selectedCalendars: { [key: string]: PrivacyLevel[] };
  handleSelectCalendar: (
    accountId: string,
    index: number,
    privacyLevel: PrivacyLevel
  ) => void;
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
                        <ListItem key={`${accountId}_${index}`}>
                          <div>
                            <Typography variant="h6">
                              {calendarList.items && calendarList.items[index]
                                ? calendarList.items[index].summary
                                : ""}
                            </Typography>
                            <FormControl
                              component="fieldset"
                              className={classes.formControl}
                            >
                              <FormLabel component="legend">
                                Select Privacy Level
                              </FormLabel>
                              <RadioGroup
                                aria-label=""
                                name=""
                                value={
                                  selectedCalendars[accountId] &&
                                  selectedCalendars[accountId][index]
                                    ? selectedCalendars[accountId][index]
                                    : "none"
                                }
                              >
                                <div>
                                  <FormControlLabel
                                    value={"none"}
                                    control={<Radio />}
                                    label="none"
                                    onClick={() => {
                                      handleSelectCalendar(
                                        accountId,
                                        index,
                                        "none"
                                      );
                                    }}
                                  />
                                  <FormControlLabel
                                    value={"busy"}
                                    control={<Radio />}
                                    label="busy"
                                    onClick={() => {
                                      handleSelectCalendar(
                                        accountId,
                                        index,
                                        "busy"
                                      );
                                    }}
                                  />
                                  <FormControlLabel
                                    value={"title"}
                                    control={<Radio />}
                                    label="Title Only"
                                    onClick={() => {
                                      handleSelectCalendar(
                                        accountId,
                                        index,
                                        "title"
                                      );
                                    }}
                                  />
                                  <FormControlLabel
                                    value={"full"}
                                    control={<Radio />}
                                    label="Full Information"
                                    onClick={() => {
                                      handleSelectCalendar(
                                        accountId,
                                        index,
                                        "full"
                                      );
                                    }}
                                  />
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </div>
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
