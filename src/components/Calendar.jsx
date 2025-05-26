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

function DraggableEvent({ event }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: event.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={"custom-event"}
      style={{ backgroundColor: event.color || undefined }}
    >
      {event.time && <strong>{event.time}</strong>} {event.title}
    </div>
  );
}

function DroppableCell({ day, children, currentDate }) {
  const { isOver, setNodeRef } = useDroppable({ id: day.toDateString() });
  const today = new Date();
  const isToday =
    isSameDay(day, today) &&
    isSameMonth(currentDate, today) &&
    currentDate.getFullYear() === today.getFullYear();

  return (
    <div
      ref={setNodeRef}
      className={`custom-calendar-cell ${isToday ? "custom-calendar-cell-today" : ""} ${isOver ? "ring-2 ring-green-400" : ""}`}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm">{format(day, "d")}</span>
        {isToday && (
          <span className="text-[10px] px-1 py-0.5 rounded bg-blue-500 text-white ml-1">
            Today
          </span>
        )}
      </div>
      <div className="flex flex-col overflow-auto text-xs mt-1">{children}</div>
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
      <div className="custom-calendar-header">
        {weekdays.map((day) => (
          <div key={day} className="custom-calendar-header-cell">{day}</div>
        ))}
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7 gap-1 p-2 bg-blue-50">
          {days.map((day) => {
            const dateKey = day.toDateString();
            const dayEvents = events.filter(
              (e) => new Date(e.date).toDateString() === dateKey
            );

            return (
              <div key={day.toISOString()} onClick={() => onDayClick(day)}>
                <DroppableCell day={day} currentDate={currentDate}>
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <DraggableEvent event={event} />
                    </div>
                  ))}
                </DroppableCell>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}