import { calendar_v3 } from "googleapis";
import ky from "ky";

/**
 * getAuthUrl
 * TODO: Add Documentation
 */
export function getAuthUrl(localhost: boolean): Promise<string> {
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
}

/**
 * getAuthToken
 * TODO: Add Documentation
 * @param oauthCode
 * @param userId
 * @param localhost
 */
export function getAuthToken(
  oauthCode: string,
  userId: string,
  localhost: boolean
): Promise<boolean> {
  return ky
    .post(
      "https://us-central1-calendar-condenser-gcp.cloudfunctions.net/get_token",
      { body: JSON.stringify({ localhost, oauthCode, userId }) }
    )
    .then(() => true)
    .catch(err => {
      console.log(err);
      return false;
    });
}

/**
 * getUserCalendars
 * TODO: Add Documentation
 */
export function getUserCalendars(
  userId: string
): Promise<{ [key: string]: calendar_v3.Schema$CalendarList } | null> {
  return ky
    .post(
      "https://us-central1-calendar-condenser-gcp.cloudfunctions.net/get_calendar_list",
      { body: userId }
    )
    .then(response => {
      return response
        .json()
        .then(data => {
          return data;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
    });
}

/**
 * createExportCalendar
 * TODO: Add Documentation
 */
export function createExportCalendar(
  userId: string,
  ownerAccountId: string,
  exportCalendarName: string
): Promise<boolean> {
  return ky
    .post(
      "https://us-central1-calendar-condenser-gcp.cloudfunctions.net/create_export_calendar",
      { body: JSON.stringify({ userId, ownerAccountId, exportCalendarName }) }
    )
    .then(response => {
      console.log(response);
      return true;
    })
    .catch(err => {
      console.log(err);
      return false;
    });
}
