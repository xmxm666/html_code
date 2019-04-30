<template>
    <div id="home">
        <router-view></router-view>
    </div>

</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'

    export default {
        name: "home",
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
    #home {
    }
</style>
