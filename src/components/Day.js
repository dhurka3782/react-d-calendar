import React from 'react';

const Day = ({ dayInfo }) => (
  <span>
    {dayInfo.date.getDate()}
  </span>
);

export default Day;