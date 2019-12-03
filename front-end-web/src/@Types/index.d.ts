import { calendar_v3 } from "googleapis";
import { User } from "firebase";

/**
 * TODO: Add Documentation
 */
export declare interface State {
  busyMessage: string;
  notification: NotificationMessage;
  currentUser: User | null;
  userDatabase: UserDatabase.Document | null;
  calendars: { [key: string]: calendar_v3.Schema$CalendarList };
  selectedCalendars: { [key: string]: PrivacyLevel[] };
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
  newUserDatabase?: UserDatabase.Document | null;
  newCalendars?: { [key: string]: calendar_v3.Schema$CalendarList };
  newSelectedCalendars?: { [key: string]: PrivacyLevel[] };
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
export namespace UserDatabase {
  /**
   * TODO: Add Documentation
   */ declare interface Document {
    userId: string;
    accounts: CalendarAccount[];
    exports: ExportCalendar[];
  }

  /**
   * TODO: Add Documentation
   */
  declare interface CalendarAccount {
    accountId: string;
    label: string;
  }

  /**
   * TODO: Add Documentation
   */
  declare interface ExportCalendar {
    calendarId?: string;
    calendarName: string;
    ownerAccountId: string;
    includedCalendars: SelectedCalendarShorthand[];
  }

  /**
   * TODO: Add Documentation
   */
  declare interface SelectedCalendarShorthand {
    accountId: string;
    calendarId: string;
    privacyLevel: PrivacyLevel;
  }
}

/**
 * TODO: Add Documentation
 */
declare enum PrivacyLevels {
  none,
  busy,
  title,
  full
}

/**
 * TODO: Add Documentation
 */
export type PrivacyLevel = keyof typeof PrivacyLevels;
