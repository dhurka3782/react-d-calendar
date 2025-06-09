import React from 'react';
import PropTypes from 'prop-types';

const Day = ({ dayInfo, formatDay, locale }) => (
  <span className="day-number">
    {formatDay ? formatDay(dayInfo.date, locale) : dayInfo.date.getDate()}
  </span>
);

Day.propTypes = {
  dayInfo: PropTypes.shape({
    date: PropTypes.instanceOf(Date).isRequired,
    isCurrentMonth: PropTypes.bool,
  }).isRequired,
  formatDay: PropTypes.func,
  locale: PropTypes.string,
};

Day.defaultProps = {
  locale: 'en-US',
};

export default React.memo(Day);