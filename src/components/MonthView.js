import React, { useCallback } from 'react';
import { getDaysInMonth, getWeeksInMonth } from '../utils/dateUtils';
import Day from './Day';

const MonthView = ({
  date,
  onDateSelect,
  onClickWeekNumber,
  tileContent,
  tileClassName,
  tileDisabled,
  showWeekNumbers,
  showNeighboringMonth,
  showFixedNumberOfWeeks,
  formatDay,
  formatWeekday,
  formatShortWeekday,
  locale,
  calendarType,
  onDrillDown,
  onDrillUp,
  showDoubleView,
  value,
  onHover,
  onClearHover,
}) => {
  const today = new Date(); 

  const handleKeyDown = useCallback((e, dayInfo) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!tileDisabled?.(dayInfo.date)) {
        onDateSelect(dayInfo.date);
      }
    }
  }, [onDateSelect, tileDisabled]);

  const renderMonth = (monthOffset = 0) => {
    const displayDate = new Date(date);
    displayDate.setMonth(date.getMonth() + monthOffset);
    const days = getDaysInMonth(displayDate, 1, calendarType, showFixedNumberOfWeeks, showNeighboringMonth);
    const weeks = showWeekNumbers ? getWeeksInMonth(displayDate, 1) : [];
    const weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

    const rangeStart = Array.isArray(value) ? value[0] : null;
    const rangeEnd = Array.isArray(value) && value.length === 2 ? value[1] : null;

    return (
      <div className="calendar-instance">
        <div className="calendar-weekdays">
          {showWeekNumbers && <div className="weekday week-number">Week</div>}
          {weekdays.map((day, index) => (
            <div
              key={day}
              className={`weekday ${index === 5 ? 'saturday' : ''} ${index === 6 ? 'sunday' : ''}`}
            >
              {formatWeekday ? formatWeekday(new Date(2025, 0, index + 1), locale) : day}
            </div>
          ))}
        </div>
        <div className="calendar-days"  onMouseLeave={onClearHover}>
          {showWeekNumbers &&
            weeks.map((week, index) => (
              <button
                key={`week-${index}`}
                className="week-number"
                onClick={() => onClickWeekNumber?.(week, new Date(displayDate.getFullYear(), displayDate.getMonth(), 1))}
              >
                {week}
              </button>
            ))}
          {days.map((dayInfo, index) => {
            const isToday = dayInfo.date.toDateString() === today.toDateString();
            const isSaturday = dayInfo.date.getDay() === 6;
            const isSunday = dayInfo.date.getDay() === 0;
            const isDisabled = tileDisabled?.(dayInfo.date);
            const isSelectedStart = rangeStart && dayInfo.date.toDateString() === rangeStart.toDateString();
            const isSelectedEnd = rangeEnd && dayInfo.date.toDateString() === rangeEnd.toDateString();
            const isInRange = rangeStart && rangeEnd && dayInfo.date > rangeStart && dayInfo.date < rangeEnd;

            return (
              <button
                key={index}
                onClick={() => !isDisabled && onDateSelect(dayInfo.date)}
                onDoubleClick={() => !isDisabled && onDrillDown?.()}
                onMouseEnter={() => !isDisabled && onHover?.(dayInfo.date)}
                onKeyDown={(e) => handleKeyDown(e, dayInfo)}
                disabled={isDisabled}
                className={`calendar-day
                  ${isToday ? 'today' : ''}
                  ${isSaturday ? 'saturday' : ''}
                  ${isSunday ? 'sunday' : ''}
                  ${!dayInfo.isCurrentMonth ? 'adjacent-month' : ''}
                  ${tileClassName?.({ date: dayInfo.date }) || ''}
                  ${isDisabled ? 'disabled' : ''}
                  ${isSelectedStart ? 'selected-start' : ''}
                  ${isSelectedEnd ? 'selected-end' : ''}
                  ${isInRange ? 'in-range' : ''}`.trim()}
                aria-label={`Select ${dayInfo.date.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })}`}
                tabIndex={isDisabled ? -1 : 0}
              >
                {tileContent ? (
                  tileContent({ date: dayInfo.date, view: 'month' })
                ) : (
                  <Day dayInfo={dayInfo} formatDay={formatDay} locale={locale} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`calendar-container ${showDoubleView ? 'double-view' : ''}`}>
      {showDoubleView ? (
        <>
          {renderMonth(0)}
          {renderMonth(1)}
        </>
      ) : (
        renderMonth(0)
      )}
    </div>
  );
};

export default React.memo(MonthView);