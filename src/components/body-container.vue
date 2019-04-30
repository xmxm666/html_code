<template>
  <div id="BodyContainer" :style="{backgroundColor:color}">
    <slot/>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "BodyContainer",
    props: {
      color: {
        type: String,
        default: "#fff"
      }
    },
    data() {
      return {}
    },
    methods: {},
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  $nav-bar-height: 60px;

  #BodyContainer {
    padding: 24px 45px;
    box-sizing: border-box;
    min-height: calc(100vh - #{$nav-bar-height});
  }
</style>
