import React from "react";
import Icon from "../../../components/AppIcon";

const MeetingSidebar = ({ meetings }) => {
  const upcoming = meetings?.slice(0, 5);

  return (
    <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Upcoming Meetings</h3>
        <Icon name="Clock" size={18} />
      </div>

      {upcoming?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No meetings scheduled.
        </p>
      )}

      <div className="space-y-3">
        {upcoming?.map((m) => (
          <div
            key={m.id}
            className="p-3 rounded-lg border border-border hover:bg-muted/30 transition"
          >
            <p className="text-sm font-medium">{m.title}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(m.start).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingSidebar;
