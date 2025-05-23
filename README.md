# 📅 react-d-calendar

A fully customizable calendar component for React.

---

## 🚀 Installation

```bash
npm install react-d-calendar
```

---

## 📦 Usage

### Basic Example

```jsx
import React from 'react';
import { Calendar } from 'react-d-calendar';

function App() {
  return (
    <Calendar onDateSelect={(date) => console.log(date)} />
  );
}

export default App;
```

### Customizing Day Rendering

```jsx
import React from 'react';
import { Calendar } from 'react-d-calendar';

function App() {
  const customDay = (day) => (
    <div style={{ color: day.getDate() % 2 === 0 ? 'blue' : 'red' }}>
      {day.getDate()}
    </div>
  );

  return (
    <Calendar
      onDateSelect={(date) => alert(date.toDateString())}
      renderDay={customDay}
      style={{ border: '1px solid #ccc', padding: '10px' }}
    />
  );
}

export default App;
```

---

## ⚙️ Props

| Prop           | Type       | Default         | Description                                              |
|----------------|------------|-----------------|----------------------------------------------------------|
| `date`         | `Date`     | `new Date()`    | The initial date to display.                             |
| `onDateSelect` | `function` | `() => {}`      | Callback when a date is selected.                        |
| `renderDay`    | `function` | `day => <Day />`| Custom render function for each day cell.                |
| `className`    | `string`   | `''`            | Additional CSS class for the calendar container.         |
| `style`        | `object`   | `{}`            | Inline styles for the calendar container.                |

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE).
