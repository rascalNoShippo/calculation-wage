import { DEFAULT_HOURLY_WAGE } from "./constants";
import { convertMinutesToTime, getElementByIdOrThrow, toPrice } from "./util";

export const element = {
  hourlyWage: /**@type {HTMLInputElement}*/ (
    getElementByIdOrThrow("hourly_wage")
  ),
  startTime: /**@type {HTMLInputElement}*/ (
    getElementByIdOrThrow("start_time")
  ),
  endTime: /**@type {HTMLInputElement}*/ (getElementByIdOrThrow("end_time")),
  breakStartTime: /**@type {HTMLInputElement}*/ (
    getElementByIdOrThrow("break_start_time")
  ),
  breakEndTime: /**@type {HTMLInputElement}*/ (
    getElementByIdOrThrow("break_end_time")
  ),
  nextDay: getElementByIdOrThrow("next_day"),
  breakStartNextDay: getElementByIdOrThrow("break_start_next_day"),
  breakEndNextDay: getElementByIdOrThrow("break_end_next_day"),
  resetButton: /**@type {HTMLButtonElement}*/ (
    getElementByIdOrThrow("reset_button")
  ),
  errorMsg: getElementByIdOrThrow("error_msg"),
  workTime: getElementByIdOrThrow("work_time"),
  lateNightTime: getElementByIdOrThrow("late_night_time"),
  breakTime: getElementByIdOrThrow("break_time"),
  breakLateNightTime: getElementByIdOrThrow("break_late_night_time"),
  basicWage: getElementByIdOrThrow("basic_wage"),
  overtimeWage: getElementByIdOrThrow("overtime_wage"),
  lateNightWage: getElementByIdOrThrow("late_night_wage"),
  totalWage: getElementByIdOrThrow("total_wage"),
};

/** 入力欄・計算結果をリセットする */
export const resetAll = () => {
  const {
    hourlyWage,
    startTime,
    endTime,
    breakStartTime,
    breakEndTime,
    nextDay,
    breakStartNextDay,
    breakEndNextDay,
    errorMsg,
  } = element;

  setResult(NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN);
  hourlyWage.value = `${DEFAULT_HOURLY_WAGE}`;
  startTime.value = "";
  endTime.value = "";
  breakStartTime.value = "";
  breakEndTime.value = "";
  nextDay.textContent = "";
  breakStartNextDay.textContent = "";
  breakEndNextDay.textContent = "";
  errorMsg.textContent = "";
};

/**
 * 計算結果を表示する(引数がNaNの場合は空文字列を表示する)
 * @param {number} workMinutes - 勤務時間（分、休憩時間を除く）
 * @param {number} lateNightMinutes - 深夜時間（分）
 * @param {number} breakMinutes - 休憩時間（分）
 * @param {number} breakLateNightMinutes - 休憩時間中の深夜時間（分）
 * @param {number} basicWage - 基本給（円）
 * @param {number} overtimeWage - 法定外残業代（円）
 * @param {number} lateNightWage - 深夜残業代（円）
 * @param {number} totalWage - 合計（円）
 */
export const setResult = (
  workMinutes,
  lateNightMinutes,
  breakMinutes,
  breakLateNightMinutes,
  basicWage,
  overtimeWage,
  lateNightWage,
  totalWage
) => {
  const {
    workTime,
    lateNightTime,
    breakTime,
    breakLateNightTime,
    basicWage: basicWageElement,
    overtimeWage: overtimeWageElement,
    lateNightWage: lateNightWageElement,
    totalWage: totalWageElement,
  } = element;

  workTime.textContent = convertMinutesToTime(workMinutes);
  lateNightTime.textContent = convertMinutesToTime(lateNightMinutes);
  breakTime.textContent = convertMinutesToTime(breakMinutes);
  breakLateNightTime.textContent = convertMinutesToTime(breakLateNightMinutes);
  basicWageElement.textContent = toPrice(basicWage);
  overtimeWageElement.textContent = toPrice(overtimeWage);
  lateNightWageElement.textContent = toPrice(lateNightWage);
  totalWageElement.textContent = toPrice(totalWage);
};
