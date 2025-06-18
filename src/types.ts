import React from 'react';

export interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
}

export interface Event {
  date: Date;
  title?: string;
  type?: string;
  color?: string;
  [key: string]: any;
}

export interface DisabledMonth {
  year: number;
  month: number;
}

export interface CalendarProps {
  date?: Date;
  activeStartDate?: Date;
  defaultActiveStartDate?: Date;
  value?: Date | [Date, Date];
  defaultValue?: Date | [Date, Date];
  defaultView?: 'day' | 'month' | 'year' | 'decade';
  disableDate?: (date: Date) => boolean;
  disableYear?: (year: number) => boolean;
  disableMonth?: (monthDate: Date) => boolean;
  onActiveStartDateChange?: ({ activeStartDate }: { activeStartDate: Date }) => void;
  onChange?: (value: Date | [Date, Date]) => void;
  onClickMonth?: (date: Date) => void;
  onClickWeekNumber?: (week: number, date: Date) => void;
  onDrillDown?: () => void;
  onDrillUp?: () => void;
  onViewChange?: ({ view }: { view: 'day' | 'month' | 'year' | 'decade' }) => void;
  onRangeHover?: ({ start, end }: { start: Date; end: Date | null }) => void;
  tileClassName?: ({ date, view }: { date: Date; view: string }) => string | null;
  tileContent?: ({ date, view, event }: { date: Date; view: string; event?: Event }) => React.ReactNode;
  tileDisabled?: ({ date }: { date: Date }) => boolean;
  customTileContent?: ({ date, view, event }: { date: Date; view: string; event?: Event }) => React.ReactNode;
  formatDay?: (date: Date, locale: string) => string;
  formatLongDate?: (date: Date, locale: string) => string;
  formatMonth?: (date: Date, locale: string) => string;
  formatMonthYear?: (date: Date, locale: string) => string;
  formatShortWeekday?: (date: Date, locale: string) => string;
  formatWeekday?: (date: Date, locale: string) => string;
  formatYear?: (date: Date, locale: string) => string;
  className?: string;
  style?: React.CSSProperties;
  locale?: string;
  calendarType?: 'gregorian';
  maxDate?: Date;
  minDate?: Date;
  maxDetail?: 'day' | 'month' | 'year' | 'decade';
  minDetail?: 'day' | 'month' | 'year' | 'decade';
  selectionMode?: 'single' | 'range';
  rangeStart?: Date;
  rangeLimit?: number | null;
  showDoubleView?: boolean;
  showFixedNumberOfWeeks?: boolean;
  showNavigation?: boolean;
  showNeighboringMonth?: boolean;
  showWeekNumbers?: boolean;
  showNeighboringDecade?: boolean;
  weekStartDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  navigationAriaLabel?: string;
  navigationAriaLive?: 'off' | 'polite' | 'assertive';
  navigationLabel?: ({ date, view, locale }: { date: Date; view: string; locale: string }) => string;
  next2AriaLabel?: string;
  next2Label?: React.ReactNode;
  nextAriaLabel?: string;
  nextLabel?: React.ReactNode;
  prev2AriaLabel?: string;
  prev2Label?: React.ReactNode;
  prevAriaLabel?: string;
  prevLabel?: React.ReactNode;
  events?: Event[];
  theme?: 'light' | 'dark';
  weekdayFormat?: 'short' | 'full' | 'minimal';
  dateFormat?: 'mm/dd/yyyy' | 'dd/mm/yyyy' | 'yyyy-mm-dd' | 'mm-dd-yyyy' | 'dd-mm-yyyy';
  monthFormat?: 'long' | 'short' | 'numeric';
  includeTime?: boolean;
  inputRef?: React.RefObject<HTMLElement> | ((instance: HTMLElement | null) => void);
  renderHeader?: ({ date, onChange, view }: { date: Date; onChange: (date: Date) => void; view: string }) => React.ReactNode;
  renderMonthView?: ({ date, onDateSelect }: { date: Date; onDateSelect: (date: Date) => void }) => React.ReactNode;
  renderYearView?: ({ date, onMonthSelect }: { date: Date; onMonthSelect: (date: Date) => void }) => React.ReactNode;
  renderDayView?: ({ date, onDateSelect }: { date: Date; onDateSelect: (date: Date) => void }) => React.ReactNode;
  renderDecadeView?: ({ date, onYearSelect }: { date: Date; onYearSelect: (date: Date) => void }) => React.ReactNode;
  customTheme?: { [key: string]: string };
  dayViewClassName?: string;
  monthViewClassName?: string;
  yearViewClassName?: string;
  styleOverrides?: {
    calendar?: React.CSSProperties;
    header?: React.CSSProperties;
    container?: React.CSSProperties;
    backButton?: React.CSSProperties;
    footer?: React.CSSProperties;
  };
  holidayDates?: Date[];
  renderCustomFooter?: ({ selectedValue, activeDate }: { selectedValue: Date | [Date, Date] | null; activeDate: Date }) => React.ReactNode;
  disabledViews?: string[];
  onClickEvent?: (event: Event) => void;
  renderEvent?: ({ event, date }: { event: Event; date: Date }) => React.ReactNode;
  selectOnEventClick?: boolean;
  disableBeforeToday?: boolean;
  customDisabledDates?: Date[];
  customDisabledYears?: number[];
  customDisabledMonths?: DisabledMonth[];
  backLabel?: string;
}

