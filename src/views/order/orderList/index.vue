<template>
    <div>
        <table>
            <tr style="font-weight: bolder;">
                <td>订单编号</td>
                <td>总价</td>
                <td>创建时间</td>
                <td>更新时间</td>
                <td>状态</td>
                <td>是否有效</td>
                <td>操作</td>
            </tr>
            <tr v-for="order in orderList" :key="order.id">
                <td>{{order.code}}</td>
                <td style="color: red">￥{{order.money}}</td>
                <td>{{order.create_time}}</td>
                <td>{{order.update_time}}</td>
                <td>
                    <a-tag color="pink">{{tags[order.status]}}</a-tag>
                </td>
                <td>
                    <a-tag v-if="order.status" color="#2db7f5">
                        是
                    </a-tag>
                    <a-tag v-if="!order.status" color="deeppink">
                        否
                    </a-tag>
                </td>
                <td>
                    <a-button type="primary" @click="getOrderDetail(order.id)">查看详情</a-button>
                    <a-button v-if="order.status==1" type="primary" @click="toeDelivery(order.id)">去发货</a-button>
                    <a-button v-if="order.status>1" type="primary" @click="orderTacking(order.id)">订单跟踪</a-button>
                </td>
            </tr>
        </table>
        <div>
            <div id="components-pagination-demo-mini">
                <a-pagination size="small"
                              :hideOnSinglePage="true"
                              :total="total"
                              :pageSize="count"
                              :current="page" @change="chanPage"/>
            </div>
        </div>

    </div>
</template>

<script>
    import {getOrder} from "network/order";
    import getFormatDate from "utils/formDate";

    export default {
        data() {
            return {
                page: 1,
                count: 10,
                total:null,
                orderList: [],
                tags: ['待支付', '待发货', '待收货', '已完成'],
            }
        },
        methods: {
            async getOrderList() {
                const res = await getOrder({
                    store_id: sessionStorage.storeId,
                    page: this.page,
                    count: this.count
                });
                if (res.code == 200) {
                    console.log(res)
                    this.total=res.data[1]
                    let arr = res.data[0];
                    arr.forEach(item => {
                        item.create_time = getFormatDate(item.create_time);
                        item.update_time = getFormatDate(item.update_time);
                    })
                    this.orderList = arr
                }
            },
            async getOrderDetail(id) {
                this.$router.push({name:'orderDetail',params:{id}})
            },
            async toeDelivery(id) {
                this.$router.push({name:'orderDelivery',params:{id}})
            },
            async orderTacking(id) {
                this.$router.push({name:'orderDelivery',params:{id}})
            },
            chanPage(pageIndex){
                this.page=pageIndex;
                this.getOrderList()
            }
        },
        created() {
            this.getOrderList()
        }
    }
</script>

<style lang="less" scoped>
    table,
    tr {
        border-collapse: collapse;
        border-spacing: 0;
        font-size: 16px;
        border: 1px solid #ccc;
        width: 100%;
        border-radius: 4px;

        td {
            border: 1px solid #ccc;
            text-align: center;
            padding: 20px 10px;
        }

        button {
            margin-left: 10px;
        }
    }
</style>
