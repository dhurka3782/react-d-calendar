import React, { useCallback, useState } from 'react';
import { getDaysInMonth, getWeeksInMonth, isValidDate, sanitizeDate } from '../utils/dateUtils';
import Day from './Day';

const MonthView = ({
  date = new Date(),
  onDateSelect,
  onClickWeekNumber,
  tileContent,
  tileClassName,
  tileDisabled,
  showWeekNumbers = false,
  showNeighboringMonth = true,
  showFixedNumberOfWeeks = false,
  formatDay,
  formatWeekday,
  formatShortWeekday,
  weekdayFormat = 'short',
  locale = 'en-US',
  calendarType = 'gregorian',
  onDrillDown,
  onDrillUp,
  showDoubleView = false,
  value,
  onHover,
  onClearHover,
  today = new Date(),
  weekStartDay = 0,
  className = '',
  onClickEvent,
  events = [],
  renderEvent,
  renderDayCell,
  rangeLimit,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [rangeLimitMessage, setRangeLimitMessage] = useState(null);

  const validDate = isValidDate(date) ? sanitizeDate(date) : new Date();
  const validToday = isValidDate(today) ? sanitizeDate(today) : new Date();
  const validEvents = events.filter((e) => isValidDate(e.date)).map((e) => ({ ...e, date: sanitizeDate(e.date) }));

  const handleKeyDown = useCallback(
    (e, dayInfo) => {
      if (!isValidDate(dayInfo.date)) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!tileDisabled?.({ date: dayInfo.date })) {
          onDateSelect?.(dayInfo.date);
        }
      }
    },
    [onDateSelect, tileDisabled]
  );

  const handleMouseDown = useCallback(
    (dayInfo) => {
      if (!isValidDate(dayInfo.date) || tileDisabled?.({ date: dayInfo.date })) return;
      setIsDragging(true);
      onDateSelect?.(dayInfo.date);
    },
    [onDateSelect, tileDisabled]
  );

  const handleMouseOver = useCallback(
    (date) => {
      if (!isValidDate(date) || tileDisabled?.({ date })) return;
      console.log('Mouse over date:', date.toISOString());
      if (rangeLimit && Array.isArray(value) && value[0] && !value[1]) {
        const diffTime = Math.abs(date - value[0]);
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays > rangeLimit) {
          setRangeLimitMessage(`Range exceeds limit of ${rangeLimit} days`);
          return;
        } else {
          setRangeLimitMessage(null);
        }
      }
      onHover?.(date);
    },
    [onHover, tileDisabled, rangeLimit, value]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setRangeLimitMessage(null);
  }, []);

  const handleTouchStart = useCallback(
    (e, date) => {
      if (!isValidDate(date) || tileDisabled?.({ date })) return;
      e.preventDefault();
      setIsDragging(true);
      onDateSelect?.(date);
    },
    [onDateSelect, tileDisabled]
  );

  const handleTouchMove = useCallback(
    (e, date) => {
      if (!isValidDate(date) || tileDisabled?.({ date })) return;
      e.preventDefault();
      onHover?.(date);
    },
    [onHover, tileDisabled]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setRangeLimitMessage(null);
  }, []);

  const getWeekdayLabel = (index) => {
    const weekdayDate = new Date(validToday.getFullYear(), 0, ((index + weekStartDay) % 7) + 1);
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
      const minimalDays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
      return minimalDays[(index + weekStartDay) % 7];
    }
    return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][(index + weekStartDay) % 7];
  };

  const renderMonth = (monthOffset = 0) => {
    const displayDate = new Date(validDate);
    displayDate.setMonth(validDate.getMonth() + monthOffset);
    const days = getDaysInMonth(
      displayDate,
      weekStartDay,
      calendarType,
      showFixedNumberOfWeeks,
      showNeighboringMonth
    );
    const weeks = showWeekNumbers ? getWeeksInMonth(displayDate, weekStartDay) : [];

    const rangeStart = Array.isArray(value) && isValidDate(value[0]) ? value[0] : null;
    const rangeEnd = Array.isArray(value) && value.length === 2 && isValidDate(value[1]) ? value[1] : null;

    return (
      <div className={`calendar-instance ${className}`} key={`month-${monthOffset}`}>
        <div className="calendar-weekdays">
          {showWeekNumbers && <div className="weekday week-number">Week</div>}
          {Array.from({ length: 7 }).map((_, index) => {
            const absoluteIndex = (index + weekStartDay) % 7;
            const isSaturday = absoluteIndex === 6;
            const isSunday = absoluteIndex === 0;
            return (
              <div
                key={index}
                className={`weekday ${isSaturday ? 'saturday' : ''} ${isSunday ? 'sunday' : ''}`}
                aria-label={getWeekdayLabel(index)}
              >
                {getWeekdayLabel(index)}
              </div>
            );
          })}
        </div>
        <div
          className="calendar-days"
          onMouseLeave={onClearHover}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          role="grid"
          aria-label={`Days of ${displayDate.toLocaleString(locale, { month: 'long', year: 'numeric' })}`}
        >
          {showWeekNumbers &&
            weeks.map((week, index) => (
              <button
                key={`week-${index}`}
                className="week-number"
                onClick={() =>
                  onClickWeekNumber?.(week, new Date(displayDate.getFullYear(), displayDate.getMonth(), 1))
                }
                aria-label={`Select week ${week}`}
              >
                {week}
              </button>
            ))}
          {days.map((dayInfo, index) => {
            if (!isValidDate(dayInfo.date)) return null;
            const isToday = dayInfo.date.toDateString() === validToday.toDateString();
            const isSaturday = dayInfo.date.getDay() === 6;
            const isSunday = dayInfo.date.getDay() === 0;
            const isDisabled = tileDisabled?.({ date: dayInfo.date });
            const isSelectedStart = rangeStart && dayInfo.date.toDateString() === rangeStart.toDateString();
            const isSelectedEnd = rangeEnd && dayInfo.date.toDateString() === rangeEnd.toDateString();
            const isInRange =
              rangeStart && rangeEnd && dayInfo.date > rangeStart && dayInfo.date < rangeEnd;
            const event = validEvents.find((e) => e.date.toDateString() === dayInfo.date.toDateString());

            const defaultContent = event ? (
              renderEvent ? (
                renderEvent({ event, date: dayInfo.date })
              ) : (
                <Day dayInfo={dayInfo} formatDay={formatDay} locale={locale} />
              )
            ) : (
              tileContent ? (
                tileContent({ date: dayInfo.date, view: 'month', event })
              ) : (
                <Day dayInfo={dayInfo} formatDay={formatDay} locale={locale} />
              )
            );

            const content = renderDayCell
              ? renderDayCell({
                  date: dayInfo.date,
                  isCurrentMonth: dayInfo.isCurrentMonth,
                  isToday,
                  isDisabled,
                  isSelectedStart,
                  isSelectedEnd,
                  isInRange,
                  event,
                  defaultContent,
                })
              : defaultContent;

            return (
              <button
                key={index}
                onClick={() => !isDisabled && (event ? onClickEvent?.(event) : onDateSelect?.(dayInfo.date))}
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
                })} ${event ? `with event ${event.title || 'unnamed'}` : ''}`}
                tabIndex={isDisabled ? -1 : 0}
                role="gridcell"
              >
                {content}
                {event && (
                  <span id={`event-${dayInfo.date.toISOString()}`} className="sr-only">
                    Event: {event.title || 'Unnamed'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {rangeLimitMessage && (
          <div className="range-limit-message" role="alert">
            {rangeLimitMessage}
          </div>
        )}
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