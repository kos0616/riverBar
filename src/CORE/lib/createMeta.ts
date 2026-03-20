/** 建立 meta 標籤 */
export default (httpEquiv: string, content = '') => {
  const meta = document.createElement('meta');
  meta.httpEquiv = httpEquiv;
  meta.content = content;
  document.getElementsByTagName('head')[0].prepend(meta);
};
