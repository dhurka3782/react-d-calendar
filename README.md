# 📅 react-d-calendar

A highly customizable, accessible, and responsive React calendar component for building modern date pickers with ease.

---
## 📸 Preview
<p align="center">
  <img src="./assets/images/month-view.png" alt="Month View" width="45%" />
  <img src="./assets/images/range-selection.png" alt="Range Selection" width="45%" />
</p>
<p align="center">
  <img src="./assets/images/year-view.png" alt="Year View" width="45%" />
  <img src="./assets/images/mobile-view.png" alt="Mobile View" width="30%" />
</p>

---

## ✨ Features

- **Fully Customizable**: Style and render every part of the calendar to match your application's design.
- **Multiple Views**: Supports day, month, year, and decade views with smooth navigation.
- **Range Selection**: Enable single-date or range selection for flexible use cases.
- **Accessible**: Built with ARIA support for screen readers and keyboard navigation.
- **Responsive Design**: Adapts seamlessly to different screen sizes, including mobile devices.
- **Event Support**: Highlight holidays, events, or custom markers with ease.
- **Theming**: Light, dark, or custom themes with CSS variable support.
- **Internationalization**: Locale support for date formatting and weekday labels.

---

## 🚀 Installation

### Install via npm:
```bash
npm install react-d-calendar
```

### Or with yarn:
```bash
yarn add react-d-calendar
```
---

## 📦 Usage

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
      formatDay={customDay}
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


## ⚙️ Props

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

## 🎨 Customization
### Custom Theming
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
#### Add custom CSS to the calendar:
```css
.calendar {
  --primary-color: #2a4365;
  --accent-color: #22c55e;
  --day-size: 48px;
}
```
```jsx
<Calendar className="calendar" />
```
### Custom Event Rendering
#### Render custom event indicators:
```jsx
const renderEvent = ({ event, date }) => (
  <span className="custom-event" style={{ backgroundColor: event.color }}>
    {event.title}
  </span>
);

<Calendar events={events} renderEvent={renderEvent} />
```
### Custom Footer
#### Add a custom footer to display selected dates or additional controls:
```jsx
const customFooter = ({ selectedValue }) => (
  <div style={{ padding: '10px', textAlign: 'center' }}>
    Selected: {selectedValue ? selectedValue.toDateString() : 'None'}
  </div>
);

<Calendar renderCustomFooter={customFooter} />
```
---

## 🛠️ Development
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
## 📝 License

This project is licensed under the [MIT License](./LICENSE).
---

## 🌐 Resources

- **📖 Documentation**
- **🎥 Live Demo**
- **📱 GitHub Repository**

---
## 🤝 Contributing
### Contributions are welcome! Please feel free to submit a Pull Request.
---
## 📧 Support
### If you have any questions or need help, please open an issue on GitHub.

 Made with ❤️ by the React-D-Calendar team
