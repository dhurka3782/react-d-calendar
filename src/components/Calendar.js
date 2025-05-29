import React, { useState, useCallback, useRef } from 'react';
import Header from './Header';
import MonthView from './MonthView';
import YearView from './YearView';
import DayView from './DayView';
import { getDaysInMonth, getWeeksInMonth } from '../utils/dateUtils';
import './styles.css';

const Calendar = (props) => {
  const {
    date = new Date(2025, 4, 28, 14, 56), 
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
    showDoubleView = props.showDoubleView ?? false,
    showFixedNumberOfWeeks = false,
    showNavigation = true,
    showNeighboringMonth = true,
    showNeighboringDecade = true,
    showNeighboringCentury = true,
    showWeekNumbers = false,
    view = 'month',
    defaultView = 'month',
    maxDetail = 'month',
    minDetail = 'year',
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
    onClickDecade,
    onClickWeekNumber,
    onActiveStartDateChange,
    onViewChange,
    onDrillDown,
    onDrillUp,
    goToRangeStartOnSelect = true,
    tileClassName,
    tileContent,
    tileDisabled,
    className = '',
    style = {},
    inputRef,
    returnValue = 'range',
  } = props;

  const [currentView, setCurrentView] = useState(defaultView);
  const [activeDate, setActiveDate] = useState(activeStartDate || defaultActiveStartDate || date);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || null);
  const [rangeStart, setRangeStart] = useState(null);
  const hoverRef = useRef(null);

  const handleViewChange = useCallback((newView) => {
    if (
      (newView === 'day' && maxDetail === 'month') ||
      (newView === 'year' && minDetail === 'month')
    ) {
      return;
    }
    setCurrentView(newView);
    onViewChange?.({ view: newView });
  }, [maxDetail, minDetail, onViewChange]);

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
        const range = [rangeStart, date].sort((a, b) => a - b);
        setSelectedValue(range);
        setRangeStart(null);
        onChange?.(range);
      }
    } else {
      setSelectedValue(date);
      onChange?.(date);
    }
  }, [selectRange, rangeStart, onChange]);

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
    }
  }, [selectRange, rangeStart, selectedValue]);

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
      default:
        break;
    }
  }, [currentView, activeDate, handleActiveDateChange, handleDateSelect, isDateDisabled]);

  // Memoize tileClassName to ensure stability
 const getTileClassName = useCallback(
    ({ date }) => {
      const baseClasses = props.tileClassName?.({ date }) || '';
      if (selectRange && rangeStart && !selectedValue[1]) {
        if (date.toDateString() === rangeStart.toDateString()) {
          return `${baseClasses} selected-start`.trim();
        }
        if (hoverRef.current && date > rangeStart && date < hoverRef.current) {
          return `${baseClasses} in-range`.trim();
        }
        if (hoverRef.current && date.toDateString() === hoverRef.current.toDateString()) {
          return `${baseClasses} hover-range`.trim();
        }
      }
      if (Array.isArray(selectedValue)) {
        if (selectedValue[0] && date.toDateString() === selectedValue[0].toDateString()) {
          return `${baseClasses} selected-start`.trim();
        }
        if (selectedValue[1] && date.toDateString() === selectedValue[1].toDateString()) {
          return `${baseClasses} selected-end`.trim();
        }
        if (selectedValue[0] && selectedValue[1] && date > selectedValue[0] && date < selectedValue[1]) {
          return `${baseClasses} in-range`.trim();
        }
      }
      return baseClasses;
    },
    [props.tileClassName, selectRange, rangeStart, selectedValue, hoverRef]
  );

  const renderView = () => {
    switch (currentView) {
      case 'day':
        return (
          <DayView
            date={activeDate}
            onDateSelect={handleDateSelect}
            tileContent={tileContent}
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
        return (
          <YearView
            date={activeDate}
            onMonthSelect={(monthDate) => {
              handleActiveDateChange(monthDate);
              handleViewChange('month');
              onClickMonth?.(monthDate);
              onDrillDown?.();
            }}
            tileDisabled={isYearDisabled}
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
        return (
          <MonthView
            date={activeDate}
            onDateSelect={handleDateSelect}
            onClickWeekNumber={onClickWeekNumber}
            tileContent={tileContent}
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
      className={`calendar ${className} ${showDoubleView ? 'double-view' : ''}`}
      style={style}
      ref={inputRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {showNavigation && (
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
      )}
      <div className="calendar-container">{renderView()}</div>
    </div>
  );
};

export default Calendar;