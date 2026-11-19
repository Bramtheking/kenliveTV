import { useEffect, useState } from "react";
import { getActiveSchedules } from "@/lib/firebase-utils";
import type { Schedule } from "@/lib/types";
import { Calendar, Clock, User, Tv } from "lucide-react";
import { format } from "date-fns";

const categoryColors: Record<string, string> = {
  News: "bg-blue-500",
  Politics: "bg-purple-500",
  Entertainment: "bg-pink-500",
  Sports: "bg-green-500",
  "Talk Show": "bg-orange-500",
  Music: "bg-red-500",
  Other: "bg-gray-500",
};

const ScheduleDisplay = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const today = format(new Date(), "EEEE");

  useEffect(() => {
    getActiveSchedules()
      .then(setSchedules)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    selectedDay === "all"
      ? schedules
      : schedules.filter(s => s.daysOfWeek.includes(selectedDay));

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-xl p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading schedule…</p>
        </div>
      </div>
    );
  }

  return (
    <div id="schedule" className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-6 py-4 flex items-center gap-3">
        <Calendar className="w-5 h-5 text-primary-foreground" />
        <div>
          <h3 className="font-bold text-primary-foreground text-lg">Program Schedule</h3>
          <p className="text-xs text-primary-foreground/80">TV Program Lineup</p>
        </div>
      </div>

      {/* Day filter */}
      <div className="bg-muted border-b border-border px-4 py-3 flex flex-wrap gap-2">
        {[{ key: "all", label: "All Days" }, { key: today, label: "Today" }].map(d => (
          <button
            key={d.key}
            onClick={() => setSelectedDay(d.key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedDay === d.key ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-card"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="p-4 max-h-[420px] overflow-y-auto space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground text-sm">No programs scheduled</p>
          </div>
        ) : (
          filtered.map(schedule => (
            <div key={schedule.id} className="bg-muted rounded-lg p-3 border border-border hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className={`${categoryColors[schedule.category] || "bg-gray-500"} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                  {schedule.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{schedule.startTime} – {schedule.endTime}</span>
                </div>
              </div>
              <h4 className="font-bold text-foreground text-xs mb-1">{schedule.title}</h4>
              {schedule.description && (
                <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{schedule.description}</p>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <User className="w-3 h-3" />
                <span className="truncate">{schedule.host}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {schedule.daysOfWeek.map(day => (
                  <span
                    key={day}
                    className={`text-xs px-2 py-0.5 rounded ${
                      day === today ? "bg-primary/20 text-primary font-medium" : "bg-background text-muted-foreground"
                    }`}
                  >
                    {day.substring(0, 3)}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <div className="bg-muted border-t border-border px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Tv className="w-3 h-3 text-primary" />
            <span>{filtered.length} program{filtered.length !== 1 ? "s" : ""} scheduled</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleDisplay;
