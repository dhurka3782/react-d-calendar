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

  const handleYearChange = (e) => {
    const newDate = new Date(date);
    newDate.setFullYear(parseInt(e.target.value));
    onChange(newDate);
  };

  const years = Array.from({ length: 10 }, (_, i) => date.getFullYear() - 5 + i);

  return (
    <div className="header">
      <button onClick={prevMonth} aria-label="Previous Month">{"<"}</button>
      <span>{date.toLocaleString('default', { month: 'long' })}</span>
      <button onClick={nextMonth} aria-label="Next Month">{">"}</button>
      <select value={date.getFullYear()} onChange={handleYearChange} aria-label="Select Year">
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

export default Header;