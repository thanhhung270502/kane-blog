import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const getTimestamp = (date?: Date | string | number, isSeconds: boolean = false) => {
  return isSeconds ? dayjs(date).unix() : dayjs(date).valueOf();
};

export function isBeforeToday(date: Date): boolean {
  return dayjs(date).isBefore(dayjs(), "day");
}

export function isDateBefore(date1: Date, date2: Date): boolean {
  return dayjs(date1).isBefore(dayjs(date2), "day");
}

export function isAfterToday(date: Date): boolean {
  return dayjs(date).isAfter(dayjs(), "day");
}

export function isDateAfter(date1: Date, date2: Date): boolean {
  return dayjs(date1).isAfter(dayjs(date2), "day");
}

export function isToday(date: Date): boolean {
  return dayjs(date).isSame(dayjs(), "day");
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return dayjs(date1).isSame(date2, "day");
}

export const isSameOrRelativeTo = (
  baseDate?: Date,
  compareDate?: Date,
  direction: "after" | "before" = "after"
): boolean => {
  const base = dayjs(baseDate);
  const target = dayjs(compareDate);
  if (direction === "after") {
    return base.isSame(target) || base.isAfter(target);
  }

  return base.isSame(target) || base.isBefore(target);
};

export function isMorning(date: Date): boolean {
  const time = dayjs(date);
  return time.isBefore(dayjs(date).hour(12).minute(0).second(0));
}

export function isAfternoon(date: Date): boolean {
  const time = dayjs(date);
  const noonTime = dayjs(date).hour(12).minute(0).second(0);
  const eveningTime = dayjs(date).hour(17).minute(0).second(0);

  // Check if time is between noon (inclusive) and evening (inclusive)
  return (
    time.isAfter(noonTime.subtract(1, "second")) && time.isBefore(eveningTime.add(1, "second"))
  );
}

export function isEvening(date: Date): boolean {
  const time = dayjs(date);
  return time.isAfter(dayjs(date).hour(17).minute(0).second(0));
}

export function format12HourTime(time?: string | Date, currentFormat?: string): string | null {
  const parsedTime = currentFormat ? dayjs(time, currentFormat) : dayjs(time);
  if (!parsedTime.isValid()) {
    return null;
  }
  return parsedTime.format("hh:mm A");
}

export function normalizeTimeInput(input: string) {
  const match = input.match(/^0?(\d{1,2})(\d{2})?([APap][Mm])?$/);
  if (!match) return input;

  let [_, hour, minute, period] = match;
  if (!minute && !period) return `${hour}`;

  if (period) {
    return dayjs(`${hour}:${minute || "00"} ${period.toUpperCase()}`, "h:mm A").format("h:mm A");
  } else {
    return `${hour}:${minute || "00"}`;
  }
}

export function getMMMMDDFormattedDate(time: Date) {
  return dayjs(time).format("MMMM DD");
}

export function getddddMMMDDFormattedDate(time: Date) {
  return dayjs(time).format("dddd, MMM. DD");
}

/**
 * Extracts the date part from a string or Date object.
 * Eg: "2023-10-01T12:00:00Z" => "2023-10-01"
 * @param date
 */
export const getDateString = (date: string | Date) => {
  if (typeof date === "string") {
    return date.split("T")[0];
  }

  return date.toISOString().split("T")[0];
};
// Eg: Friday, December 19 at 4:30 pm
export function getFullFormattedDate(time?: Date) {
  if (!time) return "";
  return dayjs(time).format("dddd, MMMM D [at] h:mm A");
}

export function guessTimezoneOffset(): string {
  return (dayjs().utcOffset() / 60).toString();
}

export function endOfDate(date?: Date) {
  return dayjs(date).endOf("day").toDate();
}

export function startOfDate(date?: Date) {
  return dayjs(date).startOf("day").toDate();
}

export function startOfWeek(date?: Date) {
  return dayjs(date).startOf("week").toDate();
}

export function endOfWeek(date?: Date) {
  return dayjs(date).endOf("week").toDate();
}

