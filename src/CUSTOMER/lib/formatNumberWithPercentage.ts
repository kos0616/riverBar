type typeValue = string | number | boolean | undefined;
/**
 * 根據給定的百分比格式化數字，將 false 的 0 轉為 string，避免被顯示為無訊號
 * 其餘 null undefined 皆正常回傳
 * @param n 要格式化的數字或訊號
 * @param percent 百分比
 * @returns 格式化後的數字或字串
 */
export default function formatNumberWithPercentage(n: typeValue, percent = 1) {
  if (typeof n === 'number') return formatDecimal(n / percent).toString();
  if (typeof n === 'string') return formatDecimal(Number(n) / percent).toString();
  return n;
}

/**
 * 格式化小數點後兩位數字，將 0.003 格式化為 0
 * @param n 要格式化的數字
 * @returns 格式化後的數字
 */
function formatDecimal(n: number): number {
  // 使用 parseFloat 來去掉尾隨的零
  return parseFloat(n.toFixed(2));
}
