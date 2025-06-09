import React from 'react';
import PropTypes from 'prop-types';

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
  selectOnEventClick = true,
}) => {
  const validDateFormats = ['mm/dd/yyyy', 'dd/mm/yyyy', 'yyyy-mm-dd', 'mm-dd-yyyy', 'dd-mm-yyyy'];
  if (!validDateFormats.includes(dateFormat)) {
    console.warn(`Invalid dateFormat: ${dateFormat}. Defaulting to 'mm/dd/yyyy'.`);
    dateFormat = 'mm/dd/yyyy';
  }

  const isDisabled = tileDisabled?.({ date });
  const isToday = date.toDateString() === today.toDateString();
  const event = events.find((e) => e.date.toDateString() === date.toDateString());

  const getFormattedDate = () => {
    const options = {
      day: 'numeric',
      year: dateFormat.includes('yyyy') ? 'numeric' : '2-digit',
    };

    if (weekdayFormat === 'long') {
      options.weekday = 'long';
    } else if (weekdayFormat === 'short') {
      options.weekday = 'short';
    } else if (weekdayFormat === 'minimal') {
      options.weekday = 'narrow';
    }

    if (monthFormat === 'long') {
      options.month = 'long';
    } else if (monthFormat === 'short') {
      options.month = 'short';
    } else if (monthFormat === 'numeric') {
      options.month = '2-digit';
    }

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.second = '2-digit';
    }

    let formattedDate = formatLongDate
      ? formatLongDate(date, locale)
      : date.toLocaleDateString(locale, options);

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
        onClick={() => {
          if (!isDisabled) {
            if (event) {
              onClickEvent?.(event);
              if (selectOnEventClick) {
                onDateSelect(date);
              }
            } else {
              onDateSelect(date);
            }
          }
        }}
        onDoubleClick={() => !isDisabled && onDrillUp?.()}
        disabled={isDisabled}
        className={`day-detail ${isToday ? 'today' : ''} ${tileClassName?.({ date }) || ''}`}
        aria-label={`Select ${date.toLocaleDateString(locale, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}`}
        aria-describedby={event ? `event-day-${date.toISOString()}` : undefined}
        tabIndex={isDisabled ? -1 : 0}
      >
        {event && (
          <span id={`event-day-${date.toISOString()}`} className="sr-only">
            {event.title || 'Event'}
          </span>
        )}
        {content}
      </button>
    </div>
  );
};

DayView.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onDateSelect: PropTypes.func.isRequired,
  tileContent: PropTypes.func,
  tileClassName: PropTypes.func,
  tileDisabled: PropTypes.func,
  formatLongDate: PropTypes.func,
  dateFormat: PropTypes.oneOf(['mm/dd/yyyy', 'dd/mm/yyyy', 'yyyy-mm-dd', 'mm-dd-yyyy', 'dd-mm-yyyy']),
  weekdayFormat: PropTypes.oneOf(['short', 'full', 'minimal']),
  monthFormat: PropTypes.oneOf(['long', 'short', 'numeric']),
  includeTime: PropTypes.bool,
  locale: PropTypes.string,
  onDrillUp: PropTypes.func,
  today: PropTypes.instanceOf(Date),
  className: PropTypes.string,
  onClickEvent: PropTypes.func,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
      title: PropTypes.string,
      type: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  renderEvent: PropTypes.func,
  selectOnEventClick: PropTypes.bool,
};

DayView.defaultProps = {
  dateFormat: 'mm/dd/yyyy',
  weekdayFormat: 'short',
  monthFormat: 'long',
  includeTime: false,
  locale: 'en-US',
  today: new Date(),
  events: [],
  selectOnEventClick: true,
};

export default React.memo(DayView);