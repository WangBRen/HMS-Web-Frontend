<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16" type="flex" justify="center">
      <a-col :order="isMobile ? 2 : 1" :md="24" :lg="16">

        <a-form-model
          ref="userForm"
          layout="vertical"
          :model="userForm"
        >
          <a-form-model-item label="昵称">
            <a-input placeholder="请输入您的昵称" v-model="userForm.nickname" />
          </a-form-model-item>
          <a-form-model-item label="个人简介">
            <a-textarea rows="4" v-model="userForm.userInfo" placeholder="请输入个人简介"/>
          </a-form-model-item>
          <a-form-model-item label="邮箱" :required="false">
            <a-input placeholder="请输入邮箱" v-model="userForm.email"/>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="editUser">更新信息</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
      <a-col :order="1" :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>
    </a-row>

    <avatar-modal ref="modal" @ok="setavatar"/>

  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { baseMixin } from '@/store/app-mixin'
import { getUserInfo as apiGetUserInfo } from '@/api/login'

export default {
  mixins: [baseMixin],
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      preview: {},
      option: {
        // img: '/avatar2.jpg',
        // img: 'https://files.hms.yootane.com/file/5a9ebe12-c3b1-4a51-ac1f-93fec6a0556d.blob',
        img: '',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      userForm: {
        nickname: '',
        userInfo: '',
        email: '',
        avatar: ''
      }
    }
  },
  methods: {
    setavatar (url) {
      console.log(url)
      this.option.img = url
      this.userForm.avatar = url
    },
    editUser () {
      console.log(this.userForm)
      // https://files.hms.yootane.com/file/21bc3976-2a17-4c55-848b-35e43e8991b8.blob
      this.getUserInfo()
    },
    getUserInfo () {
      apiGetUserInfo().then(res => {
        if (res.status === 200) {
          // console.log('登陆信息', res.data)
          this.userForm.nickname = res.data.nickname
          this.userForm.email = res.data.email
          // this.userForm.avatar = res.data.avatar
          this.userForm.avatar = 'https://files.hms.yootane.com/file/5a9ebe12-c3b1-4a51-ac1f-93fec6a0556d.blob'
          this.userForm.userInfo = res.data.userInfo
          this.option.img = 'https://files.hms.yootane.com/file/5a9ebe12-c3b1-4a51-ac1f-93fec6a0556d.blob'
        }
      })
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
