import React, { useCallback, useState } from 'react';
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
  weekdayFormat = 'short',
  locale,
  calendarType,
  onDrillDown,
  onDrillUp,
  showDoubleView,
  value,
  onHover,
  onClearHover,
  today = new Date(),
  weekStartDay = 0,
  className,
  onClickEvent,
  events = [],
  renderEvent,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleKeyDown = useCallback(
    (e, dayInfo) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!tileDisabled?.({ date: dayInfo.date })) {
          onDateSelect(dayInfo.date);
        }
      }
    },
    [onDateSelect, tileDisabled]
  );

  const handleMouseDown = useCallback(
    (dayInfo) => {
      if (!tileDisabled?.({ date: dayInfo.date })) {
        setIsDragging(true);
        onDateSelect(dayInfo.date);
      }
    },
    [onDateSelect, tileDisabled]
  );

 const handleMouseOver = useCallback(
    (date) => {
      if (!tileDisabled?.({ date })) {
        console.log('Mouse over date:', date.toISOString());
        onHover?.(date);
      }
    },
    [onHover, tileDisabled]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e, date) => {
      e.preventDefault();
      if (!tileDisabled?.({ date })) {
        setIsDragging(true);
        onDateSelect(date);
      }
    },
    [onDateSelect, tileDisabled]
  );

  const handleTouchMove = useCallback(
    (e, date) => {
      e.preventDefault();
      if (!tileDisabled?.({ date })) {
        onHover?.(date); 
      }
    },
    [onHover, tileDisabled]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getWeekdayLabel = (index) => {
    const weekdayDate = new Date(today.getFullYear(), 0, ((index + weekStartDay) % 7) + 4);
    if (formatWeekday) {
      return formatWeekday(weekdayDate, locale);
    }
    if (weekdayFormat === 'full') {
      return weekdayDate.toLocaleString(locale, { weekday: 'long' }).toUpperCase();
    } else if (weekdayFormat === 'short') {
      return formatShortWeekday
        ? formatShortWeekday(weekdayDate, locale)
        : weekdayDate.toLocaleString(locale, { weekday: 'short' }).toUpperCase();
    } else if (weekdayFormat === 'minimal') {
      return ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'][(index + weekStartDay) % 7];
    }
    return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][(index + weekStartDay) % 7];
  };

  const renderMonth = (monthOffset = 0) => {
    const displayDate = new Date(date);
    displayDate.setMonth(date.getMonth() + monthOffset);
    const days = getDaysInMonth(
      displayDate,
      weekStartDay,
      calendarType,
      showFixedNumberOfWeeks,
      showNeighboringMonth
    );
    const weeks = showWeekNumbers ? getWeeksInMonth(displayDate, weekStartDay) : [];

    const rangeStart = Array.isArray(value) ? value[0] : null;
    const rangeEnd = Array.isArray(value) && value.length === 2 ? value[1] : null;

    return (
      <div className={`calendar-instance ${className || ''}`}>
        <div className="calendar-weekdays">
          {showWeekNumbers && <div className="weekday week-number">Week</div>}
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className={`weekday ${
                index === (5 + weekStartDay) % 7
                  ? 'saturday'
                  : index === (6 + weekStartDay) % 7
                  ? 'sunday'
                  : ''
              }`}
            >
              {getWeekdayLabel(index)}
            </div>
          ))}
        </div>
        <div
          className="calendar-days"
          onMouseLeave={onClearHover}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
        >
          {showWeekNumbers &&
            weeks.map((week, index) => (
              <button
                key={`week-${index}`}
                className="week-number"
                onClick={() =>
                  onClickWeekNumber?.(week, new Date(displayDate.getFullYear(), displayDate.getMonth(), 1))
                }
              >
                {week}
              </button>
            ))}
          {days.map((dayInfo, index) => {
            const isToday = dayInfo.date.toDateString() === today.toDateString();
            const isSaturday = dayInfo.date.getDay() === (5 + weekStartDay) % 7;
            const isSunday = dayInfo.date.getDay() === (6 + weekStartDay) % 7;
            const isDisabled = tileDisabled?.({ date: dayInfo.date });
            const isSelectedStart = rangeStart && dayInfo.date.toDateString() === rangeStart.toDateString();
            const isSelectedEnd = rangeEnd && dayInfo.date.toDateString() === rangeEnd.toDateString();
            const isInRange = rangeStart && rangeEnd && dayInfo.date > rangeStart && dayInfo.date < rangeEnd;
            const event = events.find((e) => e.date.toDateString() === dayInfo.date.toDateString());

            return (
              <button
                key={index}
                onClick={() => !isDisabled && (event ? onClickEvent?.(event) : onDateSelect(dayInfo.date))}
                onDoubleClick={() => !isDisabled && onDrillDown?.()}
                onMouseDown={() => handleMouseDown(dayInfo)}
                onMouseEnter={() => handleMouseOver(dayInfo.date)}
                onTouchStart={(e) => handleTouchStart(e, dayInfo.date)}
                onTouchMove={(e) => handleTouchMove(e, dayInfo.date)}
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
                aria-label={`Select ${dayInfo.date.toLocaleDateString(locale, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}`}
                tabIndex={isDisabled ? -1 : 0}
              >
                {tileContent ? (
                  tileContent({ date: dayInfo.date, view: 'month', event })
                ) : event ? (
                  renderEvent ? (
                    renderEvent({ event, date: dayInfo.date })
                  ) : (
                    <Day dayInfo={dayInfo} formatDay={formatDay} locale={locale} />
                  )
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