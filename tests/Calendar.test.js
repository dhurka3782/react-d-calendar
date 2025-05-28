import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Calendar from '../components/Calendar';
import { getDaysInMonth, getWeeksInMonth } from '../utils/dateUtils';

describe('Calendar component', () => {
  test('renders correct month and year', () => {
    render(<Calendar activeStartDate={new Date(2023, 0, 1)} />);
    expect(screen.getByText(/January 2023/i)).toBeInTheDocument();
  });

  test('renders correct number of days', () => {
    render(<Calendar activeStartDate={new Date(2023, 0, 1)} />);
    const daysContainer = screen.getByTestId('calendar-days');
    const dayButtons = within(daysContainer).getAllByRole('button');
    expect(dayButtons.length).toBeGreaterThanOrEqual(28);
  });

  test('navigation buttons work', () => {
    render(<Calendar activeStartDate={new Date(2023, 0, 1)} />);
    expect(screen.getByText(/January 2023/i)).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /Next Month/i });
    fireEvent.click(nextButton);
    expect(screen.getByText(/February 2023/i)).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: /Previous Month/i });
    fireEvent.click(prevButton);
    expect(screen.getByText(/January 2023/i)).toBeInTheDocument();
  });

  test('onChange callback is called', () => {
    const onChange = jest.fn();
    render(<Calendar activeStartDate={new Date(2023, 0, 1)} onChange={onChange} />);
    const day15 = screen.getByText('15');
    fireEvent.click(day15.closest('button'));
    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    const calledWith = onChange.mock.calls[0][0];
    expect(calledWith.getFullYear()).toBe(2023);
    expect(calledWith.getMonth()).toBe(0);
    expect(calledWith.getDate()).toBe(15);
  });

  test('range selection works', () => {
    const onChange = jest.fn();
    render(<Calendar selectRange activeStartDate={new Date(2023, 0, 1)} onChange={onChange} />);
    const day1 = screen.getByText('1');
    const day2 = screen.getByText('2');
    fireEvent.click(day1.closest('button'));
    fireEvent.click(day2.closest('button'));
    expect(onChange).toHaveBeenCalledWith([expect.any(Date), expect.any(Date)]);
  });

  test('disables dates correctly', () => {
    render(<Calendar disableDate={(date) => date.getDate() === 1} />);
    const day1 = screen.getByText('1').closest('button');
    expect(day1).toBeDisabled();
  });

  test('renders month view', () => {
    render(<Calendar defaultView="month" />);
    expect(screen.getByText('January')).toBeInTheDocument();
  });

  test('renders year view', () => {
    render(<Calendar defaultView="year" />);
    expect(screen.getByText(/202\d–203\d/i)).toBeInTheDocument();
  });

  test('renders week numbers', () => {
    render(<Calendar showWeekNumbers />);
    expect(screen.getByText(/^\d+$/)).toHaveClass('week-number');
  });

  test('custom renderDay is used', () => {
    const customRenderDay = (dayInfo) => <span className="custom-day">{dayInfo.date.getDate()}</span>;
    render(<Calendar renderDay={customRenderDay} />);
    expect(screen.getByText('1').closest('.custom-day')).toBeInTheDocument();
  });
});

describe('dateUtils', () => {
  test('getDaysInMonth returns correct days for January 2023', () => {
    const days = getDaysInMonth(new Date(2023, 0, 1));
    expect(days.filter((d) => d.isCurrentMonth).length).toBe(31);
  });

  test('getWeeksInMonth returns correct weeks', () => {
    const weeks = getWeeksInMonth(new Date(2023, 0, 1), 1);
    expect(weeks.length).toBeGreaterThanOrEqual(5);
  });
});