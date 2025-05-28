import React from 'react';

const Day = ({ dayInfo, formatDay, locale }) => (
  <span className="day-number">
    {formatDay ? formatDay(dayInfo.date, locale) : dayInfo.date.getDate()}
  </span>
);

export default React.memo(Day);