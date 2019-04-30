import {assetPath} from "../project-config/base";
import _ from 'lodash'
import dayjs from 'dayjs'
import {city} from '../lib/city'

export function randomNumber(codeLength = 10) {
  var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);//随机数
  var code = "";
  for (var i = 0; i < codeLength; i++) {//循环操作
    var index = Math.floor(Math.random() * 10);//取得随机数的索引（0~35）
    code += random[index];//根据索引取得随机数加到code上
  }
  return +code;
}

export function randomColor() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
}

function isNotUndefined(obj) {
  return typeof obj !== "undefined"
}

export function generateMutation(key) {
  return (state, data) => state[key] = data;
}

export function splitStrBySeparator(str) {
  if (isNotUndefined(str)) {
    //如果不是逗号分割
    const arr = str.split(",");
    if (arr.length === 1) {
      return str.split(" ").filter(item => item);
    } else {
      return str.split(",").filter(item => item);
    }

  }
  return [];
}

//截取时间
export function splitTime(str,type){
  if(isNotUndefined(str)){
    str=str+''
    const year = str.split('.')[0].split('T')[0];
    const time = str.split('.')[0].split('T')[1];
    if(type==='y-m-d'){
      return year;
    }else {
      return year+' '+time;
    }
  }
  return [];
}

export function getMediaList(original) {
  try {
    if (isNotUndefined(original)) {
      const list = (original);
      const obj = {};
      list.forEach(({url, type}) => {
        obj[type] = obj[type] ? obj[type] : [];
        obj[type].push(getImgByAssetPath(url));
      });
      return obj;
    }
  }
  catch (e) {
    return [];
  }
  return [];
}

export function keyLenByObj(obj) {
  if (isNotUndefined(obj)) {
    return !!Object.keys(obj).length;
  }
  return false;
}

export function getImgByAssetPath(url) {
  return `${"asd"}/${url}`;
}

export function getUrlParams(url) {
  const params = url.split("?")[1];
  const reg = /&?([^&]+)/g;
  let res = null;
  const map = Object.create(null);
  while (res = reg.exec(params)) {
    const paramEntry = res[1].split("=");
    map[paramEntry[0]] = paramEntry[1];
  }
  return map;
}

//筛选参数，将null剔除
export function excludeEmpty(obj) {
  const newObj = Object.create(null);
  for (let key in obj) {
    if (!_.isEmpty(obj[key]) || _.isInteger(obj[key])) {

      if (_.isPlainObject(obj[key])) {
        const res = excludeEmpty(obj[key]);
        if (res) {
          newObj[key] = res
        }
      } else {
        newObj[key] = obj[key]
      }

    }
  }
  return newObj;
}

export function validFormNotEmpty(obj) {
  for (let key in obj) {
    if (_.isEmpty(obj[key])) {
      return false
    }
  }
  return true;
}


export function getCityByProvinceId(provinceId, cityId) {
  if (city[provinceId].length === 1) {
    return city[provinceId][0].province
  }
  return (_.find(city[provinceId], {
    id: cityId
  }) || {}).name
}

// 计算当前时间是多少天前
export function computedDate(timestamp) {
  // 补全为13位
  var arrTimestamp = (timestamp + '').split('');
  for (var start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = '0';
    }
  }
  timestamp = arrTimestamp.join('') * 1;

  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - timestamp;
  // 如果本地时间反而小于变量时间
  if (diffValue < 0) {
    return '不久前';
  }

  // 计算差异时间的量级
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;

  // 数值补0方法
  var zero = function (value) {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  };

  // 使用
  if (monthC > 12) {
    // 超过1年，直接显示年月日
    return (function () {
      var date = new Date(timestamp);
      return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
    })();
  } else if (monthC >= 1) {
    return parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    return parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    return parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    return parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    return parseInt(minC) + "分钟前";
  }
  return '刚刚';
}

export function base64decode(str) {
  return decodeURIComponent(atob(str).split("").map(function (c) {
    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));

}
//格式化UTC时间
export function convertUTCTimeToLocalTime(UTCDateString,type) {
    if(!UTCDateString){
      return UTCDateString;
    }
    function formatFunc(str) {    //格式化显示
      return str > 9 ? str : '0' + str
    }
    let date2 = new Date(UTCDateString);     //这步是关键
  let year = date2.getFullYear();
  let mon = formatFunc(date2.getMonth() + 1);
  let day = formatFunc(date2.getDate());
  let hour = date2.getHours();
  let noon = hour >= 12 ? 'PM' : 'AM';
    hour = hour>=12?hour-12:hour;
    hour = formatFunc(hour);
  let min = formatFunc(date2.getMinutes());
  if(type==='y-m-d'){
    let dateStr = year+'-'+mon+'-'+day;
    return dateStr;

  }else {
    let dateStr = year+'-'+mon+'-'+day+' '+noon +' '+hour+':'+min;
    return dateStr;
  }
  }
  export function getWeek(type) {
    switch(type){
      case '1':
      return '星期一';
      case '2':
      return '星期二';
      case '3':
      return '星期三';
      case '4':
      return '星期四';
      case '5':
      return '星期五';
      case '6':
      return '星期六';
      case '7':
      return '星期天';
    }
  }
  export function getTowWeek(type) {
    switch(type){
      case 11:
      return '星期一';
      case 22:
      return '星期二';
      case 33:
      return '星期三';
      case 44:
      return '星期四';
      case 55:
      return '星期五';
      case 66:
      return '星期六';
      case 77:
      return '星期天';
    }
  }
  export function getTrue(value,msg){
      if(value){
        return value
      }else{
        return msg
      }
  }