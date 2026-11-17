/**
 * KenLive TV - East Africa Time (EAT) & Schedule Calculations
 * ==========================================================
 * Kenya operates on East Africa Time (UTC+3) year-round with no Daylight Saving Time.
 */

import { WEEKLY_SCHEDULE, ScheduleSlot, DayOfWeek } from '../config/schedule';

/**
 * Returns a Date object representing the current moment in Africa/Nairobi time.
 */
export function getEATDate(): Date {
  const now = new Date();
  // Format string in Africa/Nairobi timezone
  const nairobiString = now.toLocaleString("en-US", { timeZone: "Africa/Nairobi" });
  return new Date(nairobiString);
}

/**
 * Returns current day of week key in EAT ('monday', 'tuesday', etc.)
 */
export function getEATDayOfWeek(): DayOfWeek {
  const eatDate = getEATDate();
  const dayIndex = eatDate.getDay(); // 0 is Sunday, 1 is Monday...
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[dayIndex];
}

/**
 * Converts "HH:MM" string to minutes from start of day (0 - 1439)
 */
export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Formats minutes from midnight into 12-hour or 24-hour string
 */
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Checks if a slot spans across midnight (e.g. 23:00 to 01:00)
 */
export function isSlotActive(currentTimeMinutes: number, startTimeStr: string, endTimeStr: string): boolean {
  const startMin = timeStringToMinutes(startTimeStr);
  let endMin = timeStringToMinutes(endTimeStr);

  if (endMin <= startMin) {
    // Overnight slot (e.g. 23:00 -> 01:00 or 01:00 -> 05:00)
    return currentTimeMinutes >= startMin || currentTimeMinutes < endMin;
  }

  return currentTimeMinutes >= startMin && currentTimeMinutes < endMin;
}

/**
 * Finds the currently airing show and the next upcoming show in Africa/Nairobi time.
 */
export function getCurrentAndNextShow(): {
  currentShow: ScheduleSlot;
  nextShow: ScheduleSlot;
  progressPercent: number;
  timeRemainingMinutes: number;
  eatTimeString: string;
} {
  const eatDate = getEATDate();
  const currentMinutes = eatDate.getHours() * 60 + eatDate.getMinutes();
  const dayOfWeek = getEATDayOfWeek();
  const todaySlots = WEEKLY_SCHEDULE[dayOfWeek] || WEEKLY_SCHEDULE.monday;

  let activeIndex = -1;

  for (let i = 0; i < todaySlots.length; i++) {
    const slot = todaySlots[i];
    if (isSlotActive(currentMinutes, slot.startTime, slot.endTime)) {
      activeIndex = i;
      break;
    }
  }

  if (activeIndex === -1) {
    activeIndex = 0;
  }

  const currentShow = todaySlots[activeIndex];
  const nextIndex = (activeIndex + 1) % todaySlots.length;
  const nextShow = todaySlots[nextIndex];

  // Calculate progress
  const startMin = timeStringToMinutes(currentShow.startTime);
  let endMin = timeStringToMinutes(currentShow.endTime);
  if (endMin <= startMin) {
    endMin += 24 * 60; // adjust for overnight
  }

  let adjustedCurrent = currentMinutes;
  if (adjustedCurrent < startMin) {
    adjustedCurrent += 24 * 60;
  }

  const totalDuration = Math.max(1, endMin - startMin);
  const elapsed = Math.max(0, adjustedCurrent - startMin);
  const progressPercent = Math.min(100, Math.round((elapsed / totalDuration) * 100));
  const timeRemainingMinutes = Math.max(0, endMin - adjustedCurrent);

  const hoursStr = eatDate.getHours().toString().padStart(2, '0');
  const minsStr = eatDate.getMinutes().toString().padStart(2, '0');

  return {
    currentShow,
    nextShow,
    progressPercent,
    timeRemainingMinutes,
    eatTimeString: `${hoursStr}:${minsStr} EAT`,
  };
}

/**
 * Checks if a given slot on today's schedule is in the past, current, or future.
 */
export function getSlotStatus(slot: ScheduleSlot, currentMinutes: number): 'past' | 'live' | 'upcoming' {
  if (isSlotActive(currentMinutes, slot.startTime, slot.endTime)) {
    return 'live';
  }

  const startMin = timeStringToMinutes(slot.startTime);
  let endMin = timeStringToMinutes(slot.endTime);
  if (endMin <= startMin) {
    endMin += 24 * 60;
  }

  if (currentMinutes >= endMin) {
    return 'past';
  }

  return 'upcoming';
}

