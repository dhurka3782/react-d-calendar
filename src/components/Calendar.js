import React, { useState, useCallback } from 'react';
import Header from './Header';
import MonthView from './MonthView';
import YearView from './YearView';
import DayView from './DayView';
import { getDaysInMonth, getWeeksInMonth } from '../utils/dateUtils';
import './styles.css';

const Calendar = ({
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
  locale,
  showDoubleView = false,
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
}) => {
  const [currentView, setCurrentView] = useState(defaultView);
  const [activeDate, setActiveDate] = useState(activeStartDate || defaultActiveStartDate || date);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || null);
  const [rangeStart, setRangeStart] = useState(null);

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
      } else {
        const range = [rangeStart, date].sort((a, b) => a - b);
        setSelectedValue(range);
        setRangeStart(null);
        if (goToRangeStartOnSelect) {
          handleActiveDateChange(range[0]);
        }
        onChange?.(returnValue === 'range' ? range : returnValue === 'start' ? range[0] : range[1]);
      }
    } else {
      setSelectedValue(date);
      onChange?.(date);
    }
  }, [selectRange, rangeStart, goToRangeStartOnSelect, returnValue, onChange, handleActiveDateChange]);

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

  const renderView = () => {
    switch (currentView) {
      case 'day':
        return (
          <DayView
            date={activeDate}
            onDateSelect={handleDateSelect}
            tileContent={tileContent}
            tileClassName={tileClassName}
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
      // Inside renderView case 'month' in Calendar.js
      case 'month':
        return (
          <MonthView
            date={activeDate}
            onDateSelect={handleDateSelect}
            onClickWeekNumber={onClickWeekNumber}
            tileContent={tileContent}
            tileClassName={tileClassName}
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
          />
        );
    }
  };

  return (
    <div className={`calendar ${className} ${showDoubleView ? 'double-view' : ''}`} style={style} ref={inputRef}>
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
        />
      )}
      <div className="calendar-container">
        {renderView()}
      </div>
    </div>
  );
};

export default Calendar;