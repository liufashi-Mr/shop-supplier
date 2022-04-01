<template>
    <a-layout-header  style="background: #F0F2F5; padding: 0;margin:0 16px">
        <a-breadcrumb style="margin: 16px 0">
            <a-icon class="trigger" :type="flag ? 'menu-unfold' : 'menu-fold'"
                @click="() => $bus.$emit('siderCollapsed')" />
            <template slot="itemRender" slot-scope="{ route,routes,paths }">
                <span v-if="routes.indexOf(route) === routes.length - 1">
                    {{ route.meta.title }}
                </span>
                <router-link v-else :to="`${basePath}/${paths.join('/')}`">
                    {{ route.meta.title}}
                </router-link>
            </template>
            {{ $route.meta.title}}
        </a-breadcrumb>
    </a-layout-header>
</template>

<script>
    export default {
        data() {
            return {
                basePath: '/',
                flag:'',
            };
        },
        created() {
            this.$bus.$on('silderCollapsed_',(flag)=>this.flag=flag)
        },
    }
</script>

<style>

</style>