import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList } from 'react-window';
import { getDecadesInCentury, isValidDate, sanitizeDate } from '../utils/dateUtils';

const DecadeView = ({
  date = new Date(),
  value,
  onYearSelect,
  tileDisabled,
  tileClassName,
  formatYear,
  showNeighboringCentury = true,
  locale = 'en-US',
  calendarType = 'gregorian',
  calendarPlugin,
  onDrillUp,
  className = '',
}) => {
  const validDate = isValidDate(date) ? sanitizeDate(date) : new Date();
  const year = validDate.getFullYear();
  const years = getDecadesInCentury(validDate, showNeighboringCentury, calendarType, calendarPlugin).map((d) => ({
    date: isValidDate(d) ? sanitizeDate(d) : new Date(),
    year: d.getFullYear(),
  }));

  const handleKeyDown = useCallback(
    (e, yearDate) => {
      if (!isValidDate(yearDate)) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!tileDisabled?.({ date: yearDate })) {
          onYearSelect?.(yearDate);
        }
      }
    },
    [onYearSelect, tileDisabled]
  );

  const renderYear = ({ index, style }) => {
    const yearData = years[index];
    if (!isValidDate(yearData.date)) return null;
    const isDisabled = tileDisabled?.({ date: yearData.date });
    const selectedDate = Array.isArray(value) ? value[0] : value;
    const isSelected = isValidDate(selectedDate) && yearData.year === selectedDate.getFullYear();
    const extraClass = tileClassName?.({ date: yearData.date }) || '';

    return (
      <button
        style={style}
        key={index}
        onClick={() => !isDisabled && onYearSelect?.(yearData.date)}
        onDoubleClick={() => !isDisabled && onDrillUp?.()}
        onKeyDown={(e) => handleKeyDown(e, yearData.date)}
        disabled={isDisabled}
        className={`year-month ${isSelected ? 'selected' : ''} ${
          yearData.year < Math.floor(year / 10) * 10 || yearData.year >= Math.floor(year / 10) * 10 + 10 ? 'adjacent-year' : ''
        } ${extraClass}`}
        aria-label={`Select ${formatYear ? formatYear(yearData.date, locale) : yearData.year}`}
        tabIndex={isDisabled ? -1 : 0}
      >
        <span className="month-content">
          {formatYear ? formatYear(yearData.date, locale) : yearData.year}
        </span>
      </button>
    );
  };

  return (
    <div className={`year-view ${className}`}>
      <FixedSizeList
        height={300}
        width="100%"
        itemCount={years.length}
        itemSize={50}
        layout="vertical"
        className="year-view-list"
      >
        {renderYear}
      </FixedSizeList>
    </div>
  );
};

DecadeView.propTypes = {
  date: PropTypes.instanceOf(Date),
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.arrayOf(PropTypes.instanceOf(Date))]),
  onYearSelect: PropTypes.func.isRequired,
  tileDisabled: PropTypes.func,
  tileClassName: PropTypes.func,
  formatYear: PropTypes.func,
  showNeighboringCentury: PropTypes.bool,
  locale: PropTypes.string,
  calendarType: PropTypes.string,
  calendarPlugin: PropTypes.object,
  onDrillUp: PropTypes.func,
  className: PropTypes.string,
};

export default React.memo(DecadeView);