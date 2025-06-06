import React from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

function DraggableEvent({ event, onClick }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: event.id });
  // Track mouse position to distinguish click vs drag
  const mouseDownPos = React.useRef(null);

  function handleMouseDown(e) {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    if (listeners.onMouseDown) listeners.onMouseDown(e);
  }

  function handleMouseUp(e) {
    if (!mouseDownPos.current) return;
    const dx = Math.abs(e.clientX - mouseDownPos.current.x);
    const dy = Math.abs(e.clientY - mouseDownPos.current.y);
    // If mouse didn't move much, treat as click
    if (dx < 5 && dy < 5) {
      e.stopPropagation();
      onClick(e);
    }
    mouseDownPos.current = null;
    if (listeners.onMouseUp) listeners.onMouseUp(e);
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="custom-event mb-1 p-1 rounded text-xs cursor-move hover:opacity-80 transition-opacity relative z-10"
      style={{ backgroundColor: event.color || undefined }}
    >
      {event.time && <strong>{event.time}</strong>} {event.title}
    </div>
  );
}

function DroppableCell({ day, children, currentDate, onDayClick }) {
  const { isOver, setNodeRef } = useDroppable({ id: day.toDateString() });
  const today = new Date();
  const isToday =
    isSameDay(day, today) &&
    isSameMonth(currentDate, today) &&
    currentDate.getFullYear() === today.getFullYear();

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        // Only trigger onDayClick if we're clicking the cell itself, not its children
        if (e.target === e.currentTarget) {
          onDayClick(day);
        }
      }}
      className={`h-24 p-1 border border-blue-100 flex flex-col items-start relative bg-white hover:bg-blue-50 transition-all duration-150 cursor-pointer
        ${isToday ? "ring-2 ring-blue-500 bg-blue-200 font-bold" : ""}
        ${isOver ? "ring-2 ring-green-400" : ""}
      `}
    >
      <span className="text-xs text-gray-500">{format(day, "d")}</span>
      <div className="flex flex-col w-full mt-1">
        {children}
      </div>
    </div>
  );
}

export default function Calendar({
  currentDate,
  events,
  onDayClick,
  onEventClick,
  onEventMove,
}) {
  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start, end });
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDragEnd = ({ over, active }) => {
    if (over && over.id !== active.id) {
      const newDate = new Date(over.id);
      onEventMove(active.id, newDate.toISOString());
    }
  };

  return (
    <div className="custom-calendar-grid">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7">
          {/* Weekday headers */}
          {weekdays.map((day) => (
            <div
              key={day}
              className="py-2 text-center font-semibold text-blue-700 bg-blue-100 border-b border-blue-200"
            >
              {day}
            </div>
          ))}
          {/* Day cells */}
          {days.map((day) => {
            const dateKey = day.toDateString();
            const dayEvents = events.filter(
              (e) => new Date(e.date).toDateString() === dateKey
            );

            return (
              <DroppableCell 
                key={day.toISOString()} 
                day={day} 
                currentDate={currentDate}
                onDayClick={onDayClick}
              >
                {dayEvents.map((event) => (
                  <DraggableEvent
                    key={event.id}
                    event={event}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  />
                ))}
              </DroppableCell>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}