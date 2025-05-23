import React from 'react';

const Header = ({ date, onChange }) => {
  const prevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    onChange(newDate);
  };
  const nextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    onChange(newDate);
  };

  return (
    <div className="header">
      <button onClick={prevMonth}>&lt;</button>
      <span>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
      <button onClick={nextMonth}>&gt;</button>
    </div>
  );
};

export default Header;