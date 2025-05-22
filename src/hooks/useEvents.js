// src/hooks/useEvents.js
import { useState, useEffect } from "react";
import { loadEvents, saveEvents } from "../utils/storage";

export default function useEvents() {
  const [events, setEvents] = useState(() => loadEvents());

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const addEvent = (event) => {
    setEvents((prev) => [...prev, event]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === updatedEvent.id ? updatedEvent : evt))
    );
  };

  const deleteEvent = (eventToDelete) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== eventToDelete.id));
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
