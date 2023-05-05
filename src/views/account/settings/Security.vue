<template>
  <a-list itemLayout="horizontal">
    <a-list-item>
      <a-list-item-meta>
        <a slot="title">账号密码</a>
        <span slot="description">
          <span class="security-list-description">当前密码强度</span>
          <span> : </span>
          <span class="security-list-value">强</span>
          <a @click="changePassword"> 更改</a>
        </span>
        <div v-if="passwordIndex" slot="description">
          <a-form-model
            ref="passwordForm"
            :model="passwordForm"
            :rules="passwordRules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-model-item label="旧密码" prop="oldPassword">
              <a-input-password v-model="passwordForm.oldPassword"/>
            </a-form-model-item>
            <a-form-model-item label="新密码" prop="newFirstPassword">
              <a-input-password v-model="passwordForm.newFirstPassword"/>
            </a-form-model-item>
            <a-form-model-item label="再次输入新密码" prop="newSecondPassword">
              <a-input-password v-model="passwordForm.newSecondPassword"/>
            </a-form-model-item>
            <a-button style="margin-left: 22%" @click="okPassword">确定</a-button>
            <a-button style="margin-left: 2%" @click="resetPassword">重置</a-button>
          </a-form-model>
        </div>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <a slot="title">密保手机</a>
        <span slot="description">
          <span class="security-list-description">已绑定手机</span>
          <span> : </span>
          <span class="security-list-value">{{ userInfo.telephone || '---' }}</span>
          <a @click="changeTelephone"> 更改</a>
        </span>
        <div v-if="telephoneIndex" slot="description">
          <div>绑定手机号：<a-input style="width: 22%;" v-model="telephone" placeholder="输入手机号" /></div>
          <div style="margin-left: 28px;">
            <span style="width: 10%;">验证码：</span><a-input v-model="telephoneCode" style="width: 10%;"></a-input>
            <a-button :disabled="!telephone" v-if="codeIndex" @click="getCode" style="line-height: 29px;">获取验证码</a-button>
            <a-button :disabled="!codeIndex" v-if="!codeIndex" style="line-height: 29px;" @click="getCode">{{ count }}秒后重试</a-button>
          </div>
          <div style="margin-left: 85px;">
            <a-button :disabled="!(telephone!=='' && telephoneCode!=='')" type="primary" @click="okTelephone">确定修改手机号</a-button>
          </div>
        </div>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>

<script>
import { getUserInfo as apiGetUserInfo, editUserPassword as apiEditUserPassword } from '@/api/login'
// import { getUserInfo as apiGetUserInfo } from '@/api/login'
// import { getCode as apiGetCode } from '@/api/customer'

export default {
  data () {
    return {
      userInfo: {},
      telephoneIndex: false,
      telephone: '', // 新手机号
      telephoneCode: '', // 验证码
      token: '', // 验证码返回
      codeIndex: true,
      count: '', // 秒数提示
      timer: null,
      // 表单样式
      labelCol: { span: 5 },
      wrapperCol: { span: 8 },
      passwordIndex: false,
      passwordForm: {
        oldPassword: '',
        newFirstPassword: '',
        newSecondPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 8, message: '密码长度至少8位', trigger: 'blur' },
          { max: 16, message: '密码长度最高16位', trigger: 'blur' },
          { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, message: '密码需包含大写字母,小写字母和数字' }
        ],
        newFirstPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 8, message: '密码长度至少8位', trigger: 'blur' },
          { max: 16, message: '密码长度最高16位', trigger: 'blur' },
          { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, message: '密码需包含大写字母,小写字母和数字' }
        ],
        newSecondPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { min: 8, message: '密码长度至少8位', trigger: 'blur' },
          { max: 16, message: '密码长度最高16位', trigger: 'blur' },
          { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, message: '密码需包含大写字母,小写字母和数字' }
        ]
      }
    }
  },
  methods: {
    getUserInfo () {
      apiGetUserInfo().then(res => {
        if (res.status === 200) {
          console.log('登陆信息', res.data)
          this.userInfo = res.data
        }
      })
    },
    changeTelephone () {
      this.telephone = ''
      this.telephoneCode = ''
      this.token = ''
      this.telephoneIndex = !this.telephoneIndex
    },
    getCode () {
      var Reg = /^[1][34578][0-9]{9}$/
      console.log('新', this.telephone, '旧', this.userInfo.telephone)
      if (Reg.test(this.telephone)) {
        if (this.telephone !== this.userInfo.telephone) {
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.codeIndex = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.codeIndex = true
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
          this.token = 'aonkna1312xz'
        } else {
          this.$message.info('输入的手机号与旧手机号相同，请更换')
        }
        // apiGetCode(this.telephone).then(res => {
        //   if (res.status === 200) {
        //     this.$message.success(res.message || '验证码发送成功')
        //     this.token = res.data.token
        //   }
        // })
      } else {
        this.$message.info('输入的手机号格式不正确')
      }
    },
    changePassword () {
      // this.$refs.passwordForm.resetFields()
      if (this.passwordIndex === true) {
        this.$refs.passwordForm.resetFields()
      }
      this.passwordIndex = !this.passwordIndex
    },
    okPassword () {
      // console.log(this.passwordForm)
      // this.$refs.passwordForm.resetFields()
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          if (this.passwordForm.newFirstPassword === this.passwordForm.newSecondPassword) {
            const apiData = {
              oldPassword: this.passwordForm.oldPassword,
              newPassword: this.passwordForm.newSecondPassword
            }
            // console.log('密码相同,可改', apiData)
            apiEditUserPassword(apiData).then(res => {
              if (res.status === 200) {
                // console.log('密码修改成功')
                this.$message.info('修改成功，正在退出登录')
                setTimeout(() => {
                  return this.$store.dispatch('Logout').then(() => {
                    this.$router.push({ name: 'login' })
                  })
                }, 2000)
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            this.$message.error('两次输入的密码不同，请修改')
          }
        }
      })
    },
    resetPassword () {
      this.$refs.passwordForm.resetFields()
    },
    okTelephone () {
      console.log(this.telephone, this.token, this.telephoneCode)
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style scoped>
/* .ant-form-item {
  margin-bottom: 0px;
} */
</style>
