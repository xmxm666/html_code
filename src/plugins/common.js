import {randomNumber} from "../util";
import {mapState} from 'vuex'
import backendPath from "../project-config/base"
import {getEntryPath} from "./get-entry-path";

const Plugin = Object.create(null);

Plugin.install = function (Vue, options) {
  // const history = [];
  // let lastReplace = "/";
  // 3. 注入组件
  Vue.mixin({
    computed: {
      ...mapState({
        platform: state => state.platform,
        assetPath: s => s.assetPath
      }),
      $themeColor() {
        return this.platform.color;
      },
      $routeHistory() {
        return history;
      }
    },
    methods: {
      hasModifier(defaultClass, modifier, flag) {
        return flag ? `${defaultClass} ${defaultClass}--${modifier}` : defaultClass
      },
      randomNumber,
      getPathByAssetPath(path) {
      
       return `${this.assetPath}${path}`
      },
      getTestPathByAssetPath(path) {
        return `${this.backendPath}${path}`
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
        if (!route) {
          return;
        }
        this.$router.push(route);
      },
      getEntryPath
    },
    created() {
    }
  })

}
export default Plugin;
