import { calendar_v3 } from "googleapis";
import { State } from "../@Types";
import React from "react";
/**
 * TODO: Add Documentation
 */
export function getAuthToken(userToken: string): string {
  //TODO
  return "";
}

/**
 * TODO: Add Documentation
 */
export function getUserCalendars(
  userToken: string
): calendar_v3.Resource$Calendarlist | null {
  //TODO
  return null;
}

/**
 * TODO: Add Documentation
 */
export function createExportCalendar(
  userToken: string,
  calendars: calendar_v3.Resource$Calendarlist
): boolean {
  //TODO
  return false;
}

export function apiError(httpResponse: number) {
  if (httpResponse === 401) {
    const newState: State = {
      busyMessage: "",
      errorMessage: "Login is Required",
      hasUserToken: false,
      userToken: "",
      calendars: null
    };
    const [state, setState] = React.useState(newState);
    document.cookie = "stage=1";
  } else {
    const newState: State = {
      busyMessage: "",
      errorMessage: "Service Unavailable",
      hasUserToken: false,
      userToken: "",
      calendars: null
    };
    const [state, setState] = React.useState(newState);
  }
}
