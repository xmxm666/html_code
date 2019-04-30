import {
  computedDate,
  isNotUndefined,
  randomColor,
  randomNumber,
  splitStrBySeparator
} from "../util";
import dayjs from "dayjs";
import {mapState} from "vuex";

export const utilMixins = {
  computed: {
    ...mapState({
      platform: state => state.platform,
      assetPath: s => s.assetPath
    }),
  },
  methods: {
    randomColor, randomNumber,
    //将时间戳转换成指定格式
    formatDateByTimeStamp(timeStamp, format = "YYYY-MM-DD HH:mm:ss") {
      timeStamp = +timeStamp ? timeStamp * 1000 : Date.now();
      return dayjs(timeStamp).format(format);
    },
    //将字符串转换成日期对象
    formatDateByString(date, format = "YYYY-MM-DD") {
      return format ? dayjs(date, format) : dayjs(+date);
    },
    getMediaList(original) {
      try {
        if (isNotUndefined(original)) {
          const list = (original);
          const obj = {};
          list.forEach(({url, type}) => {
            obj[type] = obj[type] ? obj[type] : [];
            obj[type].push(`${this.assetPath}/${url}`);
          });
          return obj;
        }
      }
      catch (e) {
        return [];
      }
      return [];
    },
    splitStrBySeparator,
    computedDate
  }
};
