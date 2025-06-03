import React from 'react';

const DayView = ({
  date,
  onDateSelect,
  tileContent,
  tileClassName,
  tileDisabled,
  formatLongDate,
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

  const content = tileContent ? (
    tileContent({ date, view: 'day', event })
  ) : (
    <div className="day-detail-content">
      <span className="day-detail-date">
        {formatLongDate
          ? formatLongDate(date, locale)
          : date.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </span>
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