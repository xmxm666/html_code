<template>
    <div id="Container">
       <router-view/>
    </div>

</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'

    export default {
        name: "Container",
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
    #Container {
    }
</style>
