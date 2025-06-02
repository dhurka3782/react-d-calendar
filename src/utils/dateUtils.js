import { getISOWeek } from 'date-fns';

export const getDaysInMonth = (date, weekStartDay = 1, calendarType = 'gregorian', showFixedNumberOfWeeks = false, showNeighboringMonth = true) => {
  if (calendarType !== 'gregorian') {
    throw new Error(`Unsupported calendar type: ${calendarType}. Only 'gregorian' is supported.`);
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  const days = [];

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayIndex = (firstDayOfMonth.getDay() + 7 - weekStartDay) % 7;

  // Days from previous month
  if (showNeighboringMonth) {
    const prevMonthLastDay = new Date(year, month, 0);
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthLastDay.getDate() - i), isCurrentMonth: false });
    }
  }

  // Days of current month
  for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
    days.push({ date: new Date(d), isCurrentMonth: true });
  }

  // Days from next month
  if (showNeighboringMonth || showFixedNumberOfWeeks) {
    const totalDays = days.length;
    const remainingDays = showFixedNumberOfWeeks ? 42 - totalDays : (Math.ceil(totalDays / 7) * 7) - totalDays;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
  }

  return days;
};

export const getWeeksInMonth = (date, weekStartDay) => {
  const days = getDaysInMonth(date, weekStartDay);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    const weekStart = days[i].date;
    weeks.push(getISOWeek(weekStart));
  }
  return weeks;
};

export const getMonthsInYear = (date, showNeighboringDecade = false) => {
  const year = date.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  if (showNeighboringDecade) {
    months.unshift(new Date(year - 1, 11, 1));
    months.push(new Date(year + 1, 0, 1));
  }
  return months;
};

export const getDecadesInCentury = (date, showNeighboringCentury = false) => {
  const year = date.getFullYear();
  const decadeStart = Math.floor(year / 10) * 10;
  const decades = Array.from({ length: 10 }, (_, i) => new Date(decadeStart + i * 10, 0, 1));
  if (showNeighboringCentury) {
    decades.unshift(new Date(decadeStart - 10, 0, 1));
    decades.push(new Date(decadeStart + 100, 0, 1));
  }
  return decades;
};