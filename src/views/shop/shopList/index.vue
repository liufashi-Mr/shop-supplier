<template>
    <div>
        <div class="search" style="margin-top:30px">
            <h2>
                <a-icon type="search"/>
                筛选搜索
            </h2>
            <div>
                <div>输入搜索：
                    <a-input v-model="value" placeholder="Search something..." style="width: 400px" size="large"
                             @keyup.enter="searchMyShops"/>
                </div>
                <div>
                    <a-button @click="reset">重置</a-button>
                    <a-button type="primary" @click="searchMyShops">查询结果</a-button>
                </div>
            </div>
        </div>
        <div class="list" style="font-size: 20px;margin-top:30px">
            <div>
                <a-icon type="unordered-list"/>
                数据列表
            </div>
            <a-button type="primary" @click="$router.push('/shop/addShop')">添加</a-button>
        </div>
        <div class="table" style="margin-top:30px">
            <table>
                <tr style="font-weight: bolder;">
                    <td>编号</td>
                    <td>名称</td>
                    <td>图片</td>
                    <td>价格/元</td>
                    <td>优惠价/元</td>
                    <td>销量/件</td>
                    <td>操作</td>
                    <td>详情</td>
                </tr>
                <tr v-for="shop in shopList" :key="shop.id">
                    <td>{{shop.id}}</td>
                    <td>{{shop.title}}</td>
                    <td><img :src="shop.img" alt=""></td>
                    <td style="color: red">￥{{shop.price}}</td>
                    <td style="color: red">￥{{shop.special_price}}</td>

                    <td>{{shop.sale}}</td>
                    <td>
                        <a-button type="primary" @click="updateInfo(shop.id)">编辑</a-button>
                        <a-popconfirm title="确定删除,删除后不可恢复!" ok-text="确定" cancel-text="取消" @confirm="confirm(shop.id)"
                                      @cancel="cancel">
                            <a-button type="danger">删除</a-button>
                        </a-popconfirm>
                    </td>
                    <td @click="showMoreInfo(shop.id)">
                        <a-button type="primary">更多...</a-button>
                    </td>
                </tr>
            </table>
            <div id="components-pagination-demo-mini">
                <a-pagination size="small" :total="page.total" show-size-changer show-quick-jumper :pageSize="page.size"
                              :current="page.index" @change="chanPage" @showSizeChange="changePageSize"/>
            </div>
        </div>
        <div>
            <a-modal v-model="visible" title="快速修改" @ok="handleOk(shopParams[0].spu_id)">
                <div class="shopDetail">
                    <ul>
                        <li style="width: 800px" v-for="(param,index) in shopParams" :key="index">
                            <div class="left">
                                <img :src="param.imgs.small" :alt="param.param">
                            </div>
                            <div class="right">
                                <div>
                                    <div class="color">

                                        <a-input :disabled="disabled" v-model="updateParams.param[index]"></a-input>
                                    </div>
                                    <div class="restory">
                                        库存：
                                        <a-input-number :min="1" :disabled="disabled"
                                                        v-model="updateParams.stock[index]"/>
                                    </div>
                                    <div class="price">
                                        价格：
                                        <a-input-number :min="1" :disabled="disabled"
                                                        v-model="updateParams.price"/>
                                    </div>
                                </div>

                            </div>
                        </li>
                    </ul>
                    <div class="edit">
                        <a-icon key="edit" type="edit" @click="disabled=!disabled"/>
                    </div>
                </div>

            </a-modal>
        </div>
    </div>

</template>

