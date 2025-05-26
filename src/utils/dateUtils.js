export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = [];

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Shift to Monday = 0, Sunday = 6

  // Days from previous month
  const prevMonthLastDay = new Date(year, month, 0);
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month - 1, prevMonthLastDay.getDate() - i), isCurrentMonth: false });
  }

  // Days of current month
  for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
    days.push({ date: new Date(d), isCurrentMonth: true });
  }

  // Days from next month to complete the grid
  const totalDays = days.length;
  const remainingDays = (Math.ceil(totalDays / 7) * 7) - totalDays;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  return days;
};