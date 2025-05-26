// src/utils/storage.js

export function loadEvents() {
  const data = localStorage.getItem("events");
  return data ? JSON.parse(data) : [];
}

export function saveEvents(events) {
  localStorage.setItem("events", JSON.stringify(events));
}
