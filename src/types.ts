import React from 'react';

export interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
}

export interface Event {
  date: Date;
  [key: string]: any;
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
  onActiveStartDateChange?: ({ activeStartDate }: { activeStartDate: Date }) => void;
  onChange?: (value: Date | [Date, Date]) => void;
  onClickMonth?: (date: Date) => void;
  onClickWeekNumber?: (week: number, date: Date) => void;
  onDrillDown?: () => void;
  onDrillUp?: () => void;
  onViewChange?: ({ view }: { view: 'day' | 'month' | 'year' | 'decade' }) => void;
  onRangeHover?: ({ start, end }: { start: Date; end: Date | null }) => void;
  tileClassName?: ({ date }: { date: Date }) => string;
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
  maxDetail?: 'day' | 'month' | 'year';
  minDetail?: 'day' | 'month' | 'year';
  selectionMode?: 'single' | 'range';
  rangeStart?: Date;
  rangeLimit?: number | null;
  showDoubleView?: boolean;
  showFixedNumberOfWeeks?: boolean;
  showNavigation?: boolean;
  showNeighboringMonth?: boolean;
  showWeekNumbers?: boolean;
  showNeighboringDecade?: boolean;
  weekStartDay?: number;
  navigationAriaLabel?: string;
  navigationAriaLive?: string;
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
  theme?: string;
  weekdayFormat?: 'short' | 'full' | 'minimal';
  dateFormat?: string;
  monthFormat?: 'long' | 'short' | 'numeric';
  includeTime?: boolean;
  inputRef?: React.RefObject<HTMLElement>;
  renderHeader?: ({ date, onChange, view }: { date: Date; onChange: (date: Date) => void; view: string }) => React.ReactNode;
  renderMonthView?: ({ date, onDateSelect }: { date: Date; onDateSelect: (date: Date) => void }) => React.ReactNode;
  renderYearView?: ({ date, onMonthSelect }: { date: Date; onMonthSelect: (date: Date) => void }) => React.ReactNode;
  renderDayView?: ({ date, onDateSelect }: { date: Date; onDateSelect: (date: Date) => void }) => React.ReactNode;
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
}