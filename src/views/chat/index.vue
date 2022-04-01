<template>
  <div class="serve">
    <div class="rList">
      <a-list item-layout="horizontal" :data-source="rList">
        <a-list-item slot="renderItem" slot-scope="item" @click="itemClick(item.toAccount,item.conversationID)">
          <a-list-item-meta :description="item.lastMessage.messageForShow">
            <a slot="title">{{ item.toAccount }}</a>
            <a-avatar slot="avatar" :src="user" />
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
    <div class="ser_text">
      <div class="contents" ref="contents" v-if="conversationID!=''">
        <div class="normal"><b>请文明聊天</b></div>
        <div v-for="(item,index) in Ulist" :class="item.to!=='user1'?'user_bar':'store_bar'" :key="index">
          <div v-if="item.to!=='user1'">
            <p :class="item.to=='user1'?'user_init':'store_init'">{{item.payload.text}}</p>
            <img :class="item.to=='user1'?'user_pic':'store_pic'" :src="item.to!=='user1'?avatar:user" />
          </div>
          <div v-else>
            <img :class="item.to=='user1'?'user_pic':'store_pic'" :src="item.to!=='user1'?avatar:user" />
            <p :class="item.to=='user1'?'user_init':'store_init'">{{item.payload.text}}</p>
          </div>

        </div>
      </div>
      <div class="master" v-else>
        <div class="center">
          <img src="" height="300px" alt="">
          <p>今天请继续加油</p>
        </div>
      </div>
      <a-textarea type="textarea" ref="textarea" class="textarea" placeholder="请尽快回复" v-model="message"
        @keyup.enter="sendMessage_init" :auto-size="{ minRows: 5, maxRows: 5 }" />
      <a-button class="send" @click="sendMessage_init">发送(S)</a-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'serve',
    components: {},
    data() {
      return {
        message: "",
        sendtext: "",
        store_news: 0,
        title: "SKR线上",
        rList: [],
        Ulist: [],
        toAccount: "",
        avatar: require("@/assets/images/avatar/store.png"),
        user: require("@/assets/images/avatar/user.jpg"),
        conversationID: "",
      };
    },
    created() {
      this.tim.on(this.TIM.EVENT.SDK_READY, this.getList);
      this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.getMessage);
      this.login_init();
    },

    methods: {
      login_init() {
        this.im_login();
      },
      onClickLeft() {
        this.$router.go(-1);
      },
      im_login() {
        let that = this;
        let promised = this.tim.login({
          userID: "user1",
          userSig: "eJwtzMEKgkAUheF3udtC7rWZqRHa6iIhxDYtDUe5TGPDaCJE756py-Md*D9wy8toNAESiCOE-bK5Nt3ADS-87k2g7ehrW3nPNSQkECVqpNP6mMlzMLNLKWNEXHVg9zdFWhy0QLVVuJ27OVepJmGPmXvIXdt2-VgO07XMnpe0GO-q5XSF1FjDxRm*PxYqMWk_",
        });
        promised
          .then(function (imResponse) {
            that.login_ = true;
          })
          .catch(function (imError) {
            console.warn("login error:", imError); // 登录失败的相关信息
          });
      },
      itemClick(toAccount, conversationID) {
        let that = this
        this.toAccount = toAccount
        this.conversationID = conversationID
        let promise = this.tim.getMessageList({
          conversationID,
          count: 15
        });
        promise.then(res => {
          that.Ulist = res.data.messageList
          this.scrollBottom()
        })
      },
      getList() {
        const that = this
        let promise = this.tim.getConversationList();
        promise.then(function (imResponse) {
          that.rList = imResponse.data.conversationList
        }).catch(function (imError) {
          console.log(imError)
        });
      },
      sedmessage() {
        let that = this;
        if (this.message == "") {
          this.$refs.textarea.$el.placeholder = "请输入内容!";
          return;
        } else {
          this.$refs.textarea.$el.placeholder = "请尽快回复";
        }
        if (this.login_) {
          // 发送文本消息，Web 端与小程序端相同
          // 1. 创建消息实例，接口返回的实例可以上屏
          let message = this.tim.createTextMessage({
            to: that.toAccount,
            conversationType: this.TIM.TYPES.CONV_C2C,
            // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
            // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
            // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
            payload: {
              text: this.message,
            },
          });
          // 2. 发送消息
          let promise = this.tim.sendMessage(message);
          // console.log(this.userPicUrl);
          promise
            .then(function (imResponse) {
              // 发送成功
              that.sendtext = imResponse.data.message.payload.text;
              that.message = "";
              let promise = that.tim.getMessageList({
                conversationID: that.conversationID,
                count: 15
              });
              promise.then(res => {
                that.Ulist = res.data.messageList
              })
            })
            .catch(function (imError) {
              // 发送失败
              console.warn("sendMessage error:", imError);
            });
        }
        this.scrollBottom()
      },
      getMessage() {
        let that = this
        let promise = that.tim.getMessageList({
          conversationID: that.conversationID,
          count: 15
        });
        promise.then(res => {
          that.Ulist = res.data.messageList
        })
        this.scrollBottom()
      },
      sendMessage_init() {
        this.sedmessage();
        this.scrollBottom()
      },
      iconClick() {
        this.$router.go(-1)
      },
      // 底部
      scrollBottom() {
        let contents = this.$refs.contents
        console.dir(contents);
        contents.scrollTo(0, contents.scrollHeight)
      }
    },
  };
