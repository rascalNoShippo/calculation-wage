import {
  LEGAL_WORK_MINUTES,
  ONE_DAY_MINUTES,
  PREMIUM_WAGE_RATE,
} from "./constants.js";
import { getInputValues, element, setResult } from "./elements.js";
import {
  calcOverlap,
  convertTimeToInt,
  minToHour,
  showNextDay,
} from "./utils.js";

export const handleInput = () => {
  try {
    const { hourlyWage, start, end, breakStart, breakEnd } = getInputValues();

    showNextDay(element.nextDay, end >= ONE_DAY_MINUTES);
    showNextDay(element.breakStartNextDay, breakStart >= ONE_DAY_MINUTES);
    showNextDay(element.breakEndNextDay, breakEnd >= ONE_DAY_MINUTES);

    /** 休憩時間（分） */
    const breakMinutes = (() => {
      const min = breakEnd - breakStart;
      return Number.isNaN(min) ? 0 : min;
    })();

    // 休憩時間が勤務時間に含まれているかチェック
    (() => {
      const breakMinutesInWork = calcOverlap(start, end, breakStart, breakEnd);
      const times = [start, breakStart, breakEnd, end];
      if (times.toString() !== [...times].sort((a, b) => a - b).toString())
        throw new RangeError("休憩時間が勤務時間に含まれていません");
    })();

    /** 勤務時間（分、休憩時間を除く） */
    const workMinutes = end - start - breakMinutes;

    /** 基本給（円） */
    const basicWage = hourlyWage * minToHour(workMinutes);

    /** 法定外残業代（円） */
    const overtimeWage =
      workMinutes > LEGAL_WORK_MINUTES
        ? hourlyWage *
          minToHour(workMinutes - LEGAL_WORK_MINUTES) *
          PREMIUM_WAGE_RATE
        : 0;

    /** 深夜時間帯開始時刻 */
    const lateNightStart = Number(convertTimeToInt("22:00"));

    /** 深夜時間帯終了時刻 */
    const lateNightEnd = Number(convertTimeToInt("29:00"));

    /** 休憩時間中の深夜時間（分） */
    const breakMinutesInLateNight = calcOverlap(
      breakStart,
      breakEnd,
      lateNightStart,
      lateNightEnd
    );

    /** 深夜時間（分） */
    const lateNightMinutes =
      calcOverlap(start, end, lateNightStart, lateNightEnd) -
      breakMinutesInLateNight;

    /** 深夜残業代（円） */
    const lateNightWage = minToHour(
      lateNightMinutes * hourlyWage * PREMIUM_WAGE_RATE
    );

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
    if (error instanceof Error) {
      setResult();
      element.errorMsg.textContent = error.message;
      throw error;
    }
  }
};
