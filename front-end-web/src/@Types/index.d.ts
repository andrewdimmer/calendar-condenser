import { calendar_v3 } from "googleapis";

/**
 * TODO: Add Documentation
 */
export declare interface State {
  busyMessage: string;
  notification: { message: string; open: boolean };
  userToken: string;
  calendars: calendar_v3.Schema$CalendarList | null;
  stage: stage;
  selectedCalendars: boolean[] | null;
}

/**
 * TODO: Add Documentation
 */
export declare interface Handlers {
  handleAuth: () => void;
  handleLogout: () => void;
  handleSelect: (index: number) => void;
  handleExport: (name: string) => void;
  handleChangeStage: (stage: number) => void;
}

/**
 * TODO: Add Documentation
 */
export declare interface Props {
  state: State;
  handlers: Handlers;
  classes: any;
}
