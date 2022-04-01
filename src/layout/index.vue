<template>
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
        <layoutSider/>
        <layoutContent/>
    </a-layout>
</template>
<script>
    import layoutContent from "@/layout/layoutContent/index";
    import layoutSider from "@/layout/layoutSider/index";
    export default {
        components:{layoutContent,layoutSider},
        
        created() {

        },
    };
</script>

<style>
    #components-layout-demo-side .logo {
        height: 60px;
        background: url('~assets/images/logo/log1.png') center no-repeat;
        margin: 16px;
    }
</style>