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
} from "./util.js";

export const handleInput = () => {
  const { hourlyWage, start, end, breakStart, breakEnd } = getInputValues();

  try {
    if (hourlyWage <= 0) throw new SyntaxError("時給が未入力です");
    if (Number.isNaN(start)) throw new SyntaxError("始業時刻が未入力です");
    if (Number.isNaN(end)) throw new SyntaxError("終業時刻が未入力です");
    if (Number.isNaN(breakStart) !== Number.isNaN(breakEnd))
      throw new SyntaxError(
        "休憩時間は両方とも入力するか両方とも未入力にしてください"
      );

    showNextDay(element.nextDay, end >= ONE_DAY_MINUTES);
    showNextDay(element.breakStartNextDay, breakStart >= ONE_DAY_MINUTES);
    showNextDay(element.breakEndNextDay, breakEnd >= ONE_DAY_MINUTES);

    /** 休憩時間（分） */
    const breakMinutes = (() => {
      const min = breakEnd - breakStart;
      return Number.isNaN(min) ? 0 : min;
    })();
    /** 勤務時間（分、休憩時間を除く） */
    const workMinutes = end - start - breakMinutes;

    (() => {
      const breakMinutesInWork = calcOverlap(start, end, breakStart, breakEnd);
      if (Number.isNaN(breakMinutesInWork)) return;
      if (breakMinutesInWork !== breakMinutes)
        throw new RangeError("休憩時間が勤務時間に含まれていません");
    })();

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
    const lateNightStart = convertTimeToInt("22:00");
    /** 深夜時間帯終了時刻 */
    const lateNightEnd = convertTimeToInt("29:00");
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
