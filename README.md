# react-d-calendar

A highly customizable, accessible, and responsive React calendar component for building modern date pickers with ease.

---
## Preview

<p align="center">
  <img src="./docs/assets/img-1.png" alt="Month View" width="45%" />
  <img src="./docs/assets/img-2.png" alt="Range Selection" width="45%" />
</p>
<p align="center">
  <img src="./docs/assets/video-1.gif" alt="Demo GIF" width="90%" />
</p>

Explore the `react-d-calendar` library in action at [Live Demo](https://dhurka3782.github.io/react-d-calendar-demo).

---

## Features

- **Highly Customizable**: Tailor every aspect of the calendar (styles, rendering, and behavior) to fit your application's design system.
- **Multiple Views**: Supports day, month, year, and decade views with intuitive navigation.
- **Range Selection**: Offers single-date or range selection modes for flexible use cases.
- **Accessibility (a11y)**: Built with ARIA labels, keyboard navigation, and screen reader support for an inclusive experience.
- **Responsive Design**: Adapts effortlessly to various screen sizes, including mobile and tablet devices.
- **Event Management**: Easily highlight holidays, events, or custom markers with customizable styling.
- **Theming**: Supports light, dark, and custom themes using CSS variables for consistent branding.
- **Internationalization**: Full locale support for date formatting and weekday labels.
- **Performance Optimized**: Utilizes React memoization for efficient rendering and updates.

---

## Installation

### Install via npm:
```bash
npm install react-d-calendar
```

### Or with yarn:
```bash
yarn add react-d-calendar
```
---

## Quick Start

### Basic Example

```jsx
import React from 'react';
import { Calendar } from 'react-d-calendar';
import 'react-d-calendar/dist/styles.css';

function App() {
  const handleDateSelect = (date) => {
    console.log('Selected date:', date.toDateString());
  };

  return <Calendar onDateSelect={handleDateSelect} />;
}

export default App;
```

### Customizing Day Rendering
#### Customize the appearance of individual days:

```jsx
import React from 'react';
import { Calendar } from 'react-d-calendar';
import 'react-d-calendar/dist/styles.css';

function App() {
  const customDay = ({ date }) => (
    <div style={{ color: date.getDate() % 2 === 0 ? 'blue' : 'red' }}>
      {date.getDate()}
    </div>
  );

  return (
    <Calendar
      onDateSelect={(date) => alert(date.toDateString())}
      tileContent={customDay}
      style={{ border: '1px solid #ccc', padding: '10px' }}
    />
  );
}

export default App;
```

### Range Selection with Events
#### Enable range selection and display events:

```jsx
import React from 'react';
import { Calendar } from 'react-d-calendar';
import 'react-d-calendar/dist/styles.css';

function App() {
  const events = [
    { 
      date: new Date(2025, 5, 10), 
      title: 'Team Meeting', 
      type: 'meeting', 
      color: '#22c55e' 
    },
    { 
      date: new Date(2025, 5, 15), 
      title: 'Holiday', 
      type: 'holiday', 
      color: '#f43f5e' 
    },
  ];

  return (
    <Calendar
      selectionMode="range"
      events={events}
      onDateSelect={(range) => console.log('Selected range:', range)}
      customTheme={{ primary: '#4b6cb7', accent: '#48bb78' }}
    />
  );
}

export default App;
```

---


## Props

| Prop                   | Type                                     | Default        | Description                                |
| ---------------------- | ---------------------------------------- | -------------- | ------------------------------------------ |
| `date`                 | `Date`                                   | `new Date()`   | The initial date to display.               |
| `onDateSelect`         | `function`                               | `() => {}`     | Callback when a date or range is selected. |
| `selectionMode`        | `'single' \| 'range'`                    | `'single'`     | Date selection mode.                       |
| `events`               | `Array<{ date, title?, type?, color? }>` | `[]`           | Events to display.                         |
| `renderEvent`          | `function`                               | `() => null`   | Custom render function for events.         |
| `tileContent`          | `function`                               | `undefined`    | Custom day tile content.                   |
| `tileClassName`        | `function`                               | `undefined`    | Add custom class to days.                  |
| `tileDisabled`         | `function`                               | `undefined`    | Disable specific dates.                    |
| `locale`               | `string`                                 | `'en-US'`      | Date formatting locale.                    |
| `dateFormat`           | `'mm/dd/yyyy' \| ...`                    | `'mm/dd/yyyy'` | Date format for display.                   |
| `weekdayFormat`        | `'short' \| 'full' \| 'minimal'`         | `'short'`      | Weekday label format.                      |
| `showDoubleView`       | `boolean`                                | `false`        | Show two months side-by-side.              |
| `showWeekNumbers`      | `boolean`                                | `false`        | Show week numbers.                         |
| `showNeighboringMonth` | `boolean`                                | `true`         | Show adjacent month days.                  |
| `defaultView`          | `'day' \| 'month' \| ...`                | `'month'`      | Initial view mode.                         |
| `maxDetail`            | `'day' \| 'month' \| ...`                | `'month'`      | Maximum zoom level.                        |
| `minDetail`            | `'day' \| 'month' \| ...`                | `'year'`       | Minimum zoom level.                        |
| `theme`                | `'light' \| 'dark'`                      | `'light'`      | Theme mode.                                |
| `customTheme`          | `object`                                 | `{}`           | Custom CSS variables.                      |
| `style`                | `object`                                 | `{}`           | Inline styles.                             |
| `className`            | `string`                                 | `''`           | Additional container class.                |
| `holidayDates`         | `Array<Date>`                            | `[]`           | Highlighted holidays.                      |
| `weekStartDay`         | `number`                                 | `1`            | Week start day (0 = Sunday).               |
| `onClickEvent`         | `function`                               | `undefined`    | Event click callback.                      |
| `selectOnEventClick`   | `boolean`                                | `true`         | Select date on event click.                |

---

## Customization
### Theming
#### Override default styles using the customTheme prop:
```jsx
<Calendar
  customTheme={{
    primary: '#4b6cb7',
    accent: '#48bb78',
    daySize: '48px',
  }}
/>
```
### Custom Styles
#### Add custom styles via CSS variables or classes:
```css
.calendar {
  --primary-color: #2a4365;
  --accent-color: #22c55e;
  --day-size: 48px;
}

.custom-calendar .calendar-day:hover {
  background-color: #f0f4f8;
}
```
```jsx
<Calendar className="calendar" />
```
### Custom Event Rendering
#### Customize event indicators:
```jsx
const renderEvent = ({ event, date }) => (
  <span className="custom-event" style={{ backgroundColor: event.color }}>
    {event.title}
  </span>
);

<Calendar events={events} renderEvent={renderEvent} />
```
### Custom Footer
#### Add a footer with selected date information:
```jsx
const customFooter = ({ selectedValue }) => (
  <div style={{ padding: '10px', textAlign: 'center' }}>
    Selected: {selectedValue ? selectedValue.toDateString() : 'None'}
  </div>
);

<Calendar renderCustomFooter={customFooter} />
```
#### For a complete list of props and advanced usage, refer to the [Documentation](https://github.com/dhurka3782/react-d-calendar/wiki/Customization).
---

## Development
### Setup
#### Clone the repository:
```bash
git clone https://github.com/dhurka3782/react-d-calendar.git
cd react-d-calendar
```
#### Install dependencies:
```bash
npm install
```
#### Building
```bash
npm run build
```
#### Testing
```bash
npm test
```
---
## License

### This project is licensed under the [MIT License](./LICENSE).
---

## Resources

- [Documentation](https://github.com/dhurka3782/react-d-calendar/wiki)
- [Live Demo](https://dhurka3782.github.io/react-d-calendar-demo)
- [GitHub Repository](https://github.com/dhurka3782/react-d-calendar)

---
## Contributing
### We welcome contributions! Please follow these steps:

- Fork the repository.
- Create a feature branch  ``` git checkout -b feature/new-feature ``` .
- Commit your changes ``` git commit -m 'Add new feature ```.
- Push to the branch ``` git push origin feature/new-feature ```.
- Open a Pull Request with a clear description of your changes.

### Guidelines
- Ensure code follows [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) standards.
- Add tests for new features or bug fixes.
- Update documentation as needed.
---
## Support
### For questions, bugs, or feature requests, please open an issue on [GitHub](https://github.com/dhurka3782/react-d-calendar/issues).
---

### Made with ❤️ by the React-D-Calendar team
