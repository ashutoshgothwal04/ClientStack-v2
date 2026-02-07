import { useState } from "react";
import Button from "../../../components/ui/Button";
import { toast } from "sonner";

const FeedbackModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "General",
    message: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Feedback:", form);

    toast.success("Feedback submitted successfully!");

    setForm({
      name: "",
      email: "",
      category: "General",
      message: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <h2 className="mb-1 text-xl font-semibold">Send Feedback</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Help us improve your experience
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
            required
          />

          {/* Category */}
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
          >
            <option value="General">General</option>
            <option value="Bug">Bug</option>
            <option value="Feature">Feature Request</option>
          </select>

          <textarea
            placeholder="Describe your feedback..."
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
            rows={4}
            className="w-full rounded-md border px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
            required
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
