import React from 'react';

const DayView = ({
  date,
  onDateSelect,
  tileContent,
  tileClassName,
  tileDisabled,
  formatLongDate,
  dateFormat = 'mm/dd/yyyy',
  weekdayFormat = 'short',
  monthFormat = 'long',
  includeTime = false,
  locale,
  onDrillUp,
  today = new Date(),
  className,
  onClickEvent,
  events = [],
  renderEvent,
}) => {
  const isDisabled = tileDisabled?.({ date });
  const isToday = date.toDateString() === today.toDateString();
  const event = events.find((e) => e.date.toDateString() === date.toDateString());

  const getFormattedDate = () => {
    const options = {
      day: 'numeric',
      year: dateFormat.includes('yyyy') ? 'numeric' : '2-digit',
    };

    // Weekday format
    if (weekdayFormat === 'long') {
      options.weekday = 'long';
    } else if (weekdayFormat === 'short') {
      options.weekday = 'short';
    } else if (weekdayFormat === 'minimal') {
      options.weekday = 'narrow';
    }

    // Month format
    if (monthFormat === 'long') {
      options.month = 'long';
    } else if (monthFormat === 'short') {
      options.month = 'short';
    } else if (monthFormat === 'numeric') {
      options.month = '2-digit';
    }

    // Time inclusion
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.second = '2-digit';
    }

    // Custom date format
    let formattedDate = formatLongDate
      ? formatLongDate(date, locale)
      : date.toLocaleDateString(locale, options);

    // Adjust for custom date formats
    const [part1, part2, part3] = dateFormat.split(/[-/]/);
    const parts = {
      mm: options.month === '2-digit' ? date.toLocaleDateString(locale, { month: '2-digit' }) : date.toLocaleDateString(locale, { month: 'short' }),
      dd: date.toLocaleDateString(locale, { day: '2-digit' }),
      yyyy: date.toLocaleDateString(locale, { year: 'numeric' }),
      yy: date.toLocaleDateString(locale, { year: '2-digit' }),
    };

    formattedDate = dateFormat
      .replace('mm', parts.mm)
      .replace('dd', parts.dd)
      .replace('yyyy', parts.yyyy)
      .replace('yy', parts.yy);

    if (includeTime) {
      formattedDate += ` ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }

    return formattedDate;
  };

  const content = tileContent ? (
    tileContent({ date, view: 'day', event })
  ) : (
    <div className="day-detail-content">
      <span className="day-detail-date">{getFormattedDate()}</span>
      <div className="day-detail-events">
        {isToday && !event && <span className="event-indicator">Today's Events: None</span>}
        {event &&
          (renderEvent ? (
            renderEvent({ event, date })
          ) : (
            <span className="event-indicator">{event.title || 'Event'}</span>
          ))}
      </div>
    </div>
  );

  return (
    <div className={`day-view ${className || ''}`}>
      <button
        onClick={() => !isDisabled && (event ? onClickEvent?.(event) : onDateSelect(date))}
        onDoubleClick={() => !isDisabled && onDrillUp?.()}
        disabled={isDisabled}
        className={`day-detail ${isToday ? 'today' : ''} ${tileClassName?.({ date }) || ''}`}
        aria-label={`Select ${date.toLocaleDateString(locale, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}`}
        tabIndex={isDisabled ? -1 : 0}
      >
        {content}
      </button>
    </div>
  );
};

export default React.memo(DayView);