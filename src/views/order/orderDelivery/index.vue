<template>
    <div>
        <table>
            <tr>
                <td>订单编号</td>
                <td>收货人</td>
                <td>手机号码</td>
                <td>收货地址</td>
                <td>配送方式</td>
                <td>物流单号</td>
            </tr>
            <tr>
                <td>{{id}}</td>
                <td>{{deliveryInfo.name}}</td>
                <td>{{deliveryInfo.tel}}</td>
                <td>{{deliveryInfo.address}}</td>
                <td>
                    <a-input v-model="ecp"></a-input>
                </td>
                <td>
                    <a-input v-model="postid"></a-input>
                </td>
            </tr>
        </table>
        <div class="submit">
            <a-button @click="cancel">取消</a-button>
            <a-button type="primary" @click="delivery">确定</a-button>
        </div>
    </div>
</template>

<script>
    import {getOrderDetail, addDelivery, updateOrder} from "network/order";

    export default {
        props: ['id'],
        data() {
            return {
                deliveryInfo: {},
                ecp: '',
                postid: ''
            }
        },
        methods: {
            async orderDetail() {
                const res = await getOrderDetail({order_id: this.id});
                if (res.code == 200) {
                    this.deliveryInfo = res.data;
                    console.log(this.deliveryInfo)
                }
            },
            async delivery() {
                const res = await addDelivery({
                    postid: this.postid,
                    ecp: this.ecp,
                    address: this.deliveryInfo.address,
                    order_id: this.id,
                })
                if (res.code == 200) {
                    this.updateStatus()
                }
            },
            async updateStatus() {
                await updateOrder({id: this.id, status: 2});
                this.$message.success('发货成功!');
                setTimeout(() => {
                    this.$router.push('/order/orderList');
                })
            },
            cancel(){
                this.$message.success('取消成功!');
                setTimeout(() => {
                    this.$router.push('/order/orderList');
                })
            }
        },
        created() {
            this.orderDetail()
        }
    }
</script>

<style lang="less" scoped>
    table, tr {
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

    .submit {
        text-align: center;

        button {
            margin: 20px 10px;
        }
    }
</style>
