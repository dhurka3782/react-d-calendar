import React, { useState, useCallback, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './Header';
import MonthView from './MonthView';
import YearView from './YearView';
import DayView from './DayView';
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
    monthFormat = 'long',
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
  } = props;

  if (calendarType !== 'gregorian') {
    throw new Error(`Unsupported calendar type: ${calendarType}. Only 'gregorian' is supported.`);
  }

  const [currentView, setCurrentView] = useState(defaultView);
  const [activeDate, setActiveDate] = useState(activeStartDate || defaultActiveStartDate || date);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || null);
  const [internalRangeStart, setInternalRangeStart] = useState(null);
  const controlledRangeStart = props.rangeStart ?? internalRangeStart;
  const hoverRef = useRef(null);
  const [viewHistory, setViewHistory] = useState([]);
  const [controlledHoveredDate, setcontrolledHoveredDate] = useState(null);

  const handleViewChange = useCallback(
    (newView) => {
      if (
        disabledViews.includes(newView) ||
        (newView === 'day' && maxDetail === 'month') ||
        (newView === 'year' && minDetail === 'month')
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
          setcontrolledHoveredDate(null);
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
          setcontrolledHoveredDate(null);
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
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      if (disableDate) return disableDate(date);
      return false;
    },
    [minDate, maxDate, disableDate]
  );

  const isYearDisabled = useCallback(
    (year) => {
      if (disableYear) return disableYear(year);
      return false;
    },
    [disableYear]
  );

  const handleHover = useCallback(
    (date) => {
      if (selectionMode === 'range' && controlledRangeStart) {
        console.log('Hovering date:', date.toISOString());
        hoverRef.current = date;
        setcontrolledHoveredDate(date);
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
      switch (e.key) {
        case 'ArrowLeft':
          newDate.setDate(newDate.getDate() - 1);
          handleActiveDateChange(newDate);
          break;
        case 'ArrowRight':
          newDate.setDate(newDate.getDate() + 1);
          handleActiveDateChange(newDate);
          break;
        case 'ArrowUp':
          newDate.setDate(newDate.getDate() - 7);
          handleActiveDateChange(newDate);
          break;
        case 'ArrowDown':
          newDate.setDate(newDate.getDate() + 7);
          handleActiveDateChange(newDate);
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
    [currentView, activeDate, handleActiveDateChange, handleDateSelect, isDateDisabled, handleBackView]
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
        console.log('Applying hover classes for date:', date.toISOString(), 'hover:', controlledHoveredDate.toISOString()); // Debug
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
            <div className="event-indicator" style={{ backgroundColor: event.color || '#295d96' }}>
              {tileContent ? tileContent({ date, view }) : date.getDate()}
            </div>
          );
        }
        return tileContent ? tileContent({ date, view }) : null;
      },
    [events, tileContent]
  );

  const renderView = () => {
    const today = new Date();
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
            tileDisabled={isYearDisabled}
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
              setcontrolledHoveredDate(null);
              onRangeHover?.({ start: controlledRangeStart, end: null });
            }}
            today={today}
            weekStartDay={weekStartDay}
            className={monthViewClassName}
            onClickEvent={onClickEvent}
            events={events}
            renderEvent={renderEvent}
          />
        );
      default:
        return null;
    }
  };

  // Convert customTheme to CSS variable styles
  const themeStyles = Object.entries(customTheme).reduce((styles, [key, value]) => {
    styles[`--custom-${key}`] = value;
    return styles;
  }, {});

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

export default Calendar;