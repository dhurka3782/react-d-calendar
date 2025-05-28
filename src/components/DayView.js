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
}) => {
  const isDisabled = tileDisabled?.(date);
  const today = new Date(2025, 4, 28, 14, 33); 
  const isToday = date.toDateString() === today.toDateString();

  return (
    <div className="day-view">
      <button
        onClick={() => !isDisabled && onDateSelect(date)}
        onDoubleClick={() => !isDisabled && onDrillUp?.()}
        disabled={isDisabled}
        className={`day-detail ${isToday ? 'today' : ''} ${tileClassName?.({ date }) || ''}`}
        aria-label={`Select ${date.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })}`}
        tabIndex={isDisabled ? -1 : 0}
      >
        {tileContent ? (
          tileContent({ date, view: 'day' })
        ) : (
          <div className="day-detail-content">
            <span className="day-detail-date">
              {formatLongDate ? formatLongDate(date, locale) : date.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <div className="day-detail-events">
              {/* Placeholder for events or notes */}
              {isToday && <span className="event-indicator">Today's Events: None</span>}
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default React.memo(DayView);