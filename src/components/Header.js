import React from 'react';

const Header = ({
  showDoubleView,
  date,
  onChange,
  view,
  minDetail,
  maxDetail,
  prevLabel,
  prevAriaLabel,
  nextLabel,
  nextAriaLabel,
  prev2Label,
  prev2AriaLabel,
  next2Label,
  next2AriaLabel,
  navigationLabel,
  navigationAriaLabel,
  navigationAriaLive,
  formatMonthYear,
  formatYear,
  locale,
}) => {
  const prev = () => {
    const newDate = new Date(date);
    if (view === 'day') newDate.setDate(date.getDate() - 1);
    else if (view === 'month') newDate.setMonth(date.getMonth() - 1);
    else if (view === 'year') newDate.setFullYear(date.getFullYear() - 1);
    else if (view === 'decade') newDate.setFullYear(date.getFullYear() - 10);
    onChange(newDate);
  };

  const next = () => {
    const newDate = new Date(date);
    if (view === 'day') newDate.setDate(date.getDate() + 1);
    else if (view === 'month') newDate.setMonth(date.getMonth() + 1);
    else if (view === 'year') newDate.setFullYear(date.getFullYear() + 1);
    else if (view === 'decade') newDate.setFullYear(date.getFullYear() + 10);
    onChange(newDate);
  };

  const prev2 = () => {
    if (!prev2Label) return;
    const newDate = new Date(date);
    if (view === 'year') newDate.setFullYear(date.getFullYear() - 10);
    else if (view === 'decade') newDate.setFullYear(date.getFullYear() - 100);
    onChange(newDate);
  };

  const next2 = () => {
    if (!next2Label) return;
    const newDate = new Date(date);
    if (view === 'year') newDate.setFullYear(date.getFullYear() + 10);
    else if (view === 'decade') newDate.setFullYear(date.getFullYear() + 100);
    onChange(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(date);
    newDate.setFullYear(parseInt(e.target.value));
    onChange(newDate);
  };

  const currentYear = date.getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const getNavigationLabel = () => {
    if (navigationLabel) return navigationLabel({ date, view, locale });
    if (view === 'month') {
      if (showDoubleView) {
        const nextMonth = new Date(date);
        nextMonth.setMonth(date.getMonth() + 1);
        return `${date.toLocaleString(locale, { month: 'long' })}-${nextMonth.toLocaleString(locale, { month: 'long' })} ${date.getFullYear()}`;
      }
      return formatMonthYear ? formatMonthYear(date, locale) : date.toLocaleString(locale, { month: 'long', year: 'numeric' });
    }
    if (view === 'year') return formatYear ? formatYear(date, locale) : date.getFullYear();
    if (view === 'decade') {
      const decadeStart = Math.floor(currentYear / 10) * 10;
      return `${decadeStart}-${decadeStart + 9}`;
    }
    return date.toLocaleDateString(locale);
  };

  return (
    <div className="header" aria-live={navigationAriaLive}>
      <div className="header-left">
        {(view !== minDetail || prev2Label) && (
          <>
            {prev2Label && view !== 'day' && (
              <button onClick={prev2} aria-label={prev2AriaLabel || 'Previous Decade'}>
                {prev2Label}
              </button>
            )}
            <button onClick={prev} aria-label={prevAriaLabel}>
              {prevLabel}
            </button>
          </>
        )}
      </div>
      <div className="header-center">
        <span>{getNavigationLabel()}</span>
      </div>
      <div className="header-right">
        {(view !== minDetail || next2Label) && (
          <>
            <button onClick={next} aria-label={nextAriaLabel}>
              {nextLabel}
            </button>
            {next2Label && view !== 'day' && (
              <button onClick={next2} aria-label={next2AriaLabel || 'Next Decade'}>
                {next2Label}
              </button>
            )}
          </>
        )}
        {view !== 'day' && (
          <select
            value={currentYear}
            onChange={handleYearChange}
            aria-label={navigationAriaLabel || 'Select Year'}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {formatYear ? formatYear(new Date(date.setFullYear(year)), locale) : year}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default Header;