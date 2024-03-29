/** @typedef {import("./constants").ElementId} ElementId */
/** @typedef {import("./constants").ElementTypeMap} ElementTypeMap */

/**
 * HH:MM 形式の時刻を当日0時からの経過分数に変換する
 * @param {string} time - HH:MM 形式の時刻（未入力の場合はNaNを返す）
 * @returns {number | undefined}
 * @throws {SyntaxError} 時刻の形式が不正な場合
 */
export const convertTimeToInt = (time) => {
  if (!time) return;
  if (!/^\d{1,2}:\d{2}$/.test(time))
    throw new SyntaxError("時刻の形式が不正です");
  const [hour, minute] = time.split(":").map((s) => +s);
  return hour * 60 + minute;
};

/**
 * 分数を “H時間M分” 形式の文字列に変換する
 * @param {number | undefined} minutes - 分数（NaNの場合は空文字列を返す）
 * @returns {string}
 */
export const convertMinutesToTime = (minutes) => {
  if (minutes === undefined) return "";
  const hour = Math.trunc(minutes / 60);
  const minute = minutes % 60;
  return `${hour ? `${hour}時間` : ""}${minute}分`;
};

/**
 * 複数区間の重複分を計算する
 * @param {number} beginA - 区間Aの始点
 * @param {number} endA - 区間Aの終点
 * @param {number} beginB - 区間Bの始点
 * @param {number} endB - 区間Bの終点
 * @returns {number}
 */
export const calcOverlap = (beginA, endA, beginB, endB) => {
  const begin = Math.max(beginA, beginB);
  const end = Math.min(endA, endB);
  return Math.max(end - begin, 0);
};

/**
 * 数値を通貨形式の文字列に変換する
 * @param {number | undefined} value - 数値（undefined の場合は空文字列を返す）
 * @returns {string}
 */
export const toPrice = (value) =>
  value === undefined ? "" : `${Math.round(value).toLocaleString()} 円`;

/**
 * getElementById の結果を返すが、要素が見つからない場合は例外を投げる
 * @template {ElementId} T
 * @param {T} id - 要素のID
 * @returns {ElementTypeMap[T]}
 * @throws {Error} 要素が見つからない場合
 */
export const getElementByIdOrThrow = (id) => {
  const e = document.getElementById(id);
  if (e) return /** @type {ElementTypeMap[T]} */ (e);

  const message = `id=${id} の要素が見つかりません`;
  alert(message);
  throw new Error(message);
};

/**
 * “(翌日)” を表示する
 * @param {HTMLElement} element - 表示する要素
 * @param {boolean} isNextDay - 翌日かどうか
 */
export const showNextDay = (element, isNextDay) => {
  element.textContent = isNextDay ? "(翌日)" : "";
};

/**
 * 分を時間に変換する(60で割る)
 * @param {number} min - 分
 * @returns {number}
 */
export const minToHour = (min) => min / 60;

/**
 * 割り算のあまり（常に非負の値を返す）
 * @param {number} dividend - 被除数
 * @param {number} divisor - 除数
 * @returns {number}
 * @example
 * console.log(mod(5, 3), 5 % 3); // 2 2
 * console.log(mod(-5, 3), -5 % 3); // 1 -2
 */
export const mod = (dividend, divisor) =>
  ((dividend % divisor) + divisor) % divisor;
