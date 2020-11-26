<template>
  <div class="st-login">
    <div class="login-bg-title">
      昌平智慧平安小区
    </div>
    <div class="bg-ball">
      <img src="./images/ball.png" />
    </div>
    <div class="loginClass">
      <div class="input-item">
        <div class="input-item-icon">
          <img src="./images/yonghu.png" />
        </div>
        <input type="text" class="reset" v-model="formDta.userName" placeholder="请输入用户名" />
      </div>
      <div class="input-item">
        <div class="input-item-icon">
          <img src="./images/mima.png" />
        </div>
        <input type="text" class="reset" v-model="formDta.password" placeholder="请输入密码" />
      </div>
      <div class="login-operation">
        <div class="save-userName">
          <i class="save-userName-icon"></i>
          <span class="save-userName-text">记住用户名</span>
        </div>
        <div class="not-password">忘记密码?</div>
      </div>
      <div class="login-btn" @click="handleLogin">登录</div>
      <!-- <div>
        <input type="text" class="reset" />
      </div> -->
    </div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      formDta: {
        userName: 'admin',
        password: '123456'
      }
    }
  },
  methods: {
    handleLogin() {
      let message = ''
      if (!this.formDta.userName) {
        message = '请输入用户名'
      } else if (!this.formDta.password) {
        message = '请输入密码'
      }
      if (message) {
        return this.$Message.error({
          background: true,
          content: message
        })
      } else {
        this.$Message.success({
          background: true,
          content: '登录成功'
        })
        sessionStorage.setItem('st-token', 'tag-token')
        this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.st-login {
  background: url('./images/bg.png');
  background-size: 100% 100%;
  .bg-ball {
    // background: url('./images/ball.png');
    // background-size: 100% 100%;
    img {
      width: 595px;
      height: 615px;
      position: relative;
      left: 274px;
      top: 240px;
      // margin-left: 274px;
      // margin-top: 240px;
    }
  }
  .login-operation {
    width: 310px;
    display: flex;
    justify-content: space-between;
    margin: auto;
    color: rgba(32, 163, 245, 1);
    font-size: 14px;
    .save-userName {
      display: flex;
      &-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 3px;
        border: 1px solid rgba(32, 163, 245, 1);
      }
      &-text {
        margin-left: 5px;
      }
    }
    .not-password {
      text-decoration: underline;
      .hover();
    }
  }
  .login-bg-title {
    // width: 694px;
    height: 43px;
    font-size: 50px;
    font-family: ShiShangZhongHeiJianTi;
    font-weight: 400;
    color: #01b5ff;
    line-height: 23px;
    text-shadow: 1px 17px 18px rgba(12, 22, 66, 0.27);
    z-index: 1;
    position: relative;
    left: 232px;
    top: 260px;
  }
  .loginClass {
    width: 479px;
    height: 390px;
    position: absolute;
    top: 353px;
    right: 389px;
    background-color: rgba(14, 47, 112, 0.66);
    padding-top: 54px;
    border-radius: 5px;
    .flex-col();
    align-items: center;
    .input-item {
      width: 327px;
      height: 55px;
      border-radius: 5px;
      border: 1px solid #149ade;
      display: flex;
      & + .input-item {
        margin-top: 23px;
      }
      > input {
        flex: 1;
        font-size: 18px;
        &::placeholder {
          color: rgba(0, 149, 255, 0.74);
        }
      }
      &-icon {
        width: 65px;
        height: 100%;
        background: #0086cb;
        .flex-center();
        > img {
          width: 26px;
        }
      }
    }
  }
  .login-btn {
    width: 367px;
    height: 80px;
    line-height: 80px;
    font-size: 22px;
    .bg-style('./images/login-btn.png');
    text-align: center;
    margin-bottom: 67px;
    letter-spacing: 0.5em;
    .hover();
  }
}
</style>
