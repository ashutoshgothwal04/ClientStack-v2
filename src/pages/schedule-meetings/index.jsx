import React, { useState } from "react";
import { toast } from "sonner";

import Sidebar from "../../components/ui/Sidebar";
import Header from "../../components/ui/Header";
import Breadcrumb from "../../components/ui/Breadcrumb";

import CalendarHeader from "./components/CalendarHeader";
import MeetingModal from "./components/MeetingModal";
import MeetingSidebar from "./components/MeetingSidebar";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


const ScheduleMeetings = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("dayGridMonth");

  // ➜ Create / Update
  const handleSaveMeeting = (data) => {
    if (data.id) {
      // Update
      setMeetings((prev) =>
        prev.map((m) => (m.id === data.id ? data : m))
      );
      toast.success("Meeting updated successfully");
    } else {
      const newMeeting = {
        ...data,
        id: Date.now().toString(),
      };
      setMeetings((prev) => [...prev, newMeeting]);
      toast.success("Meeting created successfully");
    }

    setShowModal(false);
    setSelectedMeeting(null);
  };

  // ➜ Delete
  const handleDeleteMeeting = (id) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    toast.error("Meeting deleted");
    setShowModal(false);
    setSelectedMeeting(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />
      <Header
        onMenuToggle={() => setSidebarExpanded(!sidebarExpanded)}
        sidebarExpanded={sidebarExpanded}
      />

      <main className="lg:ml-60 pt-16">
        <div className="p-6 space-y-6">
          <Breadcrumb
            customItems={[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Schedule Meetings", isLast: true },
            ]}
          />

          <CalendarHeader
            onNewMeeting={() => {
              setSelectedMeeting(null);
              setShowModal(true);
            }}
            view={view}
            setView={setView}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-4">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={view}
                events={meetings}
                selectable
                editable
                height="70vh"
                dateClick={(info) => {
                  setSelectedMeeting({
                    start: info.dateStr,
                    end: info.dateStr,
                  });
                  setShowModal(true);
                }}
                eventClick={(info) => {
                  setSelectedMeeting({
                    ...info.event.extendedProps,
                    id: info.event.id,
                    title: info.event.title,
                    start: info.event.startStr,
                    end: info.event.endStr,
                  });
                  setShowModal(true);
                }}
              />
            </div>

            <MeetingSidebar meetings={meetings} />
          </div>
        </div>
      </main>

      {showModal && (
        <MeetingModal
          meeting={selectedMeeting}
          onClose={() => setShowModal(false)}
          onSave={handleSaveMeeting}
          onDelete={handleDeleteMeeting}
        />
      )}
    </div>
  );
};

export default ScheduleMeetings;
