import React from 'react';
import { render, screen, fireEvent, within, waitFor, act } from '@testing-library/react';
import Calendar from '../src/components/Calendar';
import { getDaysInMonth, getWeeksInMonth } from '../src/utils/dateUtils';

// Mock date utils
jest.mock('../src/utils/dateUtils', () => ({
  getDaysInMonth: jest.fn((date, weekStartDay) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
    const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
    const firstDayIndex = (firstDayOfMonth.getDay() + 7 - weekStartDay) % 7;

    // Previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(Date.UTC(year, month - 1, lastDayOfMonth.getDate() - i)),
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      days.push({
        date: new Date(Date.UTC(year, month, d)),
        isCurrentMonth: true,
      });
    }

    // Next month
    const totalDays = days.length;
    const remainingDays = (Math.ceil(totalDays / 7) * 7) - totalDays;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(Date.UTC(year, month + 1, i)),
        isCurrentMonth: false,
      });
    }

    return days;
  }),
  getWeeksInMonth: jest.fn(() => [1, 2, 3, 4, 5]),
}));

describe('Calendar component', () => {
  let originalConsoleError;

  beforeAll(() => {
    originalConsoleError = console.error;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    console.error = jest.fn((...args) => {
      if (/Support for defaultProps will be removed/.test(args[0])) {
        return;
      }
      originalConsoleError(...args); // Safe logging
    });
  });

  afterEach(() => {
    console.error.mockRestore?.();
  });

  test('renders correct month and year', () => {
    render(<Calendar activeStartDate={new Date(Date.UTC(2023, 0, 1))} />);
    expect(screen.getByText(/January 2023/i)).toBeInTheDocument();
  });

  test('renders correct number of days', () => {
    render(<Calendar activeStartDate={new Date(Date.UTC(2023, 0, 1))} />);
    const dayButtons = screen.getAllByRole('button', { name: /Select /i });
    expect(dayButtons.length).toBeGreaterThan(7);
  });

  test('navigation buttons work', () => {
    render(<Calendar activeStartDate={new Date(Date.UTC(2023, 0, 1))} />);
    expect(screen.getByText(/January/i)).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /Next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    expect(screen.getByText(/February/i)).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: /Previous/i });
    act(() => {
      fireEvent.click(prevButton);
    });
    expect(screen.getByText(/January/i)).toBeInTheDocument();
  });

  test('onChange callback is called', () => {
    const onChange = jest.fn();
    render(<Calendar activeStartDate={new Date(Date.UTC(2023, 0, 1))} onChange={onChange} />);
    const day15 = screen.getByRole('button', { name: 'Select January 15, 2023' });

    act(() => {
      fireEvent.click(day15);
    });

    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    const calledWith = onChange.mock.calls[0][0];
    expect(calledWith.getUTCFullYear()).toBe(2023);
    expect(calledWith.getUTCMonth()).toBe(0);
    expect(calledWith.getUTCDate()).toBe(15);
  });

  test('range selection works', async () => {
    const onChange = jest.fn();
    let selectedRange = null;

    await act(async () => {
      render(
        <Calendar
          selectionMode="range"
          activeStartDate={new Date(Date.UTC(2023, 0, 1))}
          onChange={(value) => {
            onChange(value);
            selectedRange = value;
          }}
        />
      );
    });

    const day1 = await screen.findByRole('button', { name: 'Select January 1, 2023' });

    await act(async () => {
      fireEvent.click(day1);
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls[0][0][0].getUTCDate()).toBe(1);
    });

    const day2 = await screen.findByRole('button', { name: 'Select January 2, 2023' });

    await act(async () => {
      fireEvent.click(day2);
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith([expect.any(Date), expect.any(Date)]);
      const [start, end] = onChange.mock.calls[1][0];
      expect(start.getUTCDate()).toBe(1);
      expect(end.getUTCDate()).toBe(2);
    });
  });

  test('disables dates', () => {
    render(
      <Calendar
        activeStartDate={new Date(Date.UTC(2023, 0, 1))}
        tileDisabled={({ date }) => date.getUTCDate() === 1}
      />
    );

    const day1 = screen.getByRole('button', { name: 'Select January 1, 2023' });
    expect(day1).toBeDisabled();
  });

  test('renders month view', () => {
    render(<Calendar defaultView="month" activeStartDate={new Date(Date.UTC(2023, 0, 1))} />);
    expect(screen.getByText(/January/i)).toBeInTheDocument();
  });

  test('renders year view', () => {
    render(<Calendar defaultView="year" activeStartDate={new Date(Date.UTC(2025, 0, 1))} />);
    expect(screen.getByRole('button', { name: 'Select January 2025' })).toBeInTheDocument();
  });

  test('renders week numbers', () => {
    render(<Calendar showWeekNumbers activeStartDate={new Date(Date.UTC(2023, 0, 1))} />);
    const weekNumbers = screen.getAllByRole('button', { name: /^\d+$/ });
    expect(weekNumbers.some((el) => el.classList.contains('week-number'))).toBe(true);
  });

  test('custom renderDay is used', async () => {
    const customRenderDay = ({ date }) => (
      <span className="custom-day-number">{date.getUTCDate()}</span>
    );

    render(
      <Calendar
        customTileContent={customRenderDay}
        activeStartDate={new Date(Date.UTC(2023, 0, 1))}
      />
    );

    const day1Button = await screen.findByRole('button', { name: 'Select January 1, 2023' });
    const customDay = within(day1Button).queryByText('1', { selector: '.custom-day-number' });
    expect(customDay).toBeInTheDocument();
  });

  test('onRangeHover is called during range selection', async () => {
    const onRangeHover = jest.fn();
    let selectedRange = null;

    await act(async () => {
      render(
        <Calendar
          selectionMode="range"
          activeStartDate={new Date(Date.UTC(2023, 0, 1))}
          onChange={(value) => {
            selectedRange = value;
          }}
          onRangeHover={onRangeHover}
        />
      );
    });

    const day1 = await screen.findByRole('button', { name: 'Select January 1, 2023' });

    await act(async () => {
      fireEvent.click(day1);
    });

    await waitFor(() => {
      expect(selectedRange).toEqual([expect.any(Date)]);
    });

    const day2 = await screen.findByRole('button', { name: 'Select January 2, 2023' });

    await act(async () => {
      fireEvent.mouseOver(day2);
    });

    await waitFor(() => {
      expect(onRangeHover).toHaveBeenCalledWith({
        start: expect.any(Date),
        end: expect.any(Date),
      });

      const { start, end } = onRangeHover.mock.calls[0][0];
      expect(start.getUTCDate()).toBe(1);
      expect(end.getUTCDate()).toBe(2);
    });
  });
});

describe('dateUtils', () => {
  test('days in month for January 2023', () => {
    const days = getDaysInMonth(new Date(Date.UTC(2023, 0, 1)), 1);
    expect(days.filter((d) => d.isCurrentMonth).length).toBe(31);
  });

  test('weeks in correctly', () => {
    const weeks = getWeeksInMonth(new Date(Date.UTC(2023, 0, 1)), 1);
    expect(weeks.length).toBeGreaterThanOrEqual(5);
  });
});