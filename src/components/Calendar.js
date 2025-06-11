import React, { useState, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './Header';
import MonthView from './MonthView';
import YearView from './YearView';
import DayView from './DayView';
import DecadeView from './DecadeView';
import { getDaysInMonth, getWeeksInMonth } from '../utils/dateUtils';
import './styles.css';

const Calendar = (props) => {
  const {
    date = new Date(),
    defaultValue,
    value,
    defaultActiveStartDate,
    activeStartDate,
    minDate,
    maxDate,
    disableDate,
    disableYear,
    selectionMode = 'single',
    calendarType = 'gregorian',
    locale = 'en-US',
    showDoubleView = false,
    showFixedNumberOfWeeks = false,
    showNavigation = true,
    showNeighboringMonth = true,
    showNeighboringDecade = true,
    showWeekNumbers = false,
    defaultView = 'month',
    maxDetail = 'month',
    minDetail = 'year',
    theme = 'light',
    events = [],
    rangeLimit = null,
    formatDay,
    formatMonth,
    formatMonthYear,
    formatYear,
    formatWeekday,
    formatShortWeekday,
    formatLongDate,
    weekdayFormat = 'short',
    dateFormat = 'mm/dd/yyyy',
    includeTime = false,
    navigationLabel,
    navigationAriaLabel,
    navigationAriaLive,
    prevLabel = <ChevronLeft size={18} />,
    prevAriaLabel = 'Previous',
    nextLabel = <ChevronRight size={18} />,
    nextAriaLabel = 'Next',
    prev2Label,
    prev2AriaLabel,
    next2Label,
    next2AriaLabel,
    onChange,
    onClickMonth,
    onClickWeekNumber,
    onActiveStartDateChange,
    onViewChange,
    onDrillDown,
    onDrillUp,
    onRangeHover,
    tileClassName,
    tileContent,
    tileDisabled,
    className = '',
    style = {},
    inputRef,
    renderHeader,
    renderMonthView,
    renderYearView,
    renderDayView,
    customTileContent,
    customTheme = {},
    dayViewClassName,
    monthViewClassName,
    yearViewClassName,
    styleOverrides = {},
    holidayDates = [],
    renderCustomFooter,
    weekStartDay = 1,
    disabledViews = [],
    onClickEvent,
    renderEvent = () => null,
    selectOnEventClick = true,
    disableBeforeToday = false,
    customDisabledDates = [],
    customDisabledYears = [],
    customDisabledMonths = [],
  } = props;

  // Validate props
  if (calendarType !== 'gregorian') {
    throw new Error(`Unsupported calendar type: ${calendarType}. Only 'gregorian' is supported.`);
  }
  if (weekStartDay < 0 || weekStartDay > 6) {
    console.warn(`Invalid weekStartDay: ${weekStartDay}. Defaulting to 1 (Monday).`);
    props.weekStartDay = 1;
  }
  const validDateFormats = ['mm/dd/yyyy', 'dd/mm/yyyy', 'yyyy-mm-dd', 'mm-dd-yyyy', 'dd-mm-yyyy'];
  if (!validDateFormats.includes(dateFormat)) {
    console.warn(`Invalid dateFormat: ${dateFormat}. Defaulting to 'mm/dd/yyyy'.`);
    props.dateFormat = 'mm/dd/yyyy';
  }
  if (!['single', 'range'].includes(selectionMode)) {
    console.warn(`Invalid selectionMode: ${selectionMode}. Defaulting to 'single'.`);
    props.selectionMode = 'single';
  }

  const [currentView, setCurrentView] = useState(defaultView);
  const [activeDate, setActiveDate] = useState(activeStartDate || defaultActiveStartDate || date);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || null);
  const [internalRangeStart, setInternalRangeStart] = useState(null);
  const controlledRangeStart = props.rangeStart ?? internalRangeStart;
  const hoverRef = useRef(null);
  const [viewHistory, setViewHistory] = useState([]);
  const [controlledHoveredDate, setControlledHoveredDate] = useState(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const handleViewChange = useCallback(
    (newView) => {
      if (
        disabledViews.includes(newView) ||
        (newView === 'day' && maxDetail === 'month') ||
        (newView === 'year' && minDetail === 'month') ||
        (newView === 'decade' && minDetail === 'year')
      ) {
        return;
      }
      setViewHistory((prev) => [...prev, currentView]);
      setCurrentView(newView);
      onViewChange?.({ view: newView });
    },
    [maxDetail, minDetail, onViewChange, currentView, disabledViews]
  );

  const handleBackView = useCallback(() => {
    const lastView = viewHistory[viewHistory.length - 1];
    if (lastView) {
      setCurrentView(lastView);
      setViewHistory((prev) => prev.slice(0, -1));
      onViewChange?.({ view: lastView });
    }
  }, [viewHistory, onViewChange]);

  const handleActiveDateChange = useCallback(
    (newDate) => {
      setActiveDate(newDate);
      onActiveStartDateChange?.({ activeStartDate: newDate });
    },
    [onActiveStartDateChange]
  );

  const handleDateSelect = useCallback(
    (date) => {
      if (selectionMode === 'range') {
        if (!controlledRangeStart) {
          setInternalRangeStart(date);
          setSelectedValue([date]);
          setControlledHoveredDate(null);
          onChange?.([date]);
        } else {
          if (rangeLimit) {
            const diffTime = Math.abs(date - controlledRangeStart);
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            if (diffDays > rangeLimit) {
              return;
            }
          }
          const range = [controlledRangeStart, date].sort((a, b) => a - b);
          setSelectedValue(range);
          setInternalRangeStart(null);
          onChange?.(range);
          setControlledHoveredDate(null);
        }
      } else {
        setSelectedValue(date);
        setInternalRangeStart(null);
        onChange?.(date);
      }
    },
    [selectionMode, controlledRangeStart, onChange, rangeLimit]
  );

  const isDateDisabled = useCallback(
    (date) => {
      const isBeforeToday = disableBeforeToday && date < today;
      const isCustomDisabled = customDisabledDates.some((d) => d.toDateString() === date.toDateString());
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      if (disableDate) return disableDate(date);
      return isBeforeToday || isCustomDisabled;
    },
    [minDate, maxDate, disableDate, disableBeforeToday, customDisabledDates, today]
  );

  const isYearDisabled = useCallback(
    (year) => {
      const currentYear = today.getFullYear();
      const isBeforeCurrentYear = year < currentYear;
      const isCustomDisabled = customDisabledYears.includes(year);
      if (disableYear) return disableYear(year);
      return isBeforeCurrentYear || isCustomDisabled;
    },
    [disableYear, customDisabledYears, today]
  );

  const isMonthDisabled = useCallback(
    (monthDate) => {
      const isBeforeToday = disableBeforeToday && monthDate < new Date(today.getFullYear(), today.getMonth(), 1);
      const isCustomDisabled = customDisabledMonths.some((m) => m.year === monthDate.getFullYear() && m.month === monthDate.getMonth());
      if (disableYear) return disableYear(monthDate.getFullYear());
      return isBeforeToday || isCustomDisabled;
    },
    [disableYear, disableBeforeToday, customDisabledMonths, today]
  );

  const handleHover = useCallback(
    (date) => {
      if (selectionMode === 'range' && controlledRangeStart) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Hovering date:', date.toISOString());
        }
        hoverRef.current = date;
        setControlledHoveredDate(date);
        if (onRangeHover && !tileDisabled?.({ date })) {
          onRangeHover({ start: controlledRangeStart, end: date });
        }
      }
    },
    [selectionMode, controlledRangeStart, onRangeHover, tileDisabled]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (currentView !== 'month') return;
      const newDate = new Date(activeDate);
      let nextButton;
      switch (e.key) {
        case 'ArrowLeft':
          newDate.setDate(newDate.getDate() - 1);
          handleActiveDateChange(newDate);
          nextButton = document.querySelector(`.calendar-day[aria-label*="Select ${newDate.toLocaleDateString(locale)}"]`);
          nextButton?.focus();
          break;
        case 'ArrowRight':
          newDate.setDate(newDate.getDate() + 1);
          handleActiveDateChange(newDate);
          nextButton = document.querySelector(`.calendar-day[aria-label*="Select ${newDate.toLocaleDateString(locale)}"]`);
          nextButton?.focus();
          break;
        case 'ArrowUp':
          newDate.setDate(newDate.getDate() - 7);
          handleActiveDateChange(newDate);
          nextButton = document.querySelector(`.calendar-day[aria-label*="Select ${newDate.toLocaleDateString(locale)}"]`);
          nextButton?.focus();
          break;
        case 'ArrowDown':
          newDate.setDate(newDate.getDate() + 7);
          handleActiveDateChange(newDate);
          nextButton = document.querySelector(`.calendar-day[aria-label*="Select ${newDate.toLocaleDateString(locale)}"]`);
          nextButton?.focus();
          break;
        case 'Enter':
          if (!isDateDisabled(activeDate)) {
            handleDateSelect(activeDate);
          }
          break;
        case 'Backspace':
          handleBackView();
          break;
        default:
          break;
      }
    },
    [currentView, activeDate, handleActiveDateChange, handleDateSelect, isDateDisabled, handleBackView, locale]
  );

  const getTileClassName = useCallback(
    ({ date }) => {
      const baseClasses = tileClassName?.({ date }) || '';
      const event = events.find((e) => e.date.toDateString() === date.toDateString());
      const eventClasses = event ? `has-event event-${event.type || 'default'}` : '';
      const holidayClasses = holidayDates.some(
        (holiday) => holiday.toDateString() === date.toDateString()
      ) ? 'holiday' : '';

      if (selectionMode === 'range' && controlledRangeStart && controlledHoveredDate) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Applying hover classes for date:', date.toISOString(), 'hover:', controlledHoveredDate.toISOString());
        }
        const [start, end] =
          controlledRangeStart < controlledHoveredDate
            ? [controlledRangeStart, controlledHoveredDate]
            : [controlledHoveredDate, controlledRangeStart];

        if (date >= start && date <= end) {
          return `${baseClasses} range-preview ${date.toDateString() === controlledHoveredDate.toDateString() ? 'hover-range-end' : ''} ${eventClasses} ${holidayClasses}`.trim();
        }

        if (date.toDateString() === controlledRangeStart.toDateString()) {
          return `${baseClasses} selected-start ${eventClasses} ${holidayClasses}`.trim();
        }
      }

      if (Array.isArray(selectedValue)) {
        const [start, end] = selectedValue;
        if (start && date.toDateString() === start.toDateString()) {
          return `${baseClasses} selected-start ${eventClasses} ${holidayClasses}`.trim();
        }
        if (end && date.toDateString() === end.toDateString()) {
          return `${baseClasses} selected-end ${eventClasses} ${holidayClasses}`.trim();
        }
        if (start && end && date > start && date < end) {
          return `${baseClasses} in-range ${eventClasses} ${holidayClasses}`.trim();
        }
      } else if (selectedValue && date.toDateString() === selectedValue.toDateString()) {
        return `${baseClasses} selected ${eventClasses} ${holidayClasses}`.trim();
      }

      return `${baseClasses} ${eventClasses} ${holidayClasses}`.trim();
    },
    [tileClassName, selectionMode, controlledRangeStart, selectedValue, events, controlledHoveredDate, holidayDates]
  );

  const memoizedTileContent = useMemo(
    () =>
      ({ date, view }) => {
        const event = events.find((e) => e.date.toDateString() === date.toDateString());
        if (event && view === 'month') {
          return (
            <>
              <div className="event-indicator" style={{ backgroundColor: event.color || '#295d96' }}>
                {tileContent ? tileContent({ date, view }) : date.getDate()}
              </div>
              <span id={`event-${date.toISOString()}`} className="sr-only">
                {event.title || 'Event'}
              </span>
            </>
          );
        }
        return tileContent ? tileContent({ date, view }) : null;
      },
    [events, tileContent]
  );

  const memoizedDays = useMemo(() => {
    const firstDays = getDaysInMonth(activeDate, weekStartDay, calendarType, showFixedNumberOfWeeks, showNeighboringMonth);
    const secondDays = showDoubleView
      ? getDaysInMonth(
          new Date(activeDate.getFullYear(), activeDate.getMonth() + 1),
          weekStartDay,
          calendarType,
          showFixedNumberOfWeeks,
          showNeighboringMonth
        )
      : [];
    return {
      first: firstDays.map((d) => ({ ...d })),
      second: secondDays.map((d) => ({ ...d })),
    };
  }, [activeDate, weekStartDay, calendarType, showFixedNumberOfWeeks, showNeighboringMonth, showDoubleView]);

  const renderView = () => {
    switch (currentView) {
      case 'day':
        return renderDayView ? (
          renderDayView({ date: activeDate, onDateSelect: handleDateSelect })
        ) : (
          <DayView
            date={activeDate}
            onDateSelect={handleDateSelect}
            tileContent={memoizedTileContent}
            tileClassName={getTileClassName}
            tileDisabled={tileDisabled || isDateDisabled}
            formatLongDate={formatLongDate}
            dateFormat={dateFormat}
            weekdayFormat={weekdayFormat}
            monthFormat={monthFormat}
            includeTime={includeTime}
            locale={locale}
            onDrillUp={() => {
              handleViewChange('month');
              onDrillUp?.();
            }}
            today={today}
            className={dayViewClassName}
            onClickEvent={onClickEvent}
            events={events}
            renderEvent={renderEvent}
            selectOnEventClick={selectOnEventClick}
          />
        );
      case 'year':
        return renderYearView ? (
          renderYearView({ date: activeDate, onMonthSelect })
        ) : (
          <YearView
            date={activeDate}
            value={selectedValue}
            onMonthSelect={(monthDate) => {
              handleActiveDateChange(monthDate);
              handleViewChange('month');
              onClickMonth?.(monthDate);
              onDrillDown?.();
            }}
            tileDisabled={isMonthDisabled}
            tileClassName={tileClassName}
            formatMonth={formatMonth}
            showNeighboringDecade={showNeighboringDecade}
            locale={locale}
            onDrillUp={() => {
              handleViewChange('decade');
              onDrillUp?.();
            }}
            className={yearViewClassName}
          />
        );
      case 'decade':
        return (
          <DecadeView
            date={activeDate}
            value={selectedValue}
            onYearSelect={(yearDate) => {
              handleActiveDateChange(yearDate);
              handleViewChange('year');
              onDrillDown?.();
            }}
            tileDisabled={isYearDisabled}
            tileClassName={tileClassName}
            formatYear={formatYear}
            showNeighboringCentury={showNeighboringDecade}
            locale={locale}
            onDrillUp={() => {
              handleViewChange('year'); 
              onDrillUp?.();
            }}
            className={yearViewClassName}
          />
        );
      case 'month':
        return renderMonthView ? (
          renderMonthView({ date: activeDate, onDateSelect: handleDateSelect })
        ) : (
          <MonthView
            date={activeDate}
            onDateSelect={handleDateSelect}
            onClickWeekNumber={onClickWeekNumber}
            tileContent={customTileContent}
            tileClassName={getTileClassName}
            tileDisabled={tileDisabled || isDateDisabled}
            showWeekNumbers={showWeekNumbers}
            showNeighboringMonth={showNeighboringMonth}
            showFixedNumberOfWeeks={showFixedNumberOfWeeks}
            formatDay={formatDay}
            formatWeekday={formatWeekday}
            formatShortWeekday={formatShortWeekday}
            weekdayFormat={weekdayFormat}
            locale={locale}
            calendarType={calendarType}
            onDrillDown={() => {
              handleViewChange('day');
              onDrillDown?.();
            }}
            onDrillUp={() => {
              handleViewChange('year');
              onDrillUp?.();
            }}
            showDoubleView={showDoubleView}
            value={selectedValue}
            onHover={handleHover}
            onClearHover={() => {
              hoverRef.current = null;
              setControlledHoveredDate(null);
              onRangeHover?.({ start: controlledRangeStart, end: null });
            }}
            today={today}
            weekStartDay={weekStartDay}
            className={monthViewClassName}
            onClickEvent={onClickEvent}
            events={events}
            renderEvent={renderEvent}
            selectOnEventClick={selectOnEventClick}
            days={memoizedDays}
          />
        );
      default:
        return null;
    }
  };

  const themeStyles = Object.entries(customTheme).reduce(
    (styles, [key, value]) => {
      styles[`--custom-${key}`] = value;
      return styles;
    },
    {
      '--primary-color': customTheme.primary || '#4b6cb7',
      '--accent-color': customTheme.accent || '#48bb78',
      '--day-size': customTheme.daySize || '40px',
    }
  );

  return (
    <div
      className={`calendar ${className} ${showDoubleView ? 'double-view' : ''} theme-${theme} ${customTheme ? 'custom-theme' : ''}`}
      style={{ ...style, ...themeStyles, ...styleOverrides.calendar }}
      ref={inputRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Interactive Calendar"
    >
      {showNavigation &&
        (renderHeader ? (
          renderHeader({ date: activeDate, onChange: handleActiveDateChange, view: currentView })
        ) : (
          <Header
            date={activeDate}
            onChange={handleActiveDateChange}
            view={currentView}
            minDetail={minDetail}
            maxDetail={maxDetail}
            prevLabel={prevLabel}
            prevAriaLabel={prevAriaLabel}
            nextLabel={nextLabel}
            nextAriaLabel={nextAriaLabel}
            prev2Label={prev2Label}
            prev2AriaLabel={prev2AriaLabel}
            next2Label={next2Label}
            next2AriaLabel={next2AriaLabel}
            navigationLabel={navigationLabel}
            navigationAriaLabel={navigationAriaLabel}
            navigationAriaLive={navigationAriaLive}
            formatMonthYear={formatMonthYear}
            formatYear={formatYear}
            locale={locale}
            showDoubleView={showDoubleView}
            style={styleOverrides.header}
          />
        ))}
      <div className="calendar-container" style={styleOverrides.container}>
        {renderView()}
      </div>
      {viewHistory.length > 0 && (
        <button
          className="back-button"
          onClick={handleBackView}
          aria-label="Back to previous view"
          style={styleOverrides.backButton}
        >
          Back
        </button>
      )}
      {renderCustomFooter && (
        <div className="calendar-footer" style={styleOverrides.footer}>
          {renderCustomFooter({ selectedValue, activeDate })}
        </div>
      )}
    </div>
  );
};

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  defaultValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.arrayOf(PropTypes.instanceOf(Date))]),
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.arrayOf(PropTypes.instanceOf(Date))]),
  defaultActiveStartDate: PropTypes.instanceOf(Date),
  activeStartDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  disableDate: PropTypes.func,
  disableYear: PropTypes.func,
  selectionMode: PropTypes.oneOf(['single', 'range']),
  calendarType: PropTypes.string,
  locale: PropTypes.string,
  showDoubleView: PropTypes.bool,
  showFixedNumberOfWeeks: PropTypes.bool,
  showNavigation: PropTypes.bool,
  showNeighboringMonth: PropTypes.bool,
  showNeighboringDecade: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  defaultView: PropTypes.oneOf(['day', 'month', 'year', 'decade']),
  maxDetail: PropTypes.oneOf(['day', 'month', 'year', 'decade']),
  minDetail: PropTypes.oneOf(['day', 'month', 'year', 'decade']),
  theme: PropTypes.string,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
      title: PropTypes.string,
      type: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  rangeLimit: PropTypes.number,
  formatDay: PropTypes.func,
  formatMonth: PropTypes.func,
  formatMonthYear: PropTypes.func,
  formatYear: PropTypes.func,
  formatWeekday: PropTypes.func,
  formatShortWeekday: PropTypes.func,
  formatLongDate: PropTypes.func,
  weekdayFormat: PropTypes.oneOf(['short', 'full', 'minimal']),
  dateFormat: PropTypes.oneOf(['mm/dd/yyyy', 'dd/mm/yyyy', 'yyyy-mm-dd', 'mm-dd-yyyy', 'dd-mm-yyyy']),
  includeTime: PropTypes.bool,
  navigationLabel: PropTypes.func,
  navigationAriaLabel: PropTypes.string,
  navigationAriaLive: PropTypes.string,
  prevLabel: PropTypes.node,
  prevAriaLabel: PropTypes.string,
  nextLabel: PropTypes.node,
  nextAriaLabel: PropTypes.string,
  prev2Label: PropTypes.node,
  prev2AriaLabel: PropTypes.string,
  next2Label: PropTypes.node,
  next2AriaLabel: PropTypes.string,
  onChange: PropTypes.func,
  onClickMonth: PropTypes.func,
  onClickWeekNumber: PropTypes.func,
  onActiveStartDateChange: PropTypes.func,
  onViewChange: PropTypes.func,
  onDrillDown: PropTypes.func,
  onDrillUp: PropTypes.func,
  onRangeHover: PropTypes.func,
  tileClassName: PropTypes.func,
  tileContent: PropTypes.func,
  tileDisabled: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  renderHeader: PropTypes.func,
  renderMonthView: PropTypes.func,
  renderYearView: PropTypes.func,
  renderDayView: PropTypes.func,
  customTileContent: PropTypes.func,
  customTheme: PropTypes.object,
  dayViewClassName: PropTypes.string,
  monthViewClassName: PropTypes.string,
  yearViewClassName: PropTypes.string,
  styleOverrides: PropTypes.shape({
    calendar: PropTypes.object,
    header: PropTypes.object,
    container: PropTypes.object,
    backButton: PropTypes.object,
    footer: PropTypes.object,
  }),
  holidayDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  renderCustomFooter: PropTypes.func,
  weekStartDay: PropTypes.number,
  disabledViews: PropTypes.arrayOf(PropTypes.string),
  onClickEvent: PropTypes.func,
  renderEvent: PropTypes.func,
  selectOnEventClick: PropTypes.bool,
  disableBeforeToday: PropTypes.bool,
  customDisabledDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  customDisabledYears: PropTypes.arrayOf(PropTypes.number),
  customDisabledMonths: PropTypes.arrayOf(PropTypes.shape({ year: PropTypes.number, month: PropTypes.number })),
};

Calendar.defaultProps = {
  date: new Date(),
  selectionMode: 'single',
  calendarType: 'gregorian',
  locale: 'en-US',
  showDoubleView: false,
  showFixedNumberOfWeeks: false,
  showNavigation: true,
  showNeighboringMonth: true,
  showNeighboringDecade: true,
  showWeekNumbers: false,
  defaultView: 'month',
  maxDetail: 'month',
  minDetail: 'year',
  theme: 'light',
  events: [],
  weekdayFormat: 'short',
  dateFormat: 'mm/dd/yyyy',
  includeTime: false,
  prevAriaLabel: 'Previous',
  nextAriaLabel: 'Next',
  className: '',
  style: {},
  customTheme: {},
  styleOverrides: {},
  holidayDates: [],
  weekStartDay: 1,
  disabledViews: [],
  selectOnEventClick: true,
  disableBeforeToday: false,
  customDisabledDates: [],
  customDisabledYears: [],
  customDisabledMonths: [],
};

export default Calendar;