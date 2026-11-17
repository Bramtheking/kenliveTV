import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  User, 
  Bell, 
  Check, 
  Tv, 
  Filter 
} from 'lucide-react';
import { WEEKLY_SCHEDULE, ScheduleSlot, DayOfWeek } from '../config/schedule';
import { getEATDayOfWeek, getEATDate, getSlotStatus } from '../lib/time';

const DAYS: { key: DayOfWeek; label: string; swahili: string; short: string }[] = [
  { key: 'monday', label: 'Monday', swahili: 'Jumatatu', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', swahili: 'Jumanne', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', swahili: 'Jumatano', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', swahili: 'Alhamisi', short: 'Thu' },
  { key: 'friday', label: 'Friday', swahili: 'Ijumaa', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', swahili: 'Jumamosi', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', swahili: 'Jumapili', short: 'Sun' },
];

export const Schedule: React.FC = () => {
  const currentEATDay = getEATDayOfWeek();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(currentEATDay);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [eatTimeStr, setEatTimeStr] = useState<string>('');
  const [currentMinutes, setCurrentMinutes] = useState<number>(0);

  const [reminders, setReminders] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kenlive_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const updateTime = () => {
      const d = getEATDate();
      setCurrentMinutes(d.getHours() * 60 + d.getMinutes());
      const hoursStr = d.getHours().toString().padStart(2, '0');
      const minsStr = d.getMinutes().toString().padStart(2, '0');
      setEatTimeStr(`${hoursStr}:${minsStr} EAT`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleReminder = (id: string) => {
    let updated: string[];
    if (reminders.includes(id)) {
      updated = reminders.filter(item => item !== id);
    } else {
      updated = [...reminders, id];
    }
    setReminders(updated);
    localStorage.setItem('kenlive_reminders', JSON.stringify(updated));
  };

  const daySlots = WEEKLY_SCHEDULE[selectedDay] || [];
  const filteredSlots = selectedCategory === 'all'
    ? daySlots
    : daySlots.filter(s => s.category === selectedCategory);

  return (
    <main className="min-h-screen py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C30D12] text-white text-[11px] font-heading font-extrabold uppercase tracking-wider">
                RATIBA YA VIPINDI
              </span>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                Nairobi • Africa/Nairobi
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-gray-950 dark:text-white leading-tight">
              KenLive TV Schedule
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Your 24/7 weekly broadcast lineup in East Africa Time (EAT, UTC+3)
            </p>
          </div>

          {/* Current Live EAT Clock */}
          <div className="bg-white dark:bg-[#14141A] border border-gray-200 dark:border-[#242430] px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C30D12]"></span>
            </span>
            <div>
              <div className="text-[10px] font-heading font-extrabold uppercase text-gray-500 dark:text-gray-400">
                Current Broadcast Time
              </div>
              <div className="font-mono text-lg font-bold text-gray-900 dark:text-white tracking-wider">
                {eatTimeStr || '12:00 EAT'}
              </div>
            </div>
          </div>
        </div>

        {/* Day of Week Tabs (Mon-Sun) with active day indicator */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
          {DAYS.map((d) => {
            const isSelected = selectedDay === d.key;
            const isToday = currentEATDay === d.key;

            return (
              <button
                key={d.key}
                onClick={() => setSelectedDay(d.key)}
                className={`shrink-0 px-4 py-3 rounded-2xl font-heading text-sm uppercase tracking-wider transition-all flex flex-col items-center min-w-[90px] min-h-[58px] ${
                  isSelected
                    ? 'bg-[#C30D12] text-white shadow-lg shadow-[#C30D12]/30 font-extrabold scale-105'
                    : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-200 dark:bg-[#14141A] dark:text-gray-300 dark:hover:bg-[#1E1E28] border dark:border-[#242430]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>{d.short}</span>
                  {isToday && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Today" />
                  )}
                </div>
                <span className={`text-[10px] font-sans font-normal ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  {d.swahili}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 text-xs">
          <span className="text-gray-500 font-semibold uppercase text-[10px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {['all', 'news', 'politics', 'business', 'sports', 'entertainment', 'culture'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl uppercase font-heading font-bold tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'bg-gray-200/80 text-gray-700 hover:text-black dark:bg-[#17171F] dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Schedule Slots Timeline List */}
        <div className="space-y-3.5">
          {filteredSlots.map((slot) => {
            const isToday = selectedDay === currentEATDay;
            const status = isToday ? getSlotStatus(slot, currentMinutes) : 'upcoming';
            const isLive = status === 'live';
            const isPast = status === 'past';
            const isReminded = reminders.includes(slot.id);

            return (
              <div
                key={slot.id}
                className={`rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
                  isLive
                    ? 'bg-gradient-to-r from-red-50 to-white dark:from-[#C30D12]/20 dark:via-[#181216] dark:to-[#121217] border-[#C30D12] ring-2 ring-[#C30D12]/30 shadow-xl'
                    : isPast
                    ? 'bg-gray-100/70 border-gray-200 dark:bg-[#0E0E12]/60 dark:border-[#1C1C24] opacity-60'
                    : 'bg-white dark:bg-[#14141A] border-gray-200 dark:border-[#242430] hover:border-gray-400 dark:hover:border-gray-600 shadow-sm'
                }`}
              >
                {/* Time & Badge */}
                <div className="md:w-44 shrink-0 flex items-center gap-3">
                  <div className="font-mono text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${isLive ? 'text-[#C30D12]' : 'text-gray-500'}`} />
                    <span>{slot.startTime}</span>
                    <span className="text-xs text-gray-500 font-normal">- {slot.endTime}</span>
                  </div>

                  {isLive && (
                    <span className="px-2 py-0.5 rounded-full bg-[#C30D12] text-white text-[10px] font-heading font-extrabold uppercase animate-pulse">
                      ● LIVE
                    </span>
                  )}
                </div>

                {/* Show Title & Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-heading font-extrabold uppercase tracking-wider bg-gray-100 text-gray-800 dark:bg-[#20202B] dark:text-gray-300">
                      {slot.category}
                    </span>
                    {slot.isLiveBroadcast && (
                      <span className="text-[10px] font-bold text-[#C30D12] uppercase tracking-wider">
                        Live Studio Broadcast
                      </span>
                    )}
                  </div>

                  <Link 
                    to={`/shows/${slot.showSlug}`} 
                    className="group/title block"
                  >
                    <h3 className={`font-heading font-extrabold text-lg sm:text-xl uppercase tracking-tight transition-colors ${
                      isLive 
                        ? 'text-[#C30D12] dark:text-white' 
                        : 'text-gray-900 dark:text-gray-100 group-hover/title:text-[#C30D12]'
                    }`}>
                      {slot.title}
                    </h3>
                  </Link>

                  {slot.swahiliTitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-1">
                      {slot.swahiliTitle}
                    </p>
                  )}

                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-0.5">
                    {slot.description}
                  </p>
                </div>

                {/* Presenter & Reminder Button */}
                <div className="shrink-0 flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>{slot.presenter}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLive ? (
                      <Link
                        to="/watch"
                        className="px-4 py-2 rounded-xl bg-[#C30D12] hover:bg-[#A0090E] text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#C30D12]/30"
                      >
                        <Tv className="w-3.5 h-3.5" />
                        <span>Watch Now</span>
                      </Link>
                    ) : !isPast ? (
                      <button
                        onClick={() => toggleReminder(slot.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                          isReminded
                            ? 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-[#1C1C26] dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#2A2A38]'
                        }`}
                      >
                        {isReminded ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                        <span>{isReminded ? 'Reminded' : 'Add Reminder'}</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Schedule;
