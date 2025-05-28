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

  return (
    <div className="day-view">
      <button
        onClick={() => !isDisabled && onDateSelect(date)}
        onDoubleClick={() => !isDisabled && onDrillUp?.()}
        disabled={isDisabled}
        className={`day-detail ${tileClassName?.({ date }) || ''}`}
      >
        {tileContent ? (
          tileContent({ date, view: 'day' })
        ) : (
          <span>
            {formatLongDate ? formatLongDate(date, locale) : date.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        )}
      </button>
    </div>
  );
};

export default DayView;