<template>
    <div>
        <form class="base">
            <div class="type">
                <span style="color:red;"> * </span>
                <span>商品分类： </span>
                <a-cascader :options="options" placeholder="请选择" @change="onSelectChange" style="width:200px;" />

            </div>
            <div class="title">
                <span>
                    <span style="color:red;"> * </span>
                    <span>商品名称： </span>
                </span>
                <div>
                    <a-input v-model="shopInfo.title"></a-input>
                </div>
            </div>
            <div class="brand">
                <span style="color:red;"> * </span>
                <span>商品品牌： </span>
                <a-select :default-value="1" style="width: 200px">
                    <a-select-option :value="brand.id" v-for="brand in brandList" :key="brand.id">
                        {{brand.name}}
                    </a-select-option>
                </a-select>
            </div>
            <div class="indexImg">
                <span style="color:red;"> * </span>
                <span>商品图片： </span>
                <div class="clearfix" style="margin-top:20px">
                    <a-upload action="http://localhost:3000/upload/upload " list-type="picture-card"
                        :file-list="fileList" :beforeUpload="beforeUpload" @preview="handlePreview"
                        @change="handleUpload" >
                        <div v-if="fileList.length < 8">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">
                                Upload
                            </div>
                        </div>
                    </a-upload>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                </div>
            </div>
            <div class="info">
                <span style="text-indent:8px" > 商品价格： </span>
                <div>
                    <a-input :value="shopInfo.price"></a-input>
                </div>
            </div>
            <div class="price">
                <span style="color:red;"> * </span>
                <span>出售价格： </span>
                <div>
                    <a-input :value="shopInfo.special_price"></a-input>
                </div>
            </div>
            <div>
                <div style="text-align:center">
                    <a-button type="primary" @click="handleSubmit">提交基本信息</a-button>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
    import {
        getParentName
    } from 'network/getParent';
    import {
        getChildrenName
    } from 'network/getChildren';
    import {
        getShop
    } from 'network/getShop';
    import {
        getBrandName
    } from 'network/getBrands';
    import getBase64 from 'utils/getBase64'
    export default {
        props: ['id'],
        data() {
            return {
                options: [],
                previewVisible: false,
                previewImage: '',
                fileList: [],
                shopInfo: {},
                title: '',
                brandList: [],
                brand:'',
            }
        },
        methods: {
            async getOptions() {
                const parentList = await getParentName();
                parentList.data.forEach(element => {
                    let obj = {};
                    obj.value = element;
                    obj.label = element;
                    obj.children = [];
                    getChildrenName({
                        parent_name: element
                    }).then(res => {
                        res.data.forEach(item => {
                            let childObj = {};
                            childObj.value = item;
                            childObj.label = item;
                            obj.children.push(childObj)
                        })
                        this.options.push(obj);
                    })
                });
            },
            async getShopInfo() {
                console.log(this.id);
                const res = await getShop({
                    id: this.id
                })
                this.fileList.push({
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: res.data[0].img
                });
                console.log(res.data[0]);
                this.shopInfo = res.data[0]
            },
            async getBrands() {
                const res = await getBrandName();
                res.data.forEach(item => {
                    let obj = {};
                    obj.name= item.name;
                    obj.id= item.id;
                    this.brandList.push(obj);
                })
            },
            onSelectChange(value) {
               console.log(value);
            },
            handleCancel() {
                this.previewVisible = false;
            },
            handleSubmit(){
                this.$message.error('暂时无法修改! , 可以在商品列表中调整价格和库存')
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            handleUpload({
                fileList
            }) {
                this.fileList = fileList;
            },

            beforeUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJPG) {
                    this.$message.error('仅支持jpeg/png格式!');
                }
                const isLt2M = file.size / 1024 / 1024 < 5;
                if (!isLt2M) {
                    this.$message.error('上传不能超过5MB!');
                }
                return isJPG && isLt2M;
            }
        },
        created() {
            this.getOptions();
            this.getShopInfo();
            this.getBrands()
        },
    }
</script>
<style lang="less" scoped>
    .base {
        width: 800px;
        margin: 0 auto;
        border: 1px #ccc solid;
        border: 1px solid #EBEEF5;
        padding: 50px;

        >div {
            margin-top: 30px;
            >span{
                line-height: 52px;
            }
        }

        span {
            font-weight: bold;
            line-height: 1;
        }



        .title,
        .price,
        .info,
        .type {
            display: flex;

       

            div {
                line-height: 52px;
                width: 500px;

                input,
                textarea {
                    height: 36px;
                }
            }
        }

    }

    .ant-cascader-menu {
        height: 140px !important;
    }

    /* you can make up upload button and sample style by using stylesheets */
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>