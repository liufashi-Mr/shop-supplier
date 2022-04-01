<template>
    <div class="container">
        <div class="desribe">
            <ul v-if="shopList.length">
                <li v-for="item in shopList" :key="item.id">
                    <div class="sort"></div>
                    <div><img :src="item.img"></div>
                    <div>
                        <p :title="item.title"> {{item.title}} </p>
                        <p>已售: <span style="color:red;"> {{item.sale}} </span> 件</p>
                        <p>售价: <span style="color:red;"> ￥{{item.price}} </span></p>
                    </div>
                </li>
            </ul>
        </div>
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
                shopList: []
            }
        },
        async mounted() {
            const res = await getShopList({
                store_id: sessionStorage.storeId
            });
            let result = res.data.sort((a, b) => b.sale - a.sale);
            let titleData = [];
            let saleData = [];
            result.forEach((item, index) => {
                if (index <= 10) {
                    if (index <= 2) {
                        this.shopList.push(item)
                    }
                    titleData.unshift(item.title);
                    saleData.unshift(item.sale);
                }
            });
            console.log(this.shopList);
            var chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                title: {
                    text: '热销榜',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },

                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: titleData
                },
                series: [{
                    name: '热销单品',
                    type: 'bar',
                    data: saleData
                }, ]
            };

            option && myChart.setOption(option);
        },
    }
</script>

<style scoped lang='less'>
    .container {
        width: 1400px;
        margin: 0 auto;
        .desribe {
            width: 100%;

            ul {
                width:350px;
                margin: 0 auto;
                display: flex;
                flex-wrap: wrap;
                position: relative;
                li {
                    padding: 10px 5px;
                    border-radius: 4px;
                    background-color: rgba(135, 206, 250, 0.288);
                    .sort {
                        width: 40px;
                        height: 40px;
                        background: url('./images/sort1.png') center no-repeat;
                        background-size: 40px 35px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        border-radius: 50%;
                    }

                    >div {
                        margin-left: 25px;
                    }

                    display: flex;
                    position: relative;

                    img {
                        width: 100px;
                        height: 100px;
                        border-radius: 4px;
                    }

                    p {
                        overflow: hidden;
                        width: 200px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        margin-bottom: 5px;
                    }
                }
                li:nth-child(2) {
                    position: absolute;
                    top: 140px;
                    left: -190px;
                }
                li:nth-child(3) {
                    position: absolute;
                    top: 140px;
                    left: 190px;
                }

                li:nth-child(2) .sort {
                    background-image: url('./images/sort2.png');
                }

                li:nth-child(3) .sort {
                    background-image: url('./images/sort3.png');
                }
            }
        }

        #main {
            margin-top: 140px;
            width: 100%;
            height: 600px;
        }
    }
</style>