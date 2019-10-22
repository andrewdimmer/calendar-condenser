import { calendar_v3 } from "googleapis";
import axios from "axios";

/**
 * TODO: Add Documentation
 */
export function getAuthToken(userToken: string): Promise<any> {
  if (!userToken) {
    return axios(
      "https://us-central1-calendar-condenser-gcp.cloudfunctions.net/get_auth_url"
    )
      .then(url => {
        return url;
      })
      .catch(err => {
        return err;
      });
  } else {
    console.log("Already logged in!");
    return new Promise((resolve, reject) => {
      resolve("Already logged in!");
    });
  }
}

/**
 * TODO: Add Documentation
 */
export function getUserCalendars(
  userToken: string
): Promise<calendar_v3.Resource$Calendarlist | null> {
  //TODO
  return new Promise((resolve, reject) => {
    resolve(null);
  });
}

/**
 * TODO: Add Documentation
 */
export function createExportCalendar(
  userToken: string,
  calendars: calendar_v3.Resource$Calendarlist,
  name: string
): Promise<boolean> {
  //TODO
  return new Promise((resolve, reject) => {
    resolve(true);
  });
}
