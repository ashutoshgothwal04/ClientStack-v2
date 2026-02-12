import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const MeetingModal = ({ meeting, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState({
    id: "",
    title: "",
    start: "",
    end: "",
    reminder: "15",
    notes: "",
    meetLink: "",
  });

  useEffect(() => {
    if (meeting) {
      setForm({
        id: meeting?.id || "",
        title: meeting?.title || "",
        start: meeting?.start || "",
        end: meeting?.end || "",
        reminder: meeting?.reminder || "15",
        notes: meeting?.notes || "",
        meetLink: meeting?.meetLink || "",
      });
    }
  }, [meeting]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.title) return alert("Title is required");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-500">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {form.id ? "Edit Meeting" : "Create Meeting"}
          </h2>
          <button onClick={onClose}>
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Meeting title"
            className="w-full p-2 border border-border rounded-md bg-muted"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="datetime-local"
              name="start"
              value={form.start}
              onChange={handleChange}
              className="p-2 border border-border rounded-md bg-muted"
            />
            <input
              type="datetime-local"
              name="end"
              value={form.end}
              onChange={handleChange}
              className="p-2 border border-border rounded-md bg-muted"
            />
          </div>

          <select
            name="reminder"
            value={form.reminder}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded-md bg-muted"
          >
            <option value="5">5 minutes before</option>
            <option value="15">15 minutes before</option>
            <option value="30">30 minutes before</option>
            <option value="60">1 hour before</option>
          </select>

          <input
            name="meetLink"
            value={form.meetLink}
            onChange={handleChange}
            placeholder="Meeting link"
            className="w-full p-2 border border-border rounded-md bg-muted"
          />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Notes"
            className="w-full p-2 border border-border rounded-md bg-muted"
          />
        </div>

        <div className="flex justify-between mt-6">
          {form.id && (
            <Button
              variant="destructive"
              onClick={() => onDelete(form.id)}
            >
              Delete
            </Button>
          )}

          <div className="flex space-x-3 ml-auto">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {form.id ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingModal;
