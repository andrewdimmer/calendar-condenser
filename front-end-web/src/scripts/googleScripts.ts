import { calendar_v3 } from "googleapis";
import ky from "ky";

/**
 * TODO: Add Documentation
 */
export function getAuthUrl(
  userToken: string,
  localhost: boolean
): Promise<string> {
  if (!userToken) {
    return ky
      .post(
        "https://us-central1-calendar-condenser-gcp.cloudfunctions.net/get_auth_url",
        { body: JSON.stringify({ localhost }) }
      )
      .then(response => {
        return response
          .text()
          .then(text => {
            return text;
          })
          .catch(err => {
            console.log(err);
            return "";
          });
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

export function getAuthToken(
  oauthCode: string,
  userId: string,
  localhost: boolean
): Promise<string> {
  return ky
    .post(
      "https://us-central1-calendar-condenser-gcp.cloudfunctions.net/get_token",
      { body: JSON.stringify({ localhost, oauthCode, userId }) }
    )
    .then(tokens => {
    .catch(err => {
      const tokenText = tokens
        .text()
        .then(text => text)
        .catch(err => {
          console.log(err);
          return "";
        });
      return tokenText;
    })
    .catch(err => {
      console.log(err);
      return new Promise((resolve, reject) => {
        reject("");
      });
    });
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
