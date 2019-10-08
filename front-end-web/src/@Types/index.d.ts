import { calendar_v3 } from "googleapis";

/**
 * TODO: Add Documentation
 */
export declare interface State {
  busyMessage: string;
  errorMessage: string;
  hasUserToken: boolean;
  userToken: string;
  calendars: calendar_v3.Resource$Calendarlist | null;
}

/**
 * TODO: Add Documentation
 */
export declare interface Handlers {
  // TODO
}

/**
 * TODO: Add Documentation
 */
export declare interface Props {
  state: State;
  handlers: Handlers;
  classes: any;
}
