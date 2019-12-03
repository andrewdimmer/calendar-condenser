import { calendar_v3 } from "googleapis";
import { User } from "firebase";

/**
 * TODO: Add Documentation
 */
export declare interface State {
  busyMessage: string;
  notification: NotificationMessage;
  currentUser: User | null;
  userDatabase: UserDatabse.Document | null;
  calendars: { [key: string]: calendar_v3.Schema$CalendarList };
  selectedCalendars: { [key: string]: PrivacyTypes[] };
  stage: string | number;
  profilePage: boolean;
}

/**
 * TODO: Add Documentation
 */
export declare interface UpdateState {
  newBusyMessage?: string;
  newNotification?: NotificationMessage;
  newCurrentUser?: User | null;
  newUserDatabase?: UserDatabse.Document | null;
  newCalendars?: { [key: string]: calendar_v3.Schema$CalendarList };
  newSelectedCalendars?: { [key: string]: PrivacyTypes[] };
  newStage?: string | number;
  newProfilePage?: boolean;
}

/**
 * TODO: Add Documentation
 */
export declare interface CookieState {
  notification: NotificationMessage;
  currentUserId: string;
  stage: string | number;
}

/**
 * TODO: Add Documentation
 */
declare enum notificationTypes {
  success,
  error,
  info,
  warning
}

/**
 * TODO: Add Documentation
 */
export declare interface NotificationMessage {
  message: string;
  type: keyof typeof notificationTypes;
  open: boolean;
}

/**
 * TODO: Add Documentation
 */
export namespace UserDatabse {
  /**
   * TODO: Add Documentation
   */ declare interface Document {
    userId: string;
    accounts: CalendarAccount[];
    exports: any;
  }

  /**
   * TODO: Add Documentation
   */
  declare interface CalendarAccount {
    accountId: string;
    label: string;
  }
}

/**
 * TODO: Add Documentation
 */
declare enum PrivacyTypesEnum {
  None,
  Busy,
  TitleOnly,
  FullInformation
}

/**
 * TODO: Add Documentation
 */
export type PrivacyTypes = keyof typeof PrivacyTypesEnum;
