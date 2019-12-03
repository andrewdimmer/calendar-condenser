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
