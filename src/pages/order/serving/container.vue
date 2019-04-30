<template>
    <div id="Merchant">
      <router-view/>
    </div>

</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'

    export default {
        name: "Merchant",
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
    #Merchant {
    }
</style>
