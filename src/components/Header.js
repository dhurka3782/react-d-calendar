import React, { useState, useRef, useEffect } from 'react';
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

  const [search, setSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const activeYearRef = useRef(null);

  const handleYearChange = (year) => {
    const newDate = new Date(date);
    newDate.setFullYear(year);
    onChange(newDate);
    setIsDropdownOpen(false);
    setSearch('');
  };

  const currentYear = date.getFullYear();
  const years = Array.from({ length: 151 }, (_, i) => currentYear - 75 + i); 
  const decades = Array.from({ length: 16 }, (_, i) => currentYear - 75 + i * 10);

  const filteredYears = years.filter((year) =>
    year.toString().includes(search.toLowerCase())
  );

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to active year when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && activeYearRef.current && !search) {
      activeYearRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isDropdownOpen, search]);

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
        <div className="header-year-section" ref={dropdownRef}>
          <div
            className="year-select-wrapper"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            role="combobox"
            aria-label={getAriaLabel('select')}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
          >
            <span className="year-select-display">
              {formatYear ? formatYear(date, locale) : currentYear}
            </span>
            <ChevronDown className="chevron-down" strokeWidth={1} />
          </div>
          {isDropdownOpen && (
            <div className="year-dropdown">
              <input
                type="text"
                className="year-search"
                placeholder="Search year..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search for a year"
              />
              <div className="year-dropdown-scroll">
                {decades.map((decade) => (
                  <div key={decade} className="decade-group">
                    <div className="decade-label">{`${decade}-${decade + 9}`}</div>
                    {filteredYears
                      .filter((year) => year >= decade && year < decade + 10)
                      .map((year) => (
                        <button
                          key={year}
                          ref={year === currentYear ? activeYearRef : null}
                          className={`year-option ${year === currentYear ? 'selected' : ''}`}
                          onClick={() => handleYearChange(year)}
                          aria-selected={year === currentYear}
                          role="option"
                        >
                          {formatYear ? formatYear(new Date(date.setFullYear(year)), locale) : year}
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;