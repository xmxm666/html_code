import {assetPath} from "../project-config/base";
import {randomNumber} from "../utils";
import dayjs from 'dayjs'
import {mapState} from 'vuex'

const Plugin = Object.create(null);

Plugin.install = function (Vue, options) {
  // const history = [];
  // let lastReplace = "/";
  // 3. 注入组件
  Vue.mixin({
    computed: {
      ...mapState({
        systemInfo: s => s.systemInfo
      }),
      assetPath() {
        return "https://kf.zhyos.vip"
      },
      $themeColor() {
        return "#5DB271";
      }
    },
    methods: {
      dayjs,
      getDateDiff(date1, date2) {
        return dayjs(date2).diff(dayjs(date1), "days");
      },
      //格式化每列显示内容
      formatterGenerator(flag) {
        const that = this;
        const generator = {
          amount(row, col) {
            const props = col.property.split(".");
            const val = props.reduce((p, c) => p[c] || {}, row);
            return that.toFixed(val, 2) + " 元"
          },

          text(row, col) {
            const props = col.property.split(".");
            const val = props.reduce((p, c) => p[c], row);
            return val || "暂无信息"
          },
          dateTime(row, col) {
            const props = col.property.split(".");
            const val = props.reduce((p, c) => p[c], row);
            return val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : "暂无信息"
          }, time(row, col) {
            const props = col.property.split(".");
            const val = props.reduce((p, c) => p[c], row);
            return val ? dayjs(val).format("HH:mm:ss") : "暂无信息"
          },

        };
        return generator[flag];
      },
      hasModifier(defaultClass, modifier, flag) {
        return flag ? `${defaultClass} ${defaultClass}--${modifier}` : defaultClass
      },
      randomNumber,
      getPathByAssetPath(path) {
        return `${this.assetPath}/${path}`
      },
      $replaceRoute(route) {
        // lastReplace = route;
        // this.$router.replace(route);
        this.$router.replace(route);
      },
      $popRoute() {
        // history.pop();
        // this.$router.replace(history[history.length - 1] || lastReplace);
        this.$router.go(-1);
      },
      $pushRoute(route) {
        // history.push(route);
        // this.$router.replace(route);
        this.$router.push(route);
      },
      toFixed(num, suffix = 2) {
        return +num ? (+num).toFixed(suffix) : 0;
      }
    }
  })

}
export default Plugin;
