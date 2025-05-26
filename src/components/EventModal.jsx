import React, { useState, useEffect } from "react";

export default function EventModal({ event, date, onClose, onSave, onUpdate, onDelete }) {
  const isEdit = !!event;

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("none");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6"); // Default Tailwind blue

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setTime(event.time || "");
      setRepeat(event.repeat || "none");
      setDescription(event.description || "");
      setColor(event.color || "#3b82f6");
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const updatedEvent = {
      ...event,
      id: event?.id || Date.now(),
      title,
      date: date || event.date,
      time,
      repeat,
      description,
      color,
    };

    isEdit ? onUpdate(updatedEvent) : onSave(updatedEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-semibold mb-3">
          {isEdit ? "Edit Event" : `Add Event for ${new Date(date).toDateString()}`}
        </h2>

        <input
          type="text"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="time"
          className="w-full border p-2 mb-3 rounded"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <select
          className="w-full border p-2 mb-3 rounded"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
        >
          <option value="none">Does not repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <textarea
          className="w-full border p-2 mb-4 rounded"
          rows="3"
          placeholder="Event description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Event Color</label>
          <input
            type="color"
            className="w-full h-10 p-1 border rounded"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>

          {isEdit && (
            <button
              type="button"
              onClick={() => {
                onDelete(event);
                onClose();
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
