<template>
    <div id="Manage">
      <router-view/>
    </div>

</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'

    export default {
        name: "manage",
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
    #Manage {
    }
</style>
