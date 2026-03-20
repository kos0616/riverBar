function formatNumber(value?: number | string): string | number | undefined {
  if (!value) return undefined;

  if (Number.isInteger(value)) {
    return value.toString(); // 如果是整數，直接返回
  }
  if (typeof value === 'number' && !Number.isNaN(parseFloat(value.toString()))) {
    const roundedValue = value.toFixed(1); // 保留一位小數
    // 檢查是否仍然為整數
    if (Number(roundedValue) === Math.round(value)) {
      return Math.round(value).toString(); // 如果保留一位小數後的數字為整數，返回整數部分
    }
    return roundedValue; // 否則返回保留一位小數的結果
  }
  return value; // 如果不是數字，直接返回
}

export default formatNumber;

// 示例
// console.log(formatNumber(42)); // 輸出: '42'
// console.log(formatNumber(42.123456)); // 輸出: '42.1'
// console.log(formatNumber(42.0)); // 輸出: '42'
