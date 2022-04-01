<template>
    <div class="login">
        <div class="size">
            <p class="title">
                账户登录
            </p>
            <form>
                <div class="phoneNum">
                    <div>
                        中国 +86
                    </div>
                    <input v-model="phoneNum" type="text" autocomplete="off" placeholder="请输入手机号码"
                        class="el-input__inner">
                </div>
                <div><span class="iconfont icon-gerenzhongxin font"></span>
                    <input v-model="username" type="text" placeholder="请输入用户名">
                </div>
                <div><span class="iconfont icon-mima1 font"></span>
                    <input v-model="password" type="password" placeholder="请输入密码">
                </div>
                <div class="slide_verification" ref="box">
                    <div class="text" :style="{color:flag?'#fff':''}">{{msg}}</div>
                    <div class="grey"></div>
                    <div class="green" :style="{width:width,transition:transition}">
                    </div>
                    <div class="slide" :style="{left:width,transition:transition}"
                        @mousedown.capture="slideInit($event)">
                        <span :style="{color:flag?'#7AC23C':''}"
                            :class="flag?'iconfont icon-zhengque':'iconfont icon-shuangjiantou'"
                            style="display: block; width: 42px;height: 34px;">
                        </span>
                    </div>
                    <div class="mask" v-if="flag"></div>
                </div>
                <div><input type="button" value="登录" @click.prevent="merLogin"></div>
                <div>没有账号?
                    <router-link style="color: #01c2c3;font-size: 12px;" to="/register"> 立即注册
                    </router-link>
                </div>
            </form>
        </div>

    </div>
</template>

<script>
    import {
        userLogin
    } from 'network/login.js';
    export default {
        data() {
            return {
                msg: '请按住滑块，拖动到最右边',
                width: 0,
                transition: '',
                flag: false,
                phoneNum: '',
                password: '',
                username: ''
            }
        },
        methods: {
            slideInit(e) {
                if (!this.width) {
                    this.transition = ''
                    const X = e.pageX;
                    const MAX = this.$refs.box.offsetWidth - e.target.offsetWidth
                    document.onmousemove = (event) => {
                        let distance = event.pageX - X
                        if (distance > MAX) {
                            this.width = MAX
                        } else if (distance < 0) {
                            this.width = 0
                        } else {
                            this.width = distance + 'px'
                        }
                    }
                    document.onmouseup = () => {
                        document.onmousemove = document.onmouseup = null;
                        if (this.width >= MAX - e.target.offsetWidth) {
                            this.width = MAX + 'px';
                            this.flag = true;
                            this.msg = '验证通过!'
                        } else {
                            this.width = 0;
                            this.transition = 'all 0.5s'
                        }
                    }
                }

            },
            async merLogin() {
                if (this.flag) {
                    const res = await userLogin({
                        tel: this.phoneNum,
                        name: this.username,
                        password: this.password
                    })
                    console.log(res);
                    if (res.code == 200) {
                        this.$message.success('登陆成功!');
                        sessionStorage.setItem('merToken', res.data.token);
                        sessionStorage.setItem('storeId', res.data.storeInfo.id);
                        setTimeout(() => this.$router.replace('/home'), 1000)
                    }
                } else {
                    this.$message.error('请验证!');
                }

            }
        }
    }
</script>

<style scoped>
    @import "~assets/css/login_register.css";
</style>