export interface HeaderProps {
  showDoubleView?: boolean;
  date: Date;
  onChange: (date: Date) => void;
  view: 'day' | 'month' | 'year' | 'decade';
  minDetail?: 'day' | 'month' | 'year' | 'decade';
  maxDetail?: 'day' | 'month' | 'year' | 'decade';
  prevLabel?: React.ReactNode;
  prevAriaLabel?: string;
  nextLabel?: React.ReactNode;
  nextAriaLabel?: string;
  prev2Label?: React.ReactNode;
  prev2AriaLabel?: string;
  next2Label?: React.ReactNode;
  next2AriaLabel?: string;
  navigationLabel?: ({ date, view, locale }: { date: Date; view: string; locale: string }) => string;
  navigationAriaLabel?: string;
  navigationAriaLive?: 'off' | 'polite' | 'assertive';
  formatMonthYear?: (date: Date, locale: string) => string;
  formatYear?: (date: Date, locale: string) => string;
  locale?: string;
  style?: React.CSSProperties;
  isYearDisabled?: (year: number) => boolean;
}

export interface MonthViewProps {
  date: Date;
  onDateSelect: (date: Date) => void;
  onClickWeekNumber?: (week: number, date: Date) => void;
  tileContent?: ({ date, view, event }: { date: Date; view: string; event?: Event }) => React.ReactNode;
  tileClassName?: ({ date, view }: { date: Date; view: string }) => string | null;
  tileDisabled?: ({ date }: { date: Date }) => boolean;
  showWeekNumbers?: boolean;
  showNeighboringMonth?: boolean;
  showFixedNumberOfWeeks?: boolean;
  formatDay?: (date: Date, locale: string) => string;
  formatWeekday?: (date: Date, locale: string) => string;
  formatShortWeekday?: (date: Date, locale: string) => string;
  weekdayFormat?: 'short' | 'full' | 'minimal';
  locale?: string;
  calendarType?: 'gregorian';
  onDrillDown?: () => void;
  onDrillUp?: () => void;
  showDoubleView?: boolean;
  value?: Date | [Date, Date];
  onHover?: (date: Date) => void;
  onClearHover?: () => void;
  today?: Date;
  weekStartDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  onClickEvent?: (event: Event) => void;
  events?: Event[];
  renderEvent?: ({ event, date }: { event: Event; date: Date }) => React.ReactNode;
  selectOnEventClick?: boolean;
  days?: { first: DayInfo[]; second: DayInfo[] };
}

export interface YearViewProps {
  date: Date;
  value?: Date | [Date, Date];
  onMonthSelect: (date: Date) => void;
  tileDisabled?: (date: Date) => boolean;
  tileClassName?: ({ date }: { date: Date }) => string | null;
  formatMonth?: (date: Date, locale: string) => string;
  showNeighboringDecade?: boolean;
  locale?: string;
  onDrillUp?: () => void;
  className?: string;
}

export interface DecadeViewProps {
  date: Date;
  value?: Date | [Date, Date];
  onYearSelect: (date: Date) => void;
  tileDisabled?: (year: number) => boolean;
  tileClassName?: ({ date }: { date: Date }) => string | null;
  formatYear?: (date: Date, locale: string) => string;
  showNeighboringCentury?: boolean;
  locale?: string;
  calendarType?: 'gregorian';
  calendarPlugin?: any;
  onDrillUp?: () => void;
  className?: string;
}

export interface DayViewProps {
  date: Date;
  onDateSelect: (date: Date) => void;
  tileContent?: ({ date, view, event }: { date: Date; view: string; event?: Event }) => React.ReactNode;
  tileClassName?: ({ date }: { date: Date }) => string | null;
  tileDisabled?: ({ date }: { date: Date }) => boolean;
  formatLongDate?: (date: Date, locale: string) => string;
  dateFormat?: 'mm/dd/yyyy' | 'dd/mm/yyyy' | 'yyyy-mm-dd' | 'mm-dd-yyyy' | 'dd-mm-yyyy';
  weekdayFormat?: 'short' | 'full' | 'minimal';
  monthFormat?: 'long' | 'short' | 'numeric';
  includeTime?: boolean;
  locale?: string;
  onDrillUp?: () => void;
  today?: Date;
  className?: string;
  onClickEvent?: (event: Event) => void;
  events?: Event[];
  renderEvent?: ({ event, date }: { event: Event; date: Date }) => React.ReactNode;
  selectOnEventClick?: boolean;
}

export interface DayProps {
  dayInfo: DayInfo;
  formatDay?: (date: Date, locale: string) => string;
  locale?: string;
}