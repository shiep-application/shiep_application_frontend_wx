function  getDaysBetween(startTime,endTime){undefined
  //转化日期为时间戳，ios与Android兼容写法
  var  startDate = Date.parse(startTime);
  var  endDate = Date.parse(endTime);
  var days=(endDate - startDate)/(1*24*60*60*1000);
  var month=days/30;
  var monthDay=days%30;
  var week=days/7;
  var weekDay=days%7;
  return days+"天";//两个时间间隔的天数
  //return Math.round(parseInt(week))+' 周 '+weekDay+' 天';//两个时间间隔了几周
  //return Math.round(parseInt(month))+' 月 '+monthDay+' 天';//两个时间间隔了几个月
}