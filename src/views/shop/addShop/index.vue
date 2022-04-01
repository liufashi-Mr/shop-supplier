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
                <a-select :default-value="'安踏'" style="width: 200px" @change="handelSelectChange">
                    <a-select-option :value="brand.name" v-for="brand in brandList" :key="brand.name">
                        {{brand.name}}
                    </a-select-option>
                </a-select>
            </div>
            <div class="indexImg">
                <span style="color:red;"> * </span>
                <span>商品图片： </span>
                <div>
                    <div class="clearfix" style="margin-top:20px">
                        <a-upload action="http://localhost:3000/upload/upload " list-type="picture-card"
                            :file-list="fileList" :beforeUpload="beforeUpload" @preview="handlePreview"
                            @change="handleUpload">
                            <div v-if="fileList.length < 1">
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
            </div>
            <div class="info">
                <span style="text-indent:8px"> 商品价格： </span>
                <div>
                    <a-input v-model="shopInfo.price"></a-input>
                </div>
            </div>
            <div class="isSpecial">
                <span style="color:red;"> * </span>
                <span style="text-indent:8px"> 加入到优惠： </span>
                <div>
                    <a-radio-group v-model="shopInfo.is_special" :default-value="1">
                        <a-radio :value="1">
                            是
                        </a-radio>
                        <a-radio :value="0">
                            否
                        </a-radio>
                    </a-radio-group>
                </div>

            </div>
            <div class="price">
                <span style="color:red;"> * </span>
                <span>出售价格： </span>
                <div>
                    <a-input v-model="shopInfo.special_price" :disabled="shopInfo.is_special==1?false:true"></a-input>
                </div>
            </div>
            <div>
                <div style="text-align:center">
                    <a-button type="primary" @click="handleSubmit">下一步</a-button>
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
        getBrandName
    } from 'network/getBrands';
    import {
        addSpu,
    } from 'network/addShop';
    import {getShop} from 'network/getShop'
    import getBase64 from 'utils/getBase64'
    export default {
        props: ['id'],
        data() {
            return {
                options: [],
                previewVisible: false,
                previewImage: '',
                fileList: [],
                shopInfo: {
                    is_special:1,
                    brand:'安踏'
                },
                brandList: [],
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
            async getBrands() {
                const res = await getBrandName();
                res.data.forEach(item => {
                    let obj = {};
                    obj.name = item.name;
                    this.brandList.push(obj);
                })
            },
            onSelectChange(value) {
                this.shopInfo.spec = value[1]
            },
            handleCancel() {
                this.previewVisible = false;
            },
            handelSelectChange(value) {
                console.log(value)
                this.shopInfo.brand = value
            },
            async handleSubmit() {
                const verifyIndex=Date.now()
                this.shopInfo.verifyIndex=verifyIndex;
                console.log(this.shopInfo);
                const res = await addSpu(this.shopInfo);
                console.log(res)
                if(res.code!==401){
                    this.$message.success('基本信息添加成功,进入下一步')
                    console.log({verifyIndex});
                    getShop({verifyIndex}).then(res=>{
                        localStorage.verify=JSON.stringify({
                            spu_id:res.data[0].id,
                            title:res.data[0].title,
                            price:res.data[0].price,
                            special_price:res.data[0].special_price
                        });
                        this.$router.replace('/shop/addDetail')
                    })
                }else{
                    this.$message.error('基本信息有误,请认真核对')
                }
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
                if (fileList[0].response) {
                    this.shopInfo.img = 'http://localhost:3000' + fileList[0].response.photoPath.replace(/\\/g, '/');
                }
            },
            beforeUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJPG) {
                    this.$message.error('仅支持jpeg/png格式!');
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    this.$message.error('上传不能超过5MB!');
                }
                return isJPG && isLt5M;
            }
        },
        created() {
            this.getOptions();
            this.getBrands();
            this.shopInfo.store_id = sessionStorage.storeId
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

            >span {
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
        .type,
        .isSpecial,
        .indexImg {
            display: flex;

            >div {
                line-height: 52px;
                width: 400px;

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
