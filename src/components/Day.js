import React from 'react';
import PropTypes from 'prop-types';
import { isValidDate } from '../utils/dateUtils';

const Day = ({ dayInfo, formatDay, locale = 'en-US' }) => {
  if (!isValidDate(dayInfo.date)) {
    return <span className="day-number">Invalid</span>;
  }

  return (
    <span className="day-number" aria-label={`Day ${dayInfo.date.getDate()}`}>
      {formatDay ? formatDay(dayInfo.date, locale) : dayInfo.date.getDate()}
    </span>
  );
};

Day.propTypes = {
  dayInfo: PropTypes.shape({
    date: PropTypes.instanceOf(Date).isRequired,
    isCurrentMonth: PropTypes.bool,
  }).isRequired,
  formatDay: PropTypes.func,
  locale: PropTypes.string,
};

export default React.memo(Day);