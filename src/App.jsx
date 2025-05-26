// src/App.jsx

import { useState, useEffect, useRef } from "react";
import Calendar from "./components/Calendar";
import EventModal from "./components/EventModal";
import { addMonths, subMonths } from "date-fns";
import { loadEvents, saveEvents } from "./utils/storage";

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalEvent, setModalEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isFirstSearch = useRef(true);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const visible = getVisibleEvents();
      if (visible.length > 0) {
        // Only jump if the first result is not already in the current month
        const firstEventDate = new Date(visible[0].date);
        if (
          firstEventDate.getMonth() !== currentDate.getMonth() ||
          firstEventDate.getFullYear() !== currentDate.getFullYear()
        ) {
          setCurrentDate(new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1));
        }
      }
    }
    isFirstSearch.current = false;
    // eslint-disable-next-line
  }, [searchTerm, events]);

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
    const updated = events.map((evt) =>
      evt.id === updatedEvent.id ? updatedEvent : evt
    );
    setEvents(updated);
    saveEvents(updated);
  };

  const handleDelete = (eventToDelete) => {
    const updated = events.filter((evt) => evt.id !== eventToDelete.id);
    setEvents(updated);
    saveEvents(updated);
  };

  const handleEventMove = (eventId, newDate) => {
    const updated = events.map((evt) =>
      evt.id === eventId ? { ...evt, date: newDate } : evt
    );
    setEvents(updated);
    saveEvents(updated);
  };

  const getVisibleEvents = () => {
    const result = [];
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Filter events based on search term first
    const filteredEvents = events.filter(event => 
      searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const shouldInclude = (date) => {
      // When searching, show all dates
      if (searchTerm) {
        return true;
      }
      // When not searching, only show current month
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    };

    // Generate recurring instances for filtered events
    for (const event of filteredEvents) {
      const eventDate = new Date(event.date);

      if (event.recurrence === "daily") {
        // When searching, show more instances
        const range = searchTerm ? [-30, 60] : [-15, 45];
        for (let i = range[0]; i <= range[1]; i++) {
          const recurDate = new Date(eventDate);
          recurDate.setDate(recurDate.getDate() + i);
          if (shouldInclude(recurDate)) {
            result.push({ ...event, date: recurDate });
          }
        }
      } else if (event.recurrence === "weekly") {
        // When searching, show more instances
        const range = searchTerm ? [-6, 12] : [-3, 7];
        for (let i = range[0]; i <= range[1]; i++) {
          const recurDate = new Date(eventDate);
          recurDate.setDate(recurDate.getDate() + i * 7);
          if (shouldInclude(recurDate)) {
            result.push({ ...event, date: recurDate });
          }
        }
      } else if (event.recurrence === "monthly") {
        // When searching, show more instances
        const range = searchTerm ? [-4, 4] : [-2, 2];
        for (let i = range[0]; i <= range[1]; i++) {
          const recurDate = new Date(eventDate);
          recurDate.setMonth(recurDate.getMonth() + i);
          if (shouldInclude(recurDate)) {
            result.push({ ...event, date: recurDate });
          }
        }
      } else {
        if (shouldInclude(eventDate)) {
          result.push(event);
        }
      }
    }

    console.log("Search term:", searchTerm);
    console.log("Filtered events:", filteredEvents);
    console.log("Final result count:", result.length);
    return result;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-blue-600 py-6 shadow-md mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center tracking-wide drop-shadow-lg">
          Custom Event Calendar
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-4 md:p-8 mb-8">
          <div className="flex justify-between items-center mb-4 px-2 md:px-4">
            <button onClick={goToPrevMonth} className="text-blue-600 font-bold hover:underline">
              ← Prev
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button onClick={goToNextMonth} className="text-blue-600 font-bold hover:underline">
              Next →
            </button>
          </div>

          <div className="mb-4 px-2 md:px-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by title or description..."
              className="w-full p-2 border border-blue-200 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
            />
          </div>

          <Calendar
            currentDate={currentDate}
            events={getVisibleEvents()}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
            onEventMove={handleEventMove}
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
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 py-4 text-center mt-auto shadow-inner">
        <span className="text-white text-sm md:text-base font-medium">
          All rights reserved. Made with <span className="text-red-400">❤️</span> Snehal Suman
        </span>
      </footer>
    </div>
  );
}