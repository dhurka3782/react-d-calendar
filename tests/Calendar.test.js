import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Calendar from '../src/components/Calendar';
import { getDaysInMonth } from '../src/utils/dateUtils';

describe('Calendar component', () => {
  // Test 1: Check if the correct month and year are rendered
  test('renders correct month and year', () => {
    render(<Calendar date={new Date(2023, 0, 1)} />);
    expect(screen.getByText(/January 2023/i)).toBeInTheDocument();
  });

  // Test 2: Verify the correct number of days is rendered
  test('renders correct number of days', () => {
    render(<Calendar date={new Date(2023, 0, 1)} />);
    const daysContainer = screen.getByTestId('calendar-days');
    const dayButtons = within(daysContainer).getAllByRole('button');
    expect(dayButtons.length).toBe(31); 
  });

  // Test 3: Ensure navigation buttons update the month
  test('navigation buttons work', () => {
    render(<Calendar date={new Date(2023, 0, 1)} />);
    expect(screen.getByText(/January 2023/i)).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: 'Next Month' });
    fireEvent.click(nextButton);
    expect(screen.getByText(/February 2023/i)).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: 'Previous Month' });
    fireEvent.click(prevButton);
    expect(screen.getByText(/January 2023/i)).toBeInTheDocument();
    fireEvent.click(prevButton);
    expect(screen.getByText(/December 2022/i)).toBeInTheDocument();
  });

// Test 4: Confirm onDateSelect is called with the correct date
  test('onDateSelect callback is called', () => {
    const onDateSelect = jest.fn();
    render(<Calendar date={new Date(2023, 0, 1)} onDateSelect={onDateSelect} />);
    const day15 = screen.getByText('15');
    const dayButton = day15.closest('button');
    fireEvent.click(dayButton);
    expect(onDateSelect).toHaveBeenCalledTimes(1);
    const calledWith = onDateSelect.mock.calls[0][0];
    expect(calledWith.getFullYear()).toBe(2023);
    expect(calledWith.getMonth()).toBe(0);
    expect(calledWith.getDate()).toBe(15);
  });

  // Test 5: Test custom rendering of days
  test('custom renderDay is used', () => {
    const customRenderDay = (day) => <span className="custom-day">{day.getDate()}</span>;
    render(<Calendar date={new Date(2023, 0, 1)} renderDay={customRenderDay} />);
    const daysContainer = screen.getByTestId('calendar-days');
    const dayButtons = within(daysContainer).getAllByRole('button');
    const firstDay = dayButtons[0];
    expect(firstDay.querySelector('.custom-day')).toBeInTheDocument();
  });
});

describe('dateUtils', () => {
  // Test 6: Verify getDaysInMonth for a 31-day month
  test('getDaysInMonth returns correct days for January 2023', () => {
    const days = getDaysInMonth(new Date(2023, 0, 1));
    expect(days.length).toBe(31);
    expect(days[0].getDate()).toBe(1);
    expect(days[30].getDate()).toBe(31);
  });

  // Test 7: Verify getDaysInMonth for a 28-day month
  test('getDaysInMonth returns correct days for February 2023', () => {
    const days = getDaysInMonth(new Date(2023, 1, 1));
    expect(days.length).toBe(28);
    expect(days[0].getDate()).toBe(1);
    expect(days[27].getDate()).toBe(28);
  });

  // Test 8: Verify getDaysInMonth for a leap year
  test('getDaysInMonth handles leap years', () => {
    const days = getDaysInMonth(new Date(2024, 1, 1)); 
    expect(days.length).toBe(29);
    expect(days[0].getDate()).toBe(1);
    expect(days[28].getDate()).toBe(29);
  });

  // Test 9: Verify weekday headers for a month
  test('renders weekday headers', () => {
  render(<Calendar date={new Date(2023, 0, 1)} />);
  expect(screen.getByText('Sun')).toBeInTheDocument();
  expect(screen.getByText('Mon')).toBeInTheDocument();
  expect(screen.getByText('Sat')).toBeInTheDocument();
});
});