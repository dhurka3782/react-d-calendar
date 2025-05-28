import React from 'react';

const YearView = ({
  date,
  onMonthSelect,
  tileDisabled,
  tileClassName,
  formatMonth,
  showNeighboringDecade,
  locale,
  onDrillUp,
}) => {
  const year = date.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  if (showNeighboringDecade) {
    months.unshift(new Date(year - 1, 11, 1));
    months.push(new Date(year + 1, 0, 1));
  }

  return (
    <div className="year-view">
      <div className="year-grid">
        {months.map((monthDate, index) => {
          const isDisabled = tileDisabled?.(monthDate);
          return (
            <button
              key={index}
              onClick={() => !isDisabled && onMonthSelect(monthDate)}
              onDoubleClick={() => !isDisabled && onDrillUp?.()}
              disabled={isDisabled}
              className={`year-month ${monthDate.getFullYear() !== year ? 'adjacent-year' : ''} ${tileClassName?.({ date: monthDate }) || ''}`}
            >
              {formatMonth ? formatMonth(monthDate, locale) : monthDate.toLocaleString(locale, { month: 'short' })}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default YearView;