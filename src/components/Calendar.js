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
      <div className="calendar-days" data-testid="calendar-days">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(day)}
            aria-label={`Select ${day.toDateString()}`}
          >
            {renderDay(day)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;