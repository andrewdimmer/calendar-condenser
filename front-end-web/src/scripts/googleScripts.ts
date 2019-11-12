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
): Promise<calendar_v3.Schema$CalendarList | null> {
  //TODO
  return ky
    .post(
      "https://us-central1-calendar-condenser-gcp.cloudfunctions.net/get_calendar_list",
      { body: userToken }
    )
    .then(response => {
      return response
        .json()
        .then((data: any) => {
          console.log(data);
          return data.data;
        })
        .catch((err: any) => {
          console.log(err);
          return null;
        });
    });
}

/**
 * TODO: Add Documentation
 */
export function createExportCalendar(
  userToken: string,
  calendars: calendar_v3.Schema$CalendarList,
  name: string
): Promise<boolean> {
  //TODO
  return new Promise((resolve, reject) => {
    resolve(true);
  });
}
