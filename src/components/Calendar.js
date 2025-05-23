import React, { useState } from 'react';
import Header from './Header';
import Day from './Day';
import { getDaysInMonth } from '../utils/dateUtils';

const Calendar = ({
  date = new Date(),
  onDateSelect = () => {},
  renderDay = (day) => <Day day={day} />,
  className = '',
  style = {},
}) => {
  const [currentDate, setCurrentDate] = useState(date);
  const days = getDaysInMonth(currentDate);

  return (
    <div className={`calendar ${className}`} style={style}>
      <Header date={currentDate} onChange={setCurrentDate} />
      <div className="calendar-days">
        {days.map((day, index) => (
          <div key={index} onClick={() => onDateSelect(day)}>
            {renderDay(day)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;