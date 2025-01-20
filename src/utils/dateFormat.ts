export const dateFormat = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const newMonth = month >= 10 ? month : "0" + month;
  const newDay = day >= 10 ? day : "0" + day;
  const newHour = hour >= 10 ? hour : "0" + hour;
  const newMinute = minute >= 10 ? minute : "0" + minute;
  const newSecond = second >= 10 ? second : "0" + second;

  return date.getFullYear() + "-" + newMonth + "-" + newDay + " " + newHour + ":" + newMinute + ":" + newSecond;
};
