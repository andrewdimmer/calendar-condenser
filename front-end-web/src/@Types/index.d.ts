import { calendar_v3 } from "googleapis";

/**
 * TODO: Add Documentation
 */
export declare interface State {
  busyMessage: string;
  notification: {
    message: string;
    type: keyof typeof notificationTypes;
    open: boolean;
  };
  userToken: string;
  calendars: calendar_v3.Schema$CalendarList | null;
  stage: stage;
  selectedCalendars: boolean[] | null;
}

export declare enum notificationTypes {
  success,
  error,
  info,
  warning
}
