import React, { useCallback } from 'react';

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

  const handleKeyDown = useCallback((e, monthDate) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!tileDisabled?.(monthDate)) {
        onMonthSelect(monthDate);
      }
    }
  }, [onMonthSelect, tileDisabled]);

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
              onKeyDown={(e) => handleKeyDown(e, monthDate)}
              disabled={isDisabled}
              className={`year-month ${monthDate.getFullYear() !== year ? 'adjacent-year' : ''} ${tileClassName?.({ date: monthDate }) || ''}`}
              aria-label={`Select ${monthDate.toLocaleString(locale, { month: 'long', year: 'numeric' })}`}
              tabIndex={isDisabled ? -1 : 0}
            >
              {formatMonth ? formatMonth(monthDate, locale) : monthDate.toLocaleString(locale, { month: 'short' })}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(YearView);