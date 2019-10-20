import { calendar_v3 } from "googleapis";

/**
 * TODO: Add Documentation
 */
export function getAuthToken(userToken: string): Promise<string> {
  //TODO
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * TODO: Add Documentation
 */
export function getUserCalendars(
  userToken: string
): Promise<calendar_v3.Resource$Calendarlist | null> {
  //TODO
  return new Promise((resolve, reject) => {
    reject(null);
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
