// Calendar.js
import React, { useState, useCallback, useRef, useMemo } from 'react';
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
    selectRange = false,
    allowPartialRange = true,
    calendarType = 'gregorian',
    locale = 'en-US',
    showDoubleView = false,
    showFixedNumberOfWeeks = false,
    showNavigation = true,
    showNeighboringMonth = true,
    showNeighboringDecade = true,
    showWeekNumbers = false,
    view = 'month',
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
    navigationLabel,
    navigationAriaLabel,
    navigationAriaLive,
    prevLabel = '‹',
    prevAriaLabel = 'Previous',
    nextLabel = '›',
    nextAriaLabel = 'Next',
    prev2Label,
    prev2AriaLabel,
    next2Label,
    next2AriaLabel,
    onChange,
    onClickDay,
    onClickMonth,
    onClickYear,
    onClickWeekNumber,
    onActiveStartDateChange,
    onViewChange,
    onDrillDown,
    onDrillUp,
    onRangeHover,
    goToRangeStartOnSelect = true,
    tileClassName,
    tileContent,
    tileDisabled,
    className = '',
    style = {},
    inputRef,
    returnValue = 'range',
    renderDay,
    renderHeader,
    renderNavigationLabel,
    renderMonthView,
    renderYearView,
    renderDayView,
    customTileContent,
    customDayClassName,
    customMonthClassName,
    customYearClassName,
    onMonthHover,
    onYearHover,
    customRangeStyles,
  } = props;

  const [currentView, setCurrentView] = useState(defaultView);
  const [activeDate, setActiveDate] = useState(activeStartDate || defaultActiveStartDate || date);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || null);
  const [rangeStart, setRangeStart] = useState(null);
  const hoverRef = useRef(null);
  const [viewHistory, setViewHistory] = useState([]);

  const handleViewChange = useCallback((newView) => {
    if (
      (newView === 'day' && maxDetail === 'month') ||
      (newView === 'year' && minDetail === 'month')
    ) {
      return;
    }
    setViewHistory((prev) => [...prev, currentView]);
    setCurrentView(newView);
    onViewChange?.({ view: newView });
  }, [maxDetail, minDetail, onViewChange, currentView]);

  const handleBackView = useCallback(() => {
    const lastView = viewHistory[viewHistory.length - 1];
    if (lastView) {
      setCurrentView(lastView);
      setViewHistory((prev) => prev.slice(0, -1));
      onViewChange?.({ view: lastView });
    }
  }, [viewHistory, onViewChange]);

  const handleActiveDateChange = useCallback((newDate) => {
    setActiveDate(newDate);
    onActiveStartDateChange?.({ activeStartDate: newDate });
  }, [onActiveStartDateChange]);

  const handleDateSelect = useCallback((date) => {
    if (selectRange) {
      if (!rangeStart) {
        setRangeStart(date);
        setSelectedValue([date]);
        onChange?.([date]);
      } else {
        if (rangeLimit) {
          const diffTime = Math.abs(date - rangeStart);
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          if (diffDays > rangeLimit) {
            return;
          }
        }
        const range = [rangeStart, date].sort((a, b) => a - b);
        setSelectedValue(range);
        setRangeStart(null);
        onChange?.(range);
      }
    } else {
      setSelectedValue(date);
      onChange?.(date);
    }
  }, [selectRange, rangeStart, onChange, rangeLimit]);

  const isDateDisabled = useCallback((date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (disableDate) return disableDate(date);
    return false;
  }, [minDate, maxDate, disableDate]);

  const isYearDisabled = useCallback((year) => {
    if (disableYear) return disableYear(year);
    return false;
  }, [disableYear]);

  const handleHover = useCallback((date) => {
    if (selectRange && rangeStart && !selectedValue[1]) {
      hoverRef.current = date;
      onRangeHover?.({ start: rangeStart, end: date });
    }
  }, [selectRange, rangeStart, selectedValue, onRangeHover]);

  const handleKeyDown = useCallback((e) => {
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
  }, [currentView, activeDate, handleActiveDateChange, handleDateSelect, isDateDisabled, handleBackView]);

  const getTileClassName = useCallback(
    ({ date }) => {
      const baseClasses = tileClassName?.({ date }) || '';
      const eventClasses = events.some(
        (event) => event.date.toDateString() === date.toDateString()
      ) ? 'has-event' : '';
      if (selectRange && rangeStart && !selectedValue[1]) {
        const [start, end] = date > rangeStart ? [rangeStart, date] : [date, rangeStart];
        if (date.toDateString() === rangeStart.toDateString()) {
          return `${baseClasses} selected-start ${eventClasses}`;
        }
        if (hoverRef.current && date >= start && date <= end) {
          if (date.toDateString() === hoverRef.current.toDateString()) {
            return `${baseClasses} hover-range ${eventClasses}`;
          }
          return `${baseClasses} in-range ${eventClasses}`;
        }
      }
      if (Array.isArray(selectedValue)) {
        if (selectedValue[0] && date.toDateString() === selectedValue[0].toDateString()) {
          return `${baseClasses} selected-start ${eventClasses}`.trim();
        }
        if (selectedValue[1] && date.toDateString() === selectedValue[1].toDateString()) {
          return `${baseClasses} selected-end ${eventClasses}`.trim();
        }
        if (selectedValue[0] && selectedValue[1] && date > selectedValue[0] && date < selectedValue[1]) {
          return `${baseClasses} in-range ${eventClasses}`.trim();
        }
      }
      return `${baseClasses} ${eventClasses}`.trim();
    },
    [tileClassName, selectRange, rangeStart, selectedValue, hoverRef, events]
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
            locale={locale}
            onDrillUp={() => {
              handleViewChange('month');
              onDrillUp?.();
            }}
          />
        );
      case 'year':
        return renderYearView ? (
          renderYearView({ date: activeDate, onMonthSelect })
        ) : (
          <YearView
            date={activeDate}
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`calendar ${className} ${showDoubleView ? 'double-view' : ''} theme-${theme}`}
      style={style}
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
          />
        ))}
      <div className="calendar-container">{renderView()}</div>
      {viewHistory.length > 0 && (
        <button
          className="back-button"
          onClick={handleBackView}
          aria-label="Back to previous view"
        >
          Back
        </button>
      )}
    </div>
  );
};

export default Calendar;