export function startOfMonth(date: Date) {
  return dayjs(date).startOf("month").toDate();
}

export function endOfMonthWithOffset(date: Date, offsetMonths: number = 0) {
  return dayjs(date).add(offsetMonths, "month").endOf("month").toDate();
}

export function getDayOfMonth(date: Date) {
  return dayjs(date).utc().get("date");
}

export function toISOString(date?: Date | null) {
  return dayjs(date || undefined).toISOString();
}

export function toDate(date?: Date | string, format?: string) {
  return dayjs(date, format).toDate();
}

export function toMMDDYYYY(date?: Date | string) {
  return dayjs(date).format("MM/DD/YYYY");
}

export function toYYYYMMDD(date?: Date | string) {
  return dayjs(date).format("YYYY-MM-DD");
}

export function subtractMinutes(date: Date, minutes: number) {
  return dayjs(date).subtract(minutes, "minute").toDate();
}

export function subtractHours(date: Date, hours: number) {
  return dayjs(date).subtract(hours, "hour").toDate();
}

export function subtractDays(date: Date, days: number) {
  return dayjs(date).subtract(days, "day").toDate();
}

export function subtractMonths(date: Date, months: number) {
  return dayjs(date).subtract(months, "month").toDate();
}

export function subtractYears(date: Date, years: number) {
  return dayjs(date).subtract(years, "year").toDate();
}

export function addMinutes(date: Date, minutes: number) {
  return dayjs(date).add(minutes, "minute").toDate();
}

export function addHours(date: Date, hours: number) {
  return dayjs(date).add(hours, "hour").toDate();
}

export function addDays(date: Date, days: number) {
  return dayjs(date).add(days, "day").toDate();
}

export function addWeeks(date: Date, weeks: number) {
  return dayjs(date).add(weeks, "week").toDate();
}

export function addMonths(date: Date, months: number) {
  return dayjs(date).add(months, "month").toDate();
}

export function getDiffInMinutes(date1?: Date, date2?: Date) {
  return dayjs(date1).diff(dayjs(date2), "minutes");
}

export function formatRelativeTime(date?: Date | string, addSuffix: boolean = true) {
  if (!date) return "";
  return dayjs(date).fromNow(addSuffix);
}

export function getDiffYears(date1?: Date, date2?: Date) {
  return dayjs(date1).diff(dayjs(date2), "year");
}

export function formatDate(date?: Date | string, format: string = "MM/DD/YYYY") {
  return dayjs(date).format(format);
}

export function getOrdinal(day: number): string {
  // Use a fixed date in January, as only the day is relevant
  return dayjs(`2020-01-${String(day).padStart(2, "0")}`).format("Do");
}

export function getYearFromDate(date?: Date | string) {
  return dayjs(date).year();
}

/**
 * Converts a time value to 24-hour format (HH:mm).
 * @param time - The time to format (string, Date, or undefined)
 * @param currentFormat - Optional format of the input time string (e.g., "hh:mm A" for 12-hour format)
 * @returns The time in 24-hour format (e.g., "19:00"), or null if the input is invalid
 * @example
 * formatTo24Hour("07:30 PM", "hh:mm A") // Returns "19:30"
 * formatTo24Hour("19:30") // Returns "19:30"
 * formatTo24Hour(new Date()) // Returns current time in 24-hour format
 */
export function format24HourTime(time?: string | Date, currentFormat?: string): string | null {
  const parsedTime = currentFormat ? dayjs(time, currentFormat) : dayjs(time);

  if (!parsedTime.isValid()) {
    return null;
  }
  return parsedTime.format("HH:mm");
}

export const getOffset = (ianaTimezone?: string) => {
  const timezone = ianaTimezone || dayjs.tz.guess();
  dayjs.tz.setDefault(timezone);
  const offset = dayjs().utcOffset() / 60;
  const sign = offset >= 0 ? "+" : "-";
  return `${sign}${Math.abs(offset)}`;
};
