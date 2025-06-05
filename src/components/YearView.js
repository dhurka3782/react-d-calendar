import React, { useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import './styles.css';

const YearView = ({
  date,
  value,
  onMonthSelect,
  tileDisabled,
  tileClassName,
  formatMonth,
  showNeighboringDecade,
  locale,
  onDrillUp,
  className,
}) => {
  const year = date.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  if (showNeighboringDecade) {
    months.unshift(new Date(year - 1, 11, 1));
    months.push(new Date(year + 1, 0, 1));
  }

  const handleKeyDown = useCallback(
    (e, monthDate) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!tileDisabled?.(monthDate)) {
          onMonthSelect(monthDate);
        }
      }
    },
    [onMonthSelect, tileDisabled]
  );

  const renderMonth = ({ index, style }) => {
    const monthDate = months[index];
    const isDisabled = tileDisabled?.(monthDate);

    const selectedDate = Array.isArray(value) ? value[0] : value;
    const isSelected = selectedDate &&
      monthDate.getMonth() === selectedDate.getMonth() &&
      monthDate.getFullYear() === selectedDate.getFullYear();

    const extraClass = tileClassName?.({ date: monthDate }) || '';

    return (
      <button
        style={style}
        key={index}
        onClick={() => !isDisabled && onMonthSelect(monthDate)}
        onDoubleClick={() => !isDisabled && onDrillUp?.()}
        onKeyDown={(e) => handleKeyDown(e, monthDate)}
        disabled={isDisabled}
        className={`year-month ${isSelected ? 'selected' : ''} ${monthDate.getFullYear() !== year ? 'adjacent-year' : ''} ${extraClass}`}
        aria-label={`Select ${monthDate.toLocaleString(locale, { month: 'long', year: 'numeric' })}`}
        tabIndex={isDisabled ? -1 : 0}
      >
        <span className="month-content">
          {formatMonth ? formatMonth(monthDate, locale) : monthDate.toLocaleString(locale, { month: 'short' })}
        </span>
      </button>
    );
  };

  return (
    <div className={`year-view ${className || ''}`}>
      <FixedSizeList
        height={300}
        width="100%"
        itemCount={months.length}
        itemSize={50}
        layout="vertical"
        className="year-view-list"
      >
        {renderMonth}
      </FixedSizeList>
    </div>
  );
};

export default React.memo(YearView);