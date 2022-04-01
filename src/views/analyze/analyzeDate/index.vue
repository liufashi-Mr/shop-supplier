<template>
    <div class="container">
        <div id="main"></div>
    </div>
</template>

<script>
    import {
        getShopList
    } from 'network/getStoreShop';
    import * as echarts from 'echarts';

    export default {
        data() {
            return {
                shopList: [],
                price: [{
                        min: 0,
                        max: 199,
                    },
                    {
                        min: 200,
                        max: 399,
                    },
                    {
                        min: 400,
                        max: 599,
                    },
                    {
                        min: 600,
                        max: 799,
                    },
                    {
                        min: 800,
                        max: 999,
                    },
                    {
                        min: 1000,
                        max: 1199,
                    },
                    {
                        min: 1200,
                        max: 2500,
                    }
                ],
                type_: [{
                        min: 139,
                        max: 146,
                    },
                    {
                        min: 147,
                        max: 177,
                    },
                    {
                        min: 178,
                        max: 189,
                    },
                    {
                        min: 190,
                        max: 231,
                    },
                ],
                price_: ['小于200', '200~399', '400~599', '600~799', '800~999', '1000~1199', '高于1200'],
                types: ['鞋类', '服饰', '配件', '儿童'],
            }
        },
        methods: {

            formData() {
                let arr = [];
                this.type_.forEach((val, index) => {
                    let obj = {
                        name: this.types[index],
                        type: 'line',
                        smooth: true,
                        data: []
                    };
                    this.price.forEach((item) => {
                        let sale = 0;
                        this.shopList.forEach(element => {
                            if (element.category_id >= val.min && element.category_id <= val
                                .max) {
                                if (element.price >= item.min && element.price <= item
                                    .max) {
                                    sale += element.sale - 0
                                }
                            }
                        })
                        obj.data.push(sale)
                    });
                    arr.push(obj)
                })
                return arr
            }
        },
        async mounted() {
            const res = await getShopList({
                store_id: sessionStorage.storeId
            });
            this.shopList = res.data;
            console.log(this.shopList);
            var chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                title: {
                    text: 'type-price-sale'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: this.types
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.price_
                },
                yAxis: {
                    type: 'value'
                },
                series: this.formData()
            };
            option && myChart.setOption(option);
        },
    }
</script>

<style scoped lang='less'>
    .container {
        width: 1000px;
        margin: 0 auto;

        #main {
            width: 100%;
            height: 800px;
        }
    }
</style>>

</style>