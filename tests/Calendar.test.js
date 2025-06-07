import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Calendar from '../src/components/Calendar';
import { getDaysInMonth, getWeeksInMonth } from '../src/utils/dateUtils';

jest.mock('../src/utils/dateUtils', () => ({
  getDaysInMonth: jest.fn((date, weekStartDay) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayIndex = (firstDayOfMonth.getDay() + 7 - weekStartDay) % 7;
    
    // Days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, new Date(year, month, 0).getDate() - i), isCurrentMonth: false });
    }
    
    // Current month days
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    
    // Days from next month to fill the grid
    const totalDays = days.length;
    const remainingDays = (Math.ceil(totalDays / 7) * 7) - totalDays;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  }),
  getWeeksInMonth: jest.fn(() => [1, 2, 3, 4, 5]),
}));

describe('Calendar component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correct month and year', () => {
    render(<Calendar activeStartDate={new Date(2023, 0, 1)} />);
    expect(screen.getByText(/January 2023/i)).toBeInTheDocument();
  });

  test('renders correct number of days', () => {
    render(<Calendar activeStartDate={new Date(2023, 0, 1)} />);
    const dayButtons = screen.getAllByRole('button', {
      name: /Select.*2023/i,
    });
    expect(dayButtons.length).toBeGreaterThanOrEqual(28);
  });

  test('navigation buttons work', () => {
    render(<Calendar activeStartDate={new Date(2023, 0, 1)} />);
    expect(screen.getByText(/January 2023/i)).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    expect(screen.getByText(/February 2023/i)).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(prevButton);
    expect(screen.getByText(/January 2023/i)).toBeInTheDocument();
  });

  test('onChange callback is called', () => {
    const onChange = jest.fn();
    render(<Calendar activeStartDate={new Date(2023, 0, 1)} onChange={onChange} />);
    const day15 = screen.getByRole('button', { name: 'Select January 15, 2023' });
    fireEvent.click(day15);
    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    const calledWith = onChange.mock.calls[0][0];
    expect(calledWith.getFullYear()).toBe(2023);
    expect(calledWith.getMonth()).toBe(0);
    expect(calledWith.getDate()).toBe(15);
  });

  test('range selection works', () => {
    const onChange = jest.fn();
    render(
      <Calendar
        selectionMode="range"
        activeStartDate={new Date(2023, 0, 1)}
        onChange={onChange}
      />
    );
    const day1 = screen.getByRole('button', { name: 'Select January 1, 2023' });
    const day2 = screen.getByRole('button', { name: 'Select January 2, 2023' });
    fireEvent.click(day1);
    fireEvent.click(day2);
    expect(onChange).toHaveBeenCalledWith([expect.any(Date), expect.any(Date)]);
    const [start, end] = onChange.mock.calls[1][0];
    expect(start.getDate()).toBe(1);
    expect(end.getDate()).toBe(2);
  });

  test('disables dates correctly', () => {
    render(
      <Calendar
        activeStartDate={new Date(2023, 0, 1)}
        disableDate={({ date }) => date.getDate() === 1}
      />
    );
    const day1 = screen.getByRole('button', { name: 'Select January 1, 2023' });
    expect(day1).toBeDisabled();
  });

  test('renders month view', () => {
    render(<Calendar defaultView="month" activeStartDate={new Date(2023, 0, 1)} />);
    expect(screen.getByText(/January 2023/i)).toBeInTheDocument();
  });

  test('renders year view', () => {
    render(<Calendar defaultView="year" activeStartDate={new Date(2025, 0, 1)} />);
    const yearElements = screen.getAllByText('2025');
    expect(yearElements.length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Select January 2025' })).toBeInTheDocument();
  });

  test('renders week numbers', () => {
    render(<Calendar showWeekNumbers activeStartDate={new Date(2023, 0, 1)} />);
    const weekNumbers = screen.getAllByRole('button', { name: /^\d+$/ });
    expect(weekNumbers.some((el) => el.classList.contains('week-number'))).toBe(true);
  });

  test('custom renderDay is used', () => {
    const customRenderDay = ({ date }) => <span className="custom-day">{date.getDate()}</span>;
    render(
      <Calendar
        customTileContent={customRenderDay}
        activeStartDate={new Date(2023, 0, 1)}
      />
    );
    const day1Buttons = screen.getAllByRole('button', { name: 'Select January 1, 2023' });
    const customDay = day1Buttons.find((button) =>
      within(button).queryByText('1', { selector: '.custom-day' })
    );
    expect(customDay).toBeInTheDocument();
  });
});

describe('dateUtils', () => {
  test('getDaysInMonth returns correct days for January 2023', () => {
    const days = getDaysInMonth(new Date(2023, 0, 1), 1);
    expect(days.filter((d) => d.isCurrentMonth).length).toBe(31);
  });

  test('getWeeksInMonth returns correct weeks', () => {
    const weeks = getWeeksInMonth(new Date(2023, 0, 1), 1);
    expect(weeks.length).toBeGreaterThanOrEqual(5);
  });
});