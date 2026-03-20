type option = {
  activeClass?: string;
  inActiveClass?: string;
};

/**
 * showAlert 依據布林值顯示燈號
 * 有可能遇到非布林值的情況，此時只回傳 false
 */
export default (v?: string | boolean | number, option?: option) => {
  if (typeof v === 'boolean' && v === true) {
    return option?.activeClass || 'bg-customer-red';
  }
  return option?.inActiveClass || 'bg-customer-green';
};
