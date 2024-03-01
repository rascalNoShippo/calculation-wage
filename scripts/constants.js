/** 時給の初期値 */
export const DEFAULT_HOURLY_WAGE = 1150;

export const ONE_DAY_MINUTES = 1440;
export const LEGAL_WORK_MINUTES = 480;
export const PREMIUM_WAGE_RATE = 0.25;

export const ElementIdEnum = /** @type {const} */ ({
  hourlyWage: "hourly_wage",
  startTime: "start_time",
  endTime: "end_time",
  breakStartTime: "break_start_time",
  breakEndTime: "break_end_time",
  nextDay: "next_day",
  breakStartNextDay: "break_start_next_day",
  breakEndNextDay: "break_end_next_day",
  resetButton: "reset_button",
  errorMsg: "error_msg",
  workTime: "work_time",
  lateNightTime: "late_night_time",
  breakTime: "break_time",
  breakLateNightTime: "break_late_night_time",
  basicWage: "basic_wage",
  overtimeWage: "overtime_wage",
  lateNightWage: "late_night_wage",
  totalWage: "total_wage",
});

/** @typedef {typeof ElementIdEnum[keyof typeof ElementIdEnum]} ElementId */

/**
 * @typedef {{
 *   [ElementIdEnum.hourlyWage]: HTMLInputElement
 *   [ElementIdEnum.startTime]: HTMLInputElement
 *   [ElementIdEnum.endTime]: HTMLInputElement
 *   [ElementIdEnum.breakStartTime]: HTMLInputElement
 *   [ElementIdEnum.breakEndTime]: HTMLInputElement
 *   [ElementIdEnum.resetButton]: HTMLButtonElement
 *   [key: string]: HTMLElement
 * }} ElementTypeMap
 */