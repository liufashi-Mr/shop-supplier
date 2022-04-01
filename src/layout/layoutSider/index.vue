<template>
    <a-layout-sider v-model="collapsed" collapsible>
        <div class="logo" />
        <a-menu theme="dark" :default-selected-keys="defaultSelectedKeys" :defaultOpenKeys="defaultOpenKeys"
            mode="inline">
            <a-menu-item key="/home" @click="$router.push('/home')">
                <a-icon type="home" />
                <span>首页</span>
            </a-menu-item>
            <a-sub-menu key="sub1">
                <span slot="title">
                    <a-icon type="shop" />
                    <span>商品</span>
                </span>
                <a-sub-menu key="sub2">
                    <span slot="title">
                        <a-icon type="" />
                        <span>商品列表</span>
                    </span>
                    <a-menu-item key="/shop/shopList全部"
                        @click="$router.push({name:'type',params:{type:'全部'}})">
                        <a-icon type="" />
                        全部
                    </a-menu-item>
                    <a-menu-item v-for="(type,index) in types" :key="'/shop/shopList'+type"
                        @click="$router.push({name:'type',params:{type:type}})">
                        <a-icon :type="typeIcon[index]" />
                        {{type}}
                    </a-menu-item>
                </a-sub-menu>
                <a-menu-item key="/shop/addShop" @click="$router.push('/shop/addShop')">
                    <a-icon type="add" />
                    <span>添加商品</span>
                </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub3">
                <span slot="title">
                    <a-icon type="database" />
                    <span>数据分析</span>
                </span>
                <a-menu-item key="/analyze/analyzePrice" @click="$router.push('/analyze/analyzePrice')">
                   <a-icon type=""/>
                    <span>种类-价格-销量</span>
                </a-menu-item>
            </a-sub-menu>
           <a-sub-menu key="sub4">
                <span slot="title">
                    <a-icon type="menu" />
                    <span>订单</span>
                </span>
                <a-menu-item key="/order/orderList" @click="$router.push('/order/orderList')">
                   <a-icon type=""/>
                    <span>订单列表</span>
                </a-menu-item>
                <a-menu-item key="/order/salesReturn" @click="$router.push('/order/salesReturn')">
                   <a-icon type="" />
                    <span>退货申请处理</span>
                </a-menu-item>
            </a-sub-menu>
            <a-menu-item key="/chat" @click="$router.push('/chat')">
               <a-icon type="message" />
                <span>消息</span>
            </a-menu-item>
        </a-menu>
    </a-layout-sider>
</template>

<script>
    import {
        getParentName
    } from 'network/getParent'
    export default {
        data() {
            return {
                types: [],
                typeIcon: ['', '', '', ''],
                collapsed: false,
                basePath: '/',
                defaultOpenKeys: this.$route.meta.module, //刷新默认展开菜单
                defaultSelectedKeys: [this.reverseCode(this.$route.path)], //刷新默认选择菜单
            };
        },
        created() {
            this.getParent();
            this.$bus.$on('siderCollapsed', () => this.collapsed = !this.collapsed)
        },
        methods: {
            async getParent() {
                const res = await getParentName();
                this.types = res.data
            }
        },
        watch: {
            collapsed() {
                this.$bus.$emit('silderCollapsed_', this.collapsed)
            },
        },

    }
</script>

<style>

</style>
