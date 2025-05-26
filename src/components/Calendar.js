import React, { useState } from 'react';
import './styles.css';
import Header from './Header';
import Day from './Day';
import { getDaysInMonth } from '../utils/dateUtils';

const Calendar = ({
  date = new Date(),
  onDateSelect = () => {},
  renderDay = (dayInfo) => <Day dayInfo={dayInfo} />,
  className = '',
  style = {},
  doubleView = false,
}) => {
  const [currentDate, setCurrentDate] = useState(date);
  const today = new Date('2025-05-26'); // Current date

  const renderCalendar = (monthOffset = 0) => {
    const displayDate = new Date(currentDate);
    displayDate.setMonth(currentDate.getMonth() + monthOffset);
    const days = getDaysInMonth(displayDate);
    const weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

    return (
      <div className={`calendar-instance ${className}`} style={style}>
        <Header date={displayDate} onChange={(newDate) => {
          newDate.setMonth(newDate.getMonth() - monthOffset);
          setCurrentDate(newDate);
        }} />
        <div className="calendar-weekdays">
          {weekdays.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-days">
          {days.map((dayInfo, index) => {
            const isToday = dayInfo.date.toDateString() === today.toDateString();
            const isSunday = dayInfo.date.getDay() === 0;
            const isHighlighted = (displayDate.getMonth() === 4 && dayInfo.date.getDate() === 30) || // May 30
                                 (displayDate.getMonth() === 5 && dayInfo.date.getDate() === 11) || // June 11
                                 (displayDate.getMonth() === 6 && dayInfo.date.getDate() === 24);   // July 24
            return (
              <button
                key={index}
                onClick={() => onDateSelect(dayInfo.date)}
                aria-label={`Select ${dayInfo.date.toDateString()}`}
                className={`calendar-day ${isSunday ? 'sunday' : ''} ${isHighlighted ? 'highlighted' : ''} ${!dayInfo.isCurrentMonth ? 'adjacent-month' : ''}`}
              >
                {renderDay(dayInfo)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`calendar-container ${doubleView ? 'double-view' : ''}`}>
      {doubleView ? (
        <>
          {renderCalendar(0)}
          {renderCalendar(1)}
        </>
      ) : (
        renderCalendar(0)
      )}
    </div>
  );
};

export default Calendar;