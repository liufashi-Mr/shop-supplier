<template>
    <div class="detail">
        <div>
            <span style="color:red"> * </span>
            <span>颜色：</span>
            <div v-for="x in num" :key="x" class="color">
                <span style="color:red"> * </span>
                <a-input style="margin-left:10px" v-model="params[x-1]"></a-input>
            </div>
        </div>
        <div>
            <span style="color:red"> * </span>
            <span>上传图片：</span>
            <div class="clearfix" style="margin-top:20px">
                <a-upload action="http://localhost:3000/upload/upload" list-type="picture-card" :file-list="fileList"
                    @preview="handlePreview" @change="handleChange">
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
        <div>
            <span style="color:red"> * </span>
            <span>库存：</span>
            <div v-for="(item,index) in params" :key="item" class="stock">
                <span style="color:red"> * </span>
                <span class="stockText">{{item}} </span>
                <span>：</span>
                <a-input v-model="stock[index]"></a-input>
            </div>
        </div>
        <div>
            <div style="text-align:center">
                <a-button type="primary" @click="addShop" :disabled="disabled">提交详细信息</a-button>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        addSku
    } from 'network/addShop';
    import getBase64 from 'utils/getBase64'
    export default {
        data() {
            return {
                fileList: [],
                previewVisible: false,
                previewImage: '',
                params: [],
                imgs: [],
                stock: [],
                num: "1",
                disabled: false
            };
        },
        methods: {
            handleCancel() {
                this.previewVisible = false;
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            handleChange({
                fileList
            }) {
                this.fileList = fileList;
                this.num = this.fileList.length;
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
            },
            async addShop() {
                this.fileList.forEach(item => {
                    if (item.response) {
                        let obj = {};
                        obj.small = 'http://localhost:3000' + item.response.photoPath.replace(/\\/g,
                        '/');
                        obj.normal = 'http://localhost:3000' + item.response.photoPath.replace(/\\/g,
                            '/');
                        this.imgs.push(obj);
                    }
                })
                let obj = JSON.parse(localStorage.verify); 
                obj.param = JSON.stringify(this.params);
                obj.stock = JSON.stringify(this.stock);
                console.log(this.imgs);
                obj.imgs = JSON.stringify(this.imgs);
                console.log(obj);
                const res = await addSku(obj);
                if(res.code==200){
                    this.disabled=true
                    this.$message.success('添加成功!,块去商品列表查看吧');
                    localStorage.removeItem('verify')
                    setTimeout(()=>this.$router.replace('/shop/shopList全部'),1500)
                }
            }
        },

    }
</script>
<style scoped>
    .upload-list-inline>>>.ant-upload-list-item {
        float: left;
        width: 200px;
        margin-right: 8px;
    }

    .upload-list-inline>>>.ant-upload-animate-enter {
        animation-name: uploadAnimateInlineIn;
    }

    .upload-list-inline>>>.ant-upload-animate-leave {
        animation-name: uploadAnimateInlineOut;
    }
</style>
<style lang="less" scoped>
    .detail {
        width: 800px;
        margin: 100px auto;
        border: 1px solid #eee;
        border-radius: 10px;
        padding: 50px;

        >div {
            margin-top: 20px;
            width: 500px;

            input {
                height: 40px;
            }

            .stock,
            .color {
                padding-left: 30px;
                display: flex;
                margin-top: 15px;

                span {
                    height: 32px;
                    line-height: 32px;
                }

                .stockText {
                    width: 100px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

        }
    }
</style>