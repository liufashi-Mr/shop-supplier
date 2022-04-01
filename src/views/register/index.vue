<template>
    <div class="register">
        <div class="size">
            <p class="title">
                商家入驻
            </p>
            <form>
                <div class="phoneNum">
                    <div>
                        中国 +86
                    </div>
                    <input type="text" autocomplete="off" placeholder="请输入手机号码" class="el-input__inner">
                    <!---->
                    <!---->
                    <!---->
                    <!---->
                </div>
                <div>
                    <span class="iconfont icon-mima1 font"></span>
                    <input type="password" placeholder="请设置密码">
                </div>
                <div>
                    <span class="iconfont icon-mimaqueren font"></span>
                    <input type="password" placeholder="请再次输入密码">
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
                <div><input type="button" value="入驻"></div>
                <div>已有账号?
                    <router-link style="color: #01c2c3;font-size: 12px;" to="/login"> 立即登录</router-link>
                </div>
            </form>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: '请按住滑块，拖动到最右边',
                width: 0,
                transition: '',
                flag: false
            }
        },
        methods: {
            slideInit(e) {
                if (!this.width) {
                    this.transition = ''
                    const X = e.pageX;
                    const MAX = this.$refs.box.offsetWidth - e.target.offsetWidth
                    console.log(MAX)
                    console.log(e.target.offsetWidth);
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
                        console.log(this.width)
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
        }
    }
</script>
<style scoped>
    @import "~assets/css/login_register.css";
</style>