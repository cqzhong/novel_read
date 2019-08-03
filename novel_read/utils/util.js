
const config = require("config.js");
const md5util = require("MD5Encode.js");

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getUpdateString (t1) {

  var t1 = new Date(t1)
  var t2 = new Date()
  var t = new Date(t2 - t1 + 16 * 3600 * 1000)

  var tmp = t.getTime() / 1000 / 3600 / 24;

  if (tmp > 365) {
    return parseInt(tmp/365) + "年前";
  } else if (tmp > 30) {
    return parseInt(tmp / 30) + "月前";
  } else if (tmp > 1) {
    return parseInt(tmp) + "天前";
  }

  if (t.getHours() > 0) {
    return t.getHours() + "小时前";
  }

  if (t.getMinutes() > 0) {
    return t.getMinutes() + "分钟前";
  }

  if (t.getSeconds() > 0) {
    return t.getSeconds() + "秒前";
  }
  
}


//模块导出
module.exports = {
  formatTime: formatTime,
  getUpdateString: getUpdateString,
}
