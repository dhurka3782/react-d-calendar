# react-d-calendar
A fully customizable calendar component for React.

## Installation
```bash
npm install react-d-calendar

## Usage

import { Calendar } from 'react-d-calendar';

function App() {
  return <Calendar onDateSelect={(date) => console.log(date)} />;
}


### 2.5 Add a License
Add a `LICENSE` file (e.g., MIT License) to make your package reusable.

---

## Step 3: Implementation in a Sample Project

### 3.1 Create a Test Project
- In a new folder: `npx create-react-app test-react-d-calendar`.
- Install your package locally: `npm install /path/to/react-d-calendar`.

### 3.2 Use the Calendar
Edit `test-react-d-calendar/src/App.js`:
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
    <div>
      <h1>My Calendar</h1>
      <Calendar
        onDateSelect={(date) => alert(date.toDateString())}
        renderDay={customDay}
        style={{ border: '1px solid #ccc', padding: '10px' }}
      />
    </div>
  );
}

export default App;