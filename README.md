# 🗓️ Custom Event Calendar

A fully interactive, drag-and-drop event calendar built with **React + Vite + Tailwind CSS**, featuring support for:

* ✅ Recurring events (daily, weekly, monthly)
* ✅ Add/edit/delete event modals
* ✅ Color-coded events
* ✅ Search by title/description
* ✅ LocalStorage persistence
* ✅ Drag-and-drop rescheduling
* ✅ Responsive UI

🌐 **Live App**: [custom-event-calendar-seven.vercel.app](https://custom-event-calendar-seven.vercel.app/)

---

## 🚀 Features

### 🗓 Monthly View

* Navigate between months
* Today is highlighted with a badge

### ✍️ Event Management

* Add events by clicking a day
* Modal for adding/editing with:

  * Title
  * Time (HH\:MM)
  * Description
  * Recurrence: None / Daily / Weekly / Monthly
  * Color category

### 🔁 Recurring Support

* Daily: appears every day in the range
* Weekly: appears on the same weekday
* Monthly: appears on same day-of-month

### 📦 Persistent Storage

* Events are stored in `localStorage`
* Retains state across refreshes

### 🧲 Drag & Drop

* Reassign dates by dragging events across the grid

### 🔍 Search

* Search by event title or description
* Matches appear even outside the current month

---

## 📦 Tech Stack

* **React** (with Vite)
* **Tailwind CSS** for styling
* **date-fns** for date manipulation
* **@dnd-kit/core** for drag-and-drop

---

## 🛠️ Setup

```bash
# Clone this repo
$ git clone https://github.com/yourusername/custom-event-calendar.git

# Go into the project
$ cd custom-event-calendar

# Install dependencies
$ npm install

# Start the dev server
$ npm run dev
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Calendar.jsx
│   ├── EventModal.jsx
│   └── Header.jsx
├── hooks/
│   └── useEvents.js
├── utils/
│   └── storage.js
├── App.jsx
└── main.jsx
```

---

## 🧪 Future Enhancements

* ✅ Conflict management (avoid overlapping times)
* ✅ Custom recurrence (e.g., every 2 weeks)
* ✅ Export/import events as JSON
* ✅ Category filtering

---

## 👨‍💻 Author

Built with ❤️ by \[Your Name]

Have questions or suggestions? Feel free to open an issue or contact me.
