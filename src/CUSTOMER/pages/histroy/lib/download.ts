export default () => {
  const str = '時間,水位(㎝)\n2021/1/1 00:00:00,5\n2021/1/1 00:05:00,10\n2021/1/1 00:10:00,15';
  // const data = encodeURIComponent(str);
  // ev.href = 'data:text/csv;charset=utf-8,\ufeff' + data;
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([str], { type: 'text/csv' });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob);

  // Creating an anchor(a) tag of HTML
  const a = document.createElement('a');

  // Passing the blob downloading url
  a.setAttribute('href', url);

  // Setting the anchor tag attribute for downloading
  // and passing the download file name
  a.setAttribute('download', '趨勢圖報表.csv');

  // Performing a download with click
  a.click();
};
