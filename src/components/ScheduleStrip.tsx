import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Bell, Check, ChevronRight, Calendar, Radio } from 'lucide-react';
import { WEEKLY_SCHEDULE, ScheduleSlot } from '../config/schedule';
import { getEATDayOfWeek, getEATDate, getSlotStatus, timeStringToMinutes } from '../lib/time';

export const ScheduleStrip: React.FC = () => {
  const [dayOfWeek, setDayOfWeek] = useState(getEATDayOfWeek());
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const d = getEATDate();
    return d.getHours() * 60 + d.getMinutes();
  });

  const [reminders, setReminders] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kenlive_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const d = getEATDate();
      setCurrentMinutes(d.getHours() * 60 + d.getMinutes());
      setDayOfWeek(getEATDayOfWeek());
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const todaySlots: ScheduleSlot[] = WEEKLY_SCHEDULE[dayOfWeek] || WEEKLY_SCHEDULE.monday;

  const toggleReminder = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated: string[];
    if (reminders.includes(id)) {
      updated = reminders.filter(item => item !== id);
    } else {
      updated = [...reminders, id];
    }
    setReminders(updated);
    localStorage.setItem('kenlive_reminders', JSON.stringify(updated));
  };

  const dayCapitalized = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  return (
    <section className="my-8 sm:my-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#C30D12]/20 text-[#C30D12]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-950">
                Today's Schedule
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#C30D12] text-white uppercase">
                {dayCapitalized}
              </span>
            </div>
            <p className="text-xs text-gray-400 light:text-gray-600">
              Ratiba ya Leo • East Africa Time (EAT UTC+3)
            </p>
          </div>
        </div>

        <Link
          to="/schedule"
          className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-[#C30D12] hover:text-[#E01C22] flex items-center gap-1 group"
        >
          <span>Full Weekly Schedule</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Horizontal Scroll on Mobile / Grid & Timeline on Desktop */}
      <div className="overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-gray-800">
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 min-w-max sm:min-w-0">
          {todaySlots.slice(0, 8).map((slot) => {
            const status = getSlotStatus(slot, currentMinutes);
            const isLive = status === 'live';
            const isPast = status === 'past';
            const isReminded = reminders.includes(slot.id);

            return (
              <div
                key={slot.id}
                className={`w-72 sm:w-auto shrink-0 rounded-2xl p-4 transition-all flex flex-col justify-between border ${
                  isLive
                    ? 'bg-gradient-to-b from-[#C30D12]/25 to-[#17141A] border-[#C30D12] shadow-xl shadow-[#C30D12]/15 ring-2 ring-[#C30D12]/30 scale-[1.02]'
                    : isPast
                    ? 'bg-[#101015]/60 dark:bg-[#101015]/60 light:bg-gray-100/70 border-[#1E1E26] dark:border-[#1E1E26] light:border-gray-200 opacity-60'
                    : 'bg-[#14141A] dark:bg-[#14141A] light:bg-white border-[#242430] dark:border-[#242430] light:border-gray-200 hover:border-gray-600'
                }`}
              >
                <div>
                  {/* Slot Top: Time & Status Badge */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-mono text-xs font-bold text-gray-300 dark:text-gray-300 light:text-gray-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C30D12]" />
                      {slot.startTime} - {slot.endTime}
                    </span>

                    {isLive && (
                      <span className="px-2 py-0.5 rounded-full bg-[#C30D12] text-white text-[10px] font-heading font-extrabold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        LIVE NOW
                      </span>
                    )}

                    {isPast && (
                      <span className="text-[10px] uppercase font-bold text-gray-500">
                        Ended
                      </span>
                    )}

                    {status === 'upcoming' && (
                      <span className="text-[10px] uppercase font-bold text-[#0B5CAB]">
                        Upcoming
                      </span>
                    )}
                  </div>

                  {/* Show Title */}
                  <Link 
                    to={`/shows/${slot.showSlug}`}
                    className="group/title block"
                  >
                    <h3 className={`font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight line-clamp-1 transition-colors ${
                      isLive 
                        ? 'text-white' 
                        : 'text-gray-200 dark:text-gray-200 light:text-gray-900 group-hover/title:text-[#C30D12]'
                    }`}>
                      {slot.title}
                    </h3>
                  </Link>

                  {slot.swahiliTitle && (
                    <p className="text-[11px] text-gray-400 light:text-gray-500 italic mb-1.5 line-clamp-1">
                      {slot.swahiliTitle}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 light:text-gray-600 line-clamp-2 mt-1">
                    {slot.description}
                  </p>
                </div>

                {/* Slot Footer: Presenter & Reminder Button */}
                <div className="mt-4 pt-3 border-t border-white/10 dark:border-white/10 light:border-gray-200 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-400 light:text-gray-600 truncate max-w-[140px]">
                    {slot.presenter}
                  </span>

                  {!isPast && (
                    <button
                      onClick={(e) => toggleReminder(slot.id, e)}
                      className={`p-1.5 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                        isReminded
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      title={isReminded ? 'Reminder set' : 'Remind me'}
                      aria-label="Set reminder"
                    >
                      {isReminded ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScheduleStrip;

