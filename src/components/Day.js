import React from 'react';

const Day = ({ dayInfo }) => (
  <span style={{ color: dayInfo.isCurrentMonth ? 'black' : 'gray' }}>
    {dayInfo.date.getDate()}
  </span>
);

export default Day;