<template>
    <a-layout>
        <layoutHead />
        <a-layout-content style="margin: 0 16px">
            <div :style="{ padding: '24px',margin:0, background: '#fff', height: '93vh',overflow:'auto'}">
                <transition name="fade-transform" mode="out-in">
                    <router-view :key="key" />
                </transition>
            </div>
        </a-layout-content>
    </a-layout>
</template>

<script>
    import layoutHead from "@/layout/layoutHead/index";

    export default {
        components: {
            layoutHead
        },
        computed: {
            key() {
                return this.$route.path
            }
        }
    }
</script>

<style>

</style>