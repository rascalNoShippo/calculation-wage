import {
  DEFAULT_HOURLY_WAGE,
  ONE_DAY_MINUTES,
  ElementIdEnum,
} from "./constants.js";
import {
  convertMinutesToTime,
  convertTimeToInt,
  getElementByIdOrThrow,
  toPrice,
} from "./utils.js";

export const element = /**
  @type {{
    [key in keyof typeof ElementIdEnum]: 
      import("./constants").ElementTypeMap[ElementIdEnum[key]]
  }}
*/ (
  Object.entries(ElementIdEnum).reduce((obj, [key, id]) => {
    const element = getElementByIdOrThrow(id);
    return Object.assign(obj, { [key]: element });
  }, {})
);

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

  Object.values(element).forEach((e) => {
    if (e instanceof HTMLInputElement) {
      e.value = "";
      return;
    }
    if (!(e instanceof HTMLButtonElement)) {
      e.textContent = "";
    }
  });

  setResult();
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
 * @param {number} [workMinutes] - 勤務時間（分、休憩時間を除く）
 * @param {number} [lateNightMinutes] - 深夜時間（分）
 * @param {number} [breakMinutes] - 休憩時間（分）
 * @param {number} [breakLateNightMinutes] - 休憩時間中の深夜時間（分）
 * @param {number} [basicWage] - 基本給（円）
 * @param {number} [overtimeWage] - 法定外残業代（円）
 * @param {number} [lateNightWage] - 深夜残業代（円）
 * @param {number} [totalWage] - 合計（円）
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

/** 計算に必要な値を取得する */
export const getInputValues = () => {
  /** 時給 */
  const hourlyWage = +element.hourlyWage.value;
  if (hourlyWage <= 0) throw new Error("時給が未入力です");

  /** 始業時刻 */
  const start = convertTimeToInt(element.startTime.value);
  if (start === undefined) throw new Error("始業時刻が未入力です");

  /** 終業時刻 */
  const end = (() => {
    // 終業時刻が始業時刻より前の場合は翌日とみなす
    const end = convertTimeToInt(element.endTime.value);
    if (end === undefined) throw new Error("終業時刻が未入力です");
    return end + (end < start ? ONE_DAY_MINUTES : 0);
  })();

  /** 休憩開始時刻 */
  const breakStart = (() => {
    // 休憩開始時刻が始業時刻より前の場合は翌日とみなす
    const breakStart = convertTimeToInt(element.breakStartTime.value);
    if (breakStart === undefined) return;
    return breakStart + (breakStart < start ? ONE_DAY_MINUTES : 0);
  })();

  /** 休憩終了時刻 */
  const breakEnd = (() => {
    // 休憩終了時刻が始業時刻より前の場合は翌日とみなす
    const breakEnd = convertTimeToInt(element.breakEndTime.value);
    if (breakEnd === undefined) return;
    return breakEnd + (breakEnd < start ? ONE_DAY_MINUTES : 0);
  })();

  if ((breakStart === undefined) !== (breakEnd === undefined))
    throw new Error("休憩時間は両方入力するか両方未入力にしてください");

  return {
    hourlyWage,
    start,
    end,
    breakStart: breakStart ?? start,
    breakEnd: breakEnd ?? start,
  };
};
