// src/components/Calendar.jsx

import React from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";

export default function Calendar({ currentDate, events, onDayClick, onEventClick }) {
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="border rounded">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-gray-200 text-center font-semibold">
        {weekdays.map((day) => (
          <div key={day} className="p-2 border">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {days.map((day) => {
          const dateKey = day.toDateString();
          const dayEvents = events.filter(
            (e) => new Date(e.date).toDateString() === dateKey
          );

          return (
            <div
              key={day.toISOString()}
              className="border h-24 p-1 cursor-pointer flex flex-col"
              onClick={() => onDayClick(day)}
            >
              <div className="font-semibold">{format(day, "d")}</div>

              {/* Render events */}
              <div className="flex flex-col overflow-auto text-sm mt-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded px-1 mb-1 cursor-pointer"
                    style={{
                      backgroundColor: event.color || "#bfdbfe", // fallback blue
                      color: "#000",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.time && <strong>{event.time}</strong>} {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