<script>
    import {
        getTypeShop
    } from 'network/getTypeShop';
    import {
        search
    } from 'network/searchShop';
    import {
        getSkuParams
    } from 'network/getSkus';
    import {updateQuick} from 'network/updateQuick'
    import {deleteSpu} from "network/deleteShop";

    export default {
        data() {
            return {
                value: '',
                num: null,
                shopList: [],
                shopList_: [],
                page: {
                    index: 1,
                    size: 10,
                    total: 0,
                },
                shopParams: [],
                showParams: false,
                disabled: true,
                visible: false,
                updateParams: {
                    param: [],
                    price: '',
                    stock: []
                }
            }
        },
        props: {
            type: String,
        },
        methods: {
            reset() {
                this.value = '';
                this.getType();
            },

            async handleOk(spu_id) {
                let params = {};
                params.spu_id = spu_id;
                Object.keys(this.updateParams).forEach(item => {
                    params[item] = JSON.stringify(this.updateParams[item])
                })
                const res = await updateQuick(params);
                if (res.code == 200) {
                    this.$message.success('修改成功!');
                    this.visible = false
                }
            },
            async searchMyShops() {
                const res = await search({
                    keyword: this.value
                });
                if (res.code == 200) {
                    this.shopList_ = res.data;
                } else {
                    this.$message.error('未查询到结果');
                    this.shopList_ = [];
                }
                this.pageShop();
            },
            async getType() {
                const res = await getTypeShop({
                    parent_name: this.type
                })
                this.shopList_ = res.res
                this.pageShop()
            },
            pageShop() {
                let arr = [];
                this.page.total = this.shopList_.length;
                for (let i = 0; i < this.page.size; i++) {
                    let num = i + (this.page.index - 1) * this.page.size
                    num = num < this.page.total ? arr.push(this.shopList_[num]) : '';
                }
                this.shopList = arr
            },
            async showMoreInfo(spu_id) {
                const res = await getSkuParams({
                    spu_id
                });
                let arr = [];
                this.updateParams = {param: [], price: [], stock: []}
                JSON.parse(res.data[0].imgs).forEach((item, index) => {
                    let obj = {};
                    obj.spu_id = res.data[0].spu_id;
                    obj.price = res.data[0].price;
                    obj.imgs = item;
                    obj.param = JSON.parse(res.data[0].param)[index];
                    obj.stock = JSON.parse(res.data[0].stock)[index];
                    this.updateParams.param.push(obj.param);
                    this.updateParams.price = obj.price;
                    this.updateParams.stock.push(obj.stock);
                    arr.push(obj);
                })
                this.shopParams = arr;
                this.visible = true
            },
            async updateInfo(spu_id) {
                this.$router.push({
                    name: 'shopUpdate',
                    params: {
                        id: spu_id
                    }
                })
            },
            chanPage(index, size) {
                this.page.index = index;
                this.page.size = size;
                this.pageShop()
            },
            changePageSize(current, size) {
                this.chanPage(current, size)
            },
            async confirm(id) {
                const res = await deleteSpu({id});
                if(res.code==200){
                    this.$message.success('删除成功！');
                    this.getType()
                }
            },
            cancel() {
                this.$message.error('取消删除！');
            },
        },
        created() {
            this.getType();
        }
    }
</script>

<style scoped lang="less">
    .search {
        border-radius: 4px;
        border: 1px solid #ccc;
        padding: 30px;

        div {
            display: flex;
            justify-content: space-between;
            margin: 20px 40px;
            line-height: 40px;
        }

        button {
            margin-left: 30px;
        }
    }

    .list {
        display: flex;
        justify-content: space-between;
        padding: 30px;
        border-radius: 4px;
        border: 1px solid #ccc;

        button {
            margin-right: 40px;
        }
    }

    table,
    tr {
        border-collapse: collapse;
        border-spacing: 0;
        font-size: 20px;
        border: 1px solid #ccc;
        width: 100%;
        border-radius: 4px;

        td {
            border: 1px solid #ccc;
            text-align: center;
            padding: 20px 10px;
        }

        img {
            width: 80px;
        }

        button {
            margin-left: 20px;
        }
    }

    .shopDetail {


        ul {
            width: 100%;
            padding: 20px;

            li {
                display: flex;

                .right {
                    display: flex;
                    margin-left: 50px;

                    .restory,
                    .color,
                    .price {
                        height: 30px;
                        line-height: 30px;
                        margin: 8px 15px;
                        display: flex;

                        input {
                            width: 200px;
                        }
                    }

                }

                img {
                    width: 120px;
                    height: 120px;
                }

            }
        }

        .edit {
            width: 40px;
            height: 40px;
            color: #1890FF;
            line-height: 40px;
            font-size: 25px;
            position: absolute;
            right: 155px;
            bottom: 5px;
        }

    }

    #components-pagination-demo-mini {
        margin-top: 30px;

        .ant-pagination:not(:last-child) {
            margin-bottom: 24px;
        }
    }
</style>