</script>
<style lang="less" scoped>
  .serve {
    margin-top: 46px;
    display: flex;
    box-shadow: 1px 2px 3px #ccc;
  }

  /deep/ .ant-list-item-meta-avatar {
    img {
      margin-left: 10px;
    }
  }

  /deep/ .ant-list-item {
    cursor: pointer;
  }

  .rList {
    height: 70vh;
    width: 20vh;
    background-color: white;
  }

  .historyPage {
    background-color: #fff;
  }

  .his_head {
    display: flex;
    width: 100%;
    line-height: 49px;
    align-items: center;

    .item-wrap {
      justify-self: center;
      flex: 1;
    }

    span {
      text-align: center;
    }
  }

  .ser_text {
    position: relative;
    width: 100%;
    height: 70vh;
    overflow: auto;
    background-color: #ddd;
  }

  .ser_mask {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;

    .ser_btn {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -100%);
      width: 100px;
      height: 40px;
      font-size: 18px;
      font-weight: 600;
      background-color: #000;
      border-radius: 5px;
      color: #fff;
      box-shadow: 1px 2px 10px 1px rgb(102, 98, 98, 0.9);
      border: 0;
      box-sizing: border-box;
    }
  }

  .textarea {
    position: absolute;
    bottom: 0;
    width: calc(100% - 16px);
  }

  .send {
    position: absolute;
    right: 30px;
    bottom: 2px;
    height: 32 px;
    width: 80px;
    background-color: #eee;
  }

  /deep/ .contents {
    padding: 20px 0;
    // overflow-y: scroll;
    overflow-y: scroll;
    height: calc(100% - 115px);
  }

  /deep/.store_bar,
  /deep/.user_bar {
    display: flex;
    width: 95%;
    margin: 5px auto;
    position: relative;

    .store_pic,
    .user_pic {
      display: inline-block;
      width: 30px;
      height: 30px;
      margin: 5px;
      vertical-align: middle;
    }
  }

  /deep/.user_bar {
    justify-content: flex-end;
    // background-color: aquamarine;
  }

  // 客户
  /deep/ .store_init,
  /deep/ .user_init {
    display: inline-block;
    min-width: 50px;
    min-height: 20px;
    border: 1px solid #fff;
    background-color: #fff;
    border-radius: 10px;
    padding: 5px;
    text-indent: 10px;
    vertical-align: middle;
  }

  .normal {
    width: 200px;
    margin: 0 auto;
    background-color: #ccccccca;
    border-radius: 999px;
  }

  b {
    padding: 3px;
    font-size: 12px;
    display: block;
    font-weight: normal;
    text-align: center;
    color: white;
  }

  .van-icon-arrow-left {
    position: relative;
    left: 16px;
    top: -2px;
  }

  .master {
    background-color: white;
    height: 100%;
    position: relative;
    z-index: 1000;
    border: 1px solid #ddd;

    .center {
      width: 320px;
      height: 320px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      color: #ccc;
    }

    p {
      text-align: center;
    }
  }
</style>