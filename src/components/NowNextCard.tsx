import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Bell, Check, ChevronRight, Radio } from 'lucide-react';
import { getCurrentAndNextShow } from '../lib/time';

export const NowNextCard: React.FC = () => {
  const [scheduleState, setScheduleState] = useState(getCurrentAndNextShow());
  const [remindedShows, setRemindedShows] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kenlive_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setScheduleState(getCurrentAndNextShow());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const toggleReminder = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated: string[];
    if (remindedShows.includes(id)) {
      updated = remindedShows.filter(item => item !== id);
    } else {
      updated = [...remindedShows, id];
    }
    setRemindedShows(updated);
    localStorage.setItem('kenlive_reminders', JSON.stringify(updated));
  };

  const { currentShow, nextShow, progressPercent } = scheduleState;
  const isReminded = remindedShows.includes(nextShow.id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
      {/* NOW Card */}
      <div className="p-4 rounded-xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C30D12] text-white text-[11px] font-heading font-extrabold uppercase tracking-wider shadow">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              SASA HIVI / AIRING NOW
            </span>
            <span className="text-xs font-mono text-gray-400 light:text-gray-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C30D12]" />
              {currentShow.startTime} - {currentShow.endTime} EAT
            </span>
          </div>

          <Link 
            to={`/shows/${currentShow.showSlug}`} 
            className="group block"
          >
            <h3 className="font-heading text-lg sm:text-xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-950 group-hover:text-[#C30D12] transition-colors flex items-center gap-1">
              {currentShow.title}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            {currentShow.swahiliTitle && (
              <p className="text-xs text-gray-400 light:text-gray-600 italic">
                {currentShow.swahiliTitle}
              </p>
            )}
          </Link>

          <p className="text-xs text-gray-300 light:text-gray-700 mt-1 line-clamp-2">
            {currentShow.description}
          </p>
        </div>

        {/* Presenter & Progress bar */}
        <div className="mt-3 pt-3 border-t border-[#20202B] dark:border-[#20202B] light:border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400 light:text-gray-600 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium text-gray-300 light:text-gray-800">
              <User className="w-3.5 h-3.5 text-[#C30D12]" />
              {currentShow.presenter}
            </span>
            <span className="font-mono text-[11px] font-bold text-[#C30D12]">
              {progressPercent}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#20202B] dark:bg-[#20202B] light:bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#C30D12] to-[#E01C22] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* UP NEXT Card */}
      <div className="p-4 rounded-xl bg-[#14141A] dark:bg-[#14141A] light:bg-white border border-[#242430] dark:border-[#242430] light:border-gray-200 shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0B5CAB]/20 border border-[#0B5CAB]/40 text-[#0B5CAB] text-[11px] font-heading font-extrabold uppercase tracking-wider">
              INAYOFUATA / UP NEXT
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 light:text-amber-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Starts at {nextShow.startTime} EAT
            </span>
          </div>

          <Link 
            to={`/shows/${nextShow.showSlug}`}
            className="group block"
          >
            <h3 className="font-heading text-lg sm:text-xl font-extrabold uppercase tracking-tight text-white dark:text-white light:text-gray-950 group-hover:text-[#0B5CAB] transition-colors flex items-center gap-1">
              {nextShow.title}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            {nextShow.swahiliTitle && (
              <p className="text-xs text-gray-400 light:text-gray-600 italic">
                {nextShow.swahiliTitle}
              </p>
            )}
          </Link>

          <p className="text-xs text-gray-300 light:text-gray-700 mt-1 line-clamp-2">
            {nextShow.description}
          </p>
        </div>

        {/* Presenter & Remind Me Bell */}
        <div className="mt-3 pt-3 border-t border-[#20202B] dark:border-[#20202B] light:border-gray-100 flex items-center justify-between">
          <span className="text-xs flex items-center gap-1.5 font-medium text-gray-300 light:text-gray-800">
            <User className="w-3.5 h-3.5 text-gray-400" />
            {nextShow.presenter}
          </span>

          <button
            onClick={(e) => toggleReminder(nextShow.id, e)}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all min-h-[36px] ${
              isReminded
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-[#1C1C26] light:bg-gray-100 text-gray-300 light:text-gray-700 hover:text-white hover:bg-[#282836]'
            }`}
            title={isReminded ? 'Reminder set' : 'Remind me before show starts'}
          >
            {isReminded ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Reminded</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Remind Me</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NowNextCard;

