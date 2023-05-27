const uptime = (startTime) => {
  const Today = new Date();
  const date1 = startTime.getTime();
  const date2 = Today.getTime();
  const total = (date2 - date1) / 1000;

  const day = parseInt(total / (24 * 60 * 60)); // 計算整數天數
  const afterDay = total - day * 24 * 60 * 60; // 取得算出天數後剩餘的秒數
  const hour = parseInt(afterDay / (60 * 60)); // 計算整數小時數
  const afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60; // 取得算出小時數後剩餘的秒數
  const min = parseInt(afterHour / 60); // 計算整數分
  const afterMin = Math.round(total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60); // 取得算出分後剩餘的秒數
  console.log(`Uptime: ${day} / ${hour} : ${min} : ${afterMin}`);

  if (day >= 1) return `${day} Day(s) ${hour}Hour(s)`/* + min + 'Minute(s)' + afterMin */;
  return /* day + ' Days' +*/ `${hour}Hour(s) ${min}Minute(s)`;
};

module.exports.uptime = uptime;
