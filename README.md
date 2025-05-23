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

---

## 🛠️ Local Development & Testing

### 1. Clone and Install

```bash
git clone https://github.com/your-username/react-d-calendar.git
cd react-d-calendar
npm install
```

### 2. Run Locally

```bash
npm start
```

### 3. Run Tests

```bash
npm test
```

---

## 🧪 Using in a Sample Project

### 1. Create a Test Project

```bash
npx create-react-app test-react-d-calendar
cd test-react-d-calendar
npm install /path/to/react-d-calendar
```

### 2. Use the Calendar

Edit `src/App.js`:

```jsx
import React from 'react';
import { Calendar } from 'react-d-calendar';

function App() {
  return (
    <Calendar onDateSelect={(date) => alert(date.toDateString())} />
  );
}

export default App;
```

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests.

---

## 📄 License

MIT © Dhurka d(https://github.com/dhurka3782/react-d-calendar.git)