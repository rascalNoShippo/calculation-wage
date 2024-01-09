import { LEGAL_WORK_MINUTES, ONE_DAY_MINUTES, PREMIUM_WAGE_RATE } from "./constants";
import { element, setResult } from "./elements";
import { calcOverlap, convertTimeToInt } from "./util";

export const handleInput = () => {
  const value = (() => {
    /** 始業時刻 */
    const start = convertTimeToInt(element.startTime.value);
    /** 終業時刻 */
    const end = (() => {
      // 終業時刻が始業時刻より前の場合は翌日とみなす
      const end = convertTimeToInt(element.endTime.value);
      return end + (end < start ? ONE_DAY_MINUTES : 0);
    })();
    /** 休憩開始時刻 */
    const breakStart = (() => {
      // 休憩開始時刻が始業時刻より前の場合は翌日とみなす
      const breakStart = convertTimeToInt(element.breakStartTime.value);
      return breakStart + (breakStart < start ? ONE_DAY_MINUTES : 0);
    })();
    /** 休憩終了時刻 */
    const breakEnd = (() => {
      // 休憩終了時刻が休憩開始時刻より前の場合は翌日とみなす
      const breakEnd = convertTimeToInt(element.breakEndTime.value);
      return breakEnd + (breakEnd < breakStart ? ONE_DAY_MINUTES : 0);
    })();

    return {
      hourlyWage: +element.hourlyWage.value,
      start,
      end,
      breakStart,
      breakEnd,
    };
  })();

  try {
    if (value.hourlyWage <= 0) throw new SyntaxError("時給が未入力です");
    if (!value.start) throw new SyntaxError("始業時刻が未入力です");
    if (!value.end) throw new SyntaxError("終業時刻が未入力です");
    if (+Number.isNaN(value.breakStart) + +Number.isNaN(value.breakEnd) === 1)
      throw new SyntaxError(
        "休憩時間は両方とも入力するか両方とも未入力にしてください"
      );

    element.nextDay.textContent = value.end >= ONE_DAY_MINUTES ? "(翌日)" : "";
    element.breakStartNextDay.textContent =
      value.breakStart >= ONE_DAY_MINUTES ? "(翌日)" : "";
    element.breakEndNextDay.textContent =
      value.breakEnd >= ONE_DAY_MINUTES ? "(翌日)" : "";

    /** 休憩時間（分） */
    const breakMinutes = (() => {
      const min = value.breakEnd - value.breakStart;
      return Number.isNaN(min) ? 0 : min;
    })();
    /** 勤務時間（分、休憩時間を除く） */
    const workMinutes = value.end - value.start - breakMinutes;

    (() => {
      const breakMinutesInWork = calcOverlap(
        value.start,
        value.end,
        value.breakStart,
        value.breakEnd
      );
      if (Number.isNaN(breakMinutesInWork)) return;
      if (breakMinutesInWork !== breakMinutes)
        throw new SyntaxError("休憩時間が勤務時間に含まれていません");
    })();

    /** 基本給（円） */
    const basicWage = (workMinutes * value.hourlyWage) / 60;
    /** 法定外残業代（円） */
    const overtimeWage =
      workMinutes > LEGAL_WORK_MINUTES
        ? ((workMinutes - LEGAL_WORK_MINUTES) *
            value.hourlyWage *
            PREMIUM_WAGE_RATE) /
          60
        : 0;
    /** 深夜時間帯開始時刻 */
    const lateNightStart = convertTimeToInt("22:00");
    /** 深夜時間帯終了時刻 */
    const lateNightEnd = convertTimeToInt("29:00");
    /** 休憩時間中の深夜時間（分） */
    const breakMinutesInLateNight = calcOverlap(
      value.breakStart,
      value.breakEnd,
      lateNightStart,
      lateNightEnd
    );
    /** 深夜時間（分） */
    const lateNightMinutes =
      calcOverlap(value.start, value.end, lateNightStart, lateNightEnd) -
      breakMinutesInLateNight;
    /** 深夜残業代（円） */
    const lateNightWage =
      (lateNightMinutes * value.hourlyWage * PREMIUM_WAGE_RATE) / 60;
    /** 合計（円） */
    const totalWage = Math.round(basicWage + overtimeWage + lateNightWage);

    element.errorMsg.textContent = "";
    setResult(
      workMinutes,
      lateNightMinutes,
      breakMinutes,
      breakMinutesInLateNight,
      basicWage,
      overtimeWage,
      lateNightWage,
      totalWage
    );
  } catch (error) {
    setResult(NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN);
    element.errorMsg.textContent = error.message;
    throw error;
  }
};
