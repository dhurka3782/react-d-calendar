import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList } from 'react-window';
import { getDecadesInCentury } from '../utils/dateUtils';

/**
 * A component to display a grid of years for a decade.
 * @param {Object} props - Component props
 * @param {Date} props.date - The current date
 * @param {Date|Date[]} props.value - Selected date or range
 * @param {Function} props.onYearSelect - Callback for year selection
 * @param {Function} [props.tileDisabled] - Function to disable specific years
 * @param {Function} [props.tileClassName] - Function to add custom classes to year tiles
 * @param {Function} [props.formatYear] - Custom year formatting function
 * @param {boolean} [props.showNeighboringCentury] - Show years from adjacent centuries
 * @param {string} [props.locale] - Locale for formatting
 * @param {string} [props.calendarType] - Calendar type
 * @param {Object} [props.calendarPlugin] - Custom calendar plugin
 * @param {Function} [props.onDrillUp] - Callback for navigating up
 * @param {string} [props.className] - Additional CSS class
 */
const DecadeView = ({
  date,
  value,
  onYearSelect,
  tileDisabled,
  tileClassName,
  formatYear,
  showNeighboringCentury,
  locale,
  calendarType,
  calendarPlugin,
  onDrillUp,
  className = '',
}) => {
  const year = date.getFullYear();
  const years = getDecadesInCentury(date, showNeighboringCentury, calendarType, calendarPlugin).map((d) => ({
    date: d,
    year: d.getFullYear(),
  }));

  const handleKeyDown = useCallback(
    (e, yearDate) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!tileDisabled?.({ date: yearDate })) {
          onYearSelect(yearDate);
        }
      }
    },
    [onYearSelect, tileDisabled]
  );

  const renderYear = ({ index, style }) => {
    const yearData = years[index];
    const isDisabled = tileDisabled?.({ date: yearData.date });
    const selectedDate = Array.isArray(value) ? value[0] : value;
    const isSelected = selectedDate && yearData.year === selectedDate.getFullYear();
    const extraClass = tileClassName?.({ date: yearData.date }) || '';

    return (
      <button
        style={style}
        key={index}
        onClick={() => !isDisabled && onYearSelect(yearData.date)}
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
      <FixedSizeList height={300} width="100%" itemCount={years.length} itemSize={50} layout="vertical" className="year-view-list">
        {renderYear}
      </FixedSizeList>
    </div>
  );
};

DecadeView.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),
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