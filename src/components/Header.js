import React from 'react';
import { ChevronDown } from 'lucide-react';
import './styles.css';

const Header = ({
  showDoubleView,
  date,
  onChange,
  view,
  minDetail,
  maxDetail,
  prevLabel = '‹',
  prevAriaLabel,
  nextLabel = '›',
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

  const getAriaLabel = (type) => {
    const viewMap = { day: 'day', month: 'month', year: 'year', decade: 'decade' };
    const viewLabel = viewMap[view] || 'period';
    switch (type) {
      case 'prev': return prevAriaLabel || `Go to previous ${viewLabel}`;
      case 'next': return nextAriaLabel || `Go to next ${viewLabel}`;
      case 'prev2': return prev2AriaLabel || `Go to previous ${view === 'year' ? 'decade' : 'century'}`;
      case 'next2': return next2AriaLabel || `Go to next ${view === 'year' ? 'decade' : 'century'}`;
      case 'select': return navigationAriaLabel || `Select year for ${viewLabel} view`;
      default: return '';
    }
  };

  return (
    <div className="header" aria-live={navigationAriaLive}>
      <div className="header-month-section">
        <div className="header-month-nav">
          {(view !== minDetail || prev2Label) && (
            <button onClick={prev} aria-label={getAriaLabel('prev')} className="nav-button">
              {prevLabel}
            </button>
          )}
          <span className="header-month-label">{getNavigationLabel()}</span>
          {(view !== minDetail || next2Label) && (
            <button onClick={next} aria-label={getAriaLabel('next')} className="nav-button">
              {nextLabel}
            </button>
          )}
        </div>
      </div>
      {view !== 'day' && (
        <div className="header-year-section">
          <select
            value={currentYear}
            onChange={handleYearChange}
            aria-label={getAriaLabel('select')}
            className="year-select"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {formatYear ? formatYear(new Date(date.setFullYear(year)), locale) : year}
              </option>
            ))}
          </select>
          <ChevronDown className="chevron-down" strokeWidth={1}/>
        </div>
      )}
    </div>
  );
};

export default Header;