import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const CalendarHeader = ({ onNewMeeting, view, setView }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Schedule Meetings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your meetings and reminders
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex border border-border rounded-md overflow-hidden">
          <button
            onClick={() => setView("dayGridMonth")}
            className={`px-4 py-2 text-sm ${
              view === "dayGridMonth"
                ? "bg-primary text-primary-foreground"
                : "bg-card"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView("timeGridWeek")}
            className={`px-4 py-2 text-sm ${
              view === "timeGridWeek"
                ? "bg-primary text-primary-foreground"
                : "bg-card"
            }`}
          >
            Week
          </button>
        </div>

        <Button onClick={onNewMeeting}>
          <Icon name="Plus" size={16} className="mr-2" />
          New Meeting
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
