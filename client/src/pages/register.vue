<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Register</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user-solid"></i>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="email">
        <span class="svg-container">
          <i class="el-icon-message"></i>
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          placeholder="email"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <i class="el-icon-user"></i>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <!-- <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" /> -->
            <i class="el-icon-view"></i>
          </span>
        </el-form-item>
      </el-tooltip>
       <el-form-item prop="password">
          <span class="svg-container">
            <i class="el-icon-user"></i>
          </span>
          <el-input
            :key="passwordType"
            ref="password-repeat"
            v-model="loginForm.passwordrepeat"
            :type="passwordType"
            placeholder="confirm password"
            name="password-repeat"
            tabindex="2"
            auto-complete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handelReg"
          />
          <span class="show-pwd" @click="showPwd">
            <i class="el-icon-view"></i>
          </span>
        </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handelReg">Register</el-button>
      <p style="font-size: 14px;color: #7f8896;line-height: 40px;">Already have an account? Goto login</p>
      <el-button :loading="loading" plain style="width:100%;margin-bottom:30px;margin-left: 0px;" @click.native.prevent="toLogin">Login</el-button>
    </el-form>
  </div>
</template>

<script>
import { register } from '../api/user'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name.'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password should no less than 6 characters.'))
      } 
      var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{6,30}');
      if (!pwdRegex.test('a2b3c4d5')) {
        callback(new Error('The complexity of your password is too low (the password must contain letters and numbers). Please change your password in time.'))
      }
      callback()
    }
    return {
      loginForm: {
        username: '',
        password: '',
        passwordrepeat: '',
        email: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],//validator: validateUsername
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],//validator: validatePassword
        passwordrepeat: [{ required: true, trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handelReg() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let req = {
            name: this.loginForm.username,
            password: this.loginForm.password,
            'password-repeat': this.loginForm.passwordrepeat,
            email: this.loginForm.email,
          }
          register(req).then(res => {
            let user = res.user
            this.$message({
              message: 'register successful',
              type: 'success',
              duration: 2 * 1000
            })
            this.$router.push({
              name: 'Login'
            })   
          }).catch(err => {
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toLogin() {
      this.$router.push({
        name: 'Login'
      })  
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>
<style lang="scss">

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
    $bg:#2d3a4b;
    $dark_gray:#889aa4;
    $light_gray:#eee;

    .login-container {
      min-height: 100%;
      width: 100%;
      background-color: $bg;
      overflow: hidden;

      .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
      }
      .svg-container i{
        font-size: 16px;
      }

      .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
          &:first-of-type {
            margin-right: 16px;
          }
        }
      }

      .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
      }

      .title-container {
        position: relative;
        margin-bottom: 15px;
        .title {
          font-size: 26px;
          color: $light_gray;
          margin: 0px auto 5px auto;
          text-align: center;
          font-weight: bold;
        }
        span{
          color: #acb1b7;
        }
      }

      .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }

      .thirdparty-button {
        position: absolute;
        right: 0;
        bottom: 6px;
      }

      @media only screen and (max-width: 470px) {
        .thirdparty-button {
          display: none;
        }
      }
    }
</style>
