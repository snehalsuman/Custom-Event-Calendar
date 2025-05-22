// src/App.jsx

import { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import EventModal from "./components/EventModal";
import { addMonths, subMonths } from "date-fns";
import { loadEvents, saveEvents } from "./utils/storage";

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalEvent, setModalEvent] = useState(null);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  const goToPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setModalEvent(null);
  };

  const handleEventClick = (event) => {
    setModalEvent(event);
    setSelectedDate(null);
  };

  const handleSave = (event) => {
    const updated = [...events, event];
    setEvents(updated);
    saveEvents(updated);
  };

  const handleUpdate = (updatedEvent) => {
    const updated = events.map((evt) => evt.id === updatedEvent.id ? updatedEvent : evt);
    setEvents(updated);
    saveEvents(updated);
  };

  const handleDelete = (eventToDelete) => {
    const updated = events.filter((evt) => evt.id !== eventToDelete.id);
    setEvents(updated);
    saveEvents(updated);
  };

  // 🎯 Expand recurring events
  const getVisibleEvents = () => {
    const result = [];
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    for (const event of events) {
      const eventDate = new Date(event.date);
      switch (event.recurrence) {
        case "daily":
          for (let i = -15; i <= 45; i++) {
            const recurDate = new Date(eventDate);
            recurDate.setDate(recurDate.getDate() + i);
            if (recurDate.getMonth() === currentMonth && recurDate.getFullYear() === currentYear) {
              result.push({ ...event, date: recurDate });
            }
          }
          break;
        case "weekly":
          for (let i = -3; i <= 7; i++) {
            const recurDate = new Date(eventDate);
            recurDate.setDate(recurDate.getDate() + i * 7);
            if (recurDate.getMonth() === currentMonth && recurDate.getFullYear() === currentYear) {
              result.push({ ...event, date: recurDate });
            }
          }
          break;
        case "monthly":
          for (let i = -2; i <= 2; i++) {
            const recurDate = new Date(eventDate);
            recurDate.setMonth(recurDate.getMonth() + i);
            if (recurDate.getMonth() === currentMonth && recurDate.getFullYear() === currentYear) {
              result.push({ ...event, date: recurDate });
            }
          }
          break;
        default:
          result.push(event);
      }
    }

    return result;
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4 px-4">
        <button onClick={goToPrevMonth} className="text-blue-600 font-bold">← Prev</button>
        <h1 className="text-xl font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h1>
        <button onClick={goToNextMonth} className="text-blue-600 font-bold">Next →</button>
      </div>

      <Calendar
        currentDate={currentDate}
        events={getVisibleEvents()}
        onDayClick={handleDayClick}
        onEventClick={handleEventClick}
      />

      {(selectedDate || modalEvent) && (
        <EventModal
          date={selectedDate}
          event={modalEvent}
          onClose={() => {
            setSelectedDate(null);
            setModalEvent(null);
          }}
          onSave={handleSave}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
