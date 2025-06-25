import React from 'react';
import PropTypes from 'prop-types';
import { isValidDate, sanitizeDate } from '../utils/dateUtils';

const DayView = ({
  date = new Date(),
  onDateSelect,
  tileContent,
  tileClassName,
  tileDisabled,
  formatLongDate,
  dateFormat = 'mm/dd/yyyy',
  weekdayFormat = 'short',
  monthFormat = 'long',
  includeTime = false,
  locale = 'en-US',
  onDrillUp,
  today = new Date(),
  className = '',
  onClickEvent,
  events = [],
  renderEvent,
  selectOnEventClick = true,
}) => {
  const validDate = isValidDate(date) ? sanitizeDate(date) : new Date();
  const validToday = isValidDate(today) ? sanitizeDate(today) : new Date();
  const validEvents = events.filter((e) => isValidDate(e.date)).map((e) => ({ ...e, date: sanitizeDate(e.date) }));

  const validDateFormats = ['mm/dd/yyyy', 'dd/mm/yyyy', 'yyyy-mm-dd', 'mm-dd-yyyy', 'dd-mm-yyyy'];
  const effectiveDateFormat = validDateFormats.includes(dateFormat) ? dateFormat : 'mm/dd/yyyy';

  const isDisabled = tileDisabled?.({ date: validDate });
  const isToday = validDate.toDateString() === validToday.toDateString();
  const event = validEvents.find((e) => e.date.toDateString() === validDate.toDateString());

  const getFormattedDate = () => {
    const options = {
      day: 'numeric',
      year: effectiveDateFormat.includes('yyyy') ? 'numeric' : '2-digit',
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
      ? formatLongDate(validDate, locale)
      : validDate.toLocaleDateString(locale, options);

    const parts = {
      mm: options.month === '2-digit' ? validDate.toLocaleDateString(locale, { month: '2-digit' }) : validDate.toLocaleDateString(locale, { month: 'short' }),
      dd: validDate.toLocaleDateString(locale, { day: '2-digit' }),
      yyyy: validDate.toLocaleDateString(locale, { year: 'numeric' }),
      yy: validDate.toLocaleDateString(locale, { year: '2-digit' }),
    };

    formattedDate = effectiveDateFormat
      .replace('mm', parts.mm)
      .replace('dd', parts.dd)
      .replace('yyyy', parts.yyyy)
      .replace('yy', parts.yy);

    if (includeTime) {
      formattedDate += ` ${validDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }

    return formattedDate;
  };

  const content = tileContent ? (
    tileContent({ date: validDate, view: 'day', event })
  ) : (
    <div className="day-detail-content">
      <span className="day-detail-date">{getFormattedDate()}</span>
      <div className="day-detail-events">
        {isToday && !event && <span className="event-indicator">Today's Events: None</span>}
        {event &&
          (renderEvent ? (
            renderEvent({ event, date: validDate })
          ) : (
            <span className="event-indicator">{event.title || 'Event'}</span>
          ))}
      </div>
    </div>
  );

  return (
    <div className={`day-view ${className}`}>
      <button
        onClick={() => {
          if (!isDisabled) {
            if (event) {
              onClickEvent?.(event);
              if (selectOnEventClick) {
                onDateSelect?.(validDate);
              }
            } else {
              onDateSelect?.(validDate);
            }
          }
        }}
        onDoubleClick={() => !isDisabled && onDrillUp?.()}
        disabled={isDisabled}
        className={`day-detail ${isToday ? 'today' : ''} ${tileClassName?.({ date: validDate }) || ''}`}
        aria-label={`Select ${validDate.toLocaleDateString(locale, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })} ${event ? `with event ${event.title || 'unnamed'}` : ''}`}
        aria-describedby={event ? `event-day-${validDate.toISOString()}` : undefined}
        tabIndex={isDisabled ? -1 : 0}
      >
        {event && (
          <span id={`event-day-${validDate.toISOString()}`} className="sr-only">
            Event: {event.title || 'Unnamed'}
          </span>
        )}
        {content}
      </button>
    </div>
  );
};

DayView.propTypes = {
  date: PropTypes.instanceOf(Date),
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

export default React.memo(DayView);