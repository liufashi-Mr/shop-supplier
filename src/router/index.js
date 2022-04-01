import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from "@/layout/index";
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
    {
        path: '*',
        name: '404',
        component: () => import('views/404/index'),
        meta: {
            title: "404-not found"
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('views/login/index'),
        meta: {
            title: "登录"
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('views/register/index'),
        meta: {
            title: "注册"
        }
    },
    {
        path: "/",
        name: 'layout',
        component: Layout,
        redirect: '/login',
        breadcrumbName: '/',
        children: [
            {
                path: 'home',
                name: 'home',
                breadcrumbName: 'home',
                component: () => import('views/home/index'),
                meta: {
                    title: "首页",
                    module: [],
                }
            },
            {
                path: 'shop',
                name: 'shop',
                breadcrumbName: 'shop',
                component: () => import('views/shop/index'),
                meta: {
                    title: "商品",
                    module: [],
                },
                children: [
                    {
                        path: 'shopList:type',
                        name: "type",
                        props: true,
                        component: () => import('views/shop/shopList/index'),
                        meta: {
                            title: '分类',
                            module: ['sub1', 'sub2'],
                        },
                    },
                    {
                        path: "shopUpdate:id",
                        name: 'shopUpdate',
                        props: true,
                        component: () => import('views/shop/updateShop/index'),
                        meta: {
                            title: '更新',
                            module: ['sub1', 'sub2'],
                        }
                    },
                    {
                        path: 'addShop',
                        name: 'addShop',
                        component: () => import('views/shop/addShop/index'),
                        meta: {
                            title: "添加商品",
                            module: ['sub1']
                        },
                    },
                    {
                        path: 'addDetail',
                        name: 'addDetail',
                        component: () => import('views/shop/addShopDetail/index'),
                        meta: {
                            title: "添加详情",
                            module: ['sub1']
                        },
                    }
                ]
            },
            {
                path: 'chat',
                name: 'chat',
                component: () => import('views/chat/index'),
                meta: {
                    title: '消息',
                    module: [],
                }
            },
            {
                path: 'analyze',
                name: 'analyze',
                component: () => import('views/analyze/index'),
                meta: {
                    title: '分析',
                    module: [],
                },
                children: [
                    {
                        path: 'analyzePrice',
                        name: 'analyzePrice',
                        component: () => import('views/analyze/analyzePrice/index'),
                        meta: {
                            title: '价格',
                            module: ['sub3'],
                        },
                    },
                ]
            },
            {
                path:'order',
                name:'order',
                component: () => import('views/order/index'),
                meta: {
                    title: '订单',
                    module: [],
                },
                children:[
                    {
                        path:'orderList',
                        name:'orderList',
                        component: () => import('views/order/orderList/index'),
                        meta: {
                            title: '订单列表',
                            module: ['sub4'],
                        },
                    },
                    {
                        path:'orderDetail/:order_id',
                        name:'orderDetail',
                        props: true,
                        component: () => import('views/order/orderDetail/index'),
                        meta: {
                            title: '订单详情',
                            module: ['sub4'],
                        },
                    },
                    {
                        path:'orderDelivery/:id',
                        name:'orderDelivery',
                        props: true,
                        component: () => import('views/order/orderDelivery/index'),
                        meta: {
                            title: '订单详情',
                            module: ['sub4'],
                        },
                    },
                    {
                        path:'salesReturn',
                        name:'salesReturn',
                        component: () => import('views/order/salesReturn/index'),
                        meta: {
                            title: '退货列表',
                            module: ['sub4'],
                        },
                    }
                ]
            }
        ]
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
