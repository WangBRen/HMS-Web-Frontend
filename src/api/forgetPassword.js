import request from '@/utils/request'

const Api = {
   // 手机验证码
   UserCode: phone => { return `/forget-password/phone/${phone}/valid-code` },
   ForgetPassword: `forget-password/reset-password`
  }

  export function getCode (phone) {
    return request({
      url: Api.UserCode(phone),
      method: 'post'
    })
  }

  export function forgetPassword (values) {
    return request({
      url: Api.ForgetPassword,
      method: 'post',
      data: values
    })
  }
