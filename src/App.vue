<template>
  <div id="app">
    <router-view />
    <Loading />
  </div>
</template>
<script>
  import Loading from "components/loading/Loading.vue";
  export default {
    name: "App",
    components: {
      Loading
    }
  }
</script>
<style lang="less">

</style>