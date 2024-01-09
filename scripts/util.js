/**
 * HH:MM 形式の時刻を当日0時からの経過分数に変換する
 * @param {string} time - HH:MM 形式の時刻（未入力の場合はNaNを返す）
 * @returns {number}
 */
export const convertTimeToInt = (time) => {
  if (!time) return NaN;
  const [hour, minute] = time.split(":").map((s) => +s);
  return hour * 60 + minute;
};

/**
 * 分数を “H時間M分” 形式の文字列に変換する
 * @param {number} minutes - 分数（NaNの場合は空文字列を返す）
 * @returns {string}
 */
export const convertMinutesToTime = (minutes) => {
  if (Number.isNaN(minutes)) return "";
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${hour ? `${hour}時間` : ""}${minute}分`;
};

/**
 * 複数区間の重複分を計算する（いずれかの引数がNaNの場合は0を返す）
 * @param {number} beginA - 区間Aの始点
 * @param {number} endA - 区間Aの終点
 * @param {number} beginB - 区間Bの始点
 * @param {number} endB - 区間Bの終点
 * @returns {number}
 */
export const calcOverlap = (beginA, endA, beginB, endB) => {
  const begin = Math.max(beginA, beginB);
  const end = Math.min(endA, endB);
  const result = Math.max(end - begin, 0);
  return Number.isNaN(result) ? 0 : result;
};

/**
 * 数値を通貨形式の文字列に変換する
 * @param {number} value - 数値（NaNの場合は空文字列を返す）
 * @returns {string}
 */
export const toPrice = (value) =>
  Number.isNaN(value) ? "" : `${Math.round(value).toLocaleString()} 円`;

/**
 * getElementById の結果を返すが、要素が見つからない場合は例外を投げる
 * @param {string} id
 * @returns
 */
export const getElementByIdOrThrow = (id) => {
  const e = document.getElementById(id);
  if (e) return e;
  throw new Error(`id=${id} の要素が見つかりません`);
};
