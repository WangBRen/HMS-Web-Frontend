import request from '@/utils/request'

const userApi = {
  Login: '/login',
  Logout: '/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/users/me/detail',
  UserMenu: '/user/nav',
  // 手机验证码
  UserCode: phone => { return `/mailbox/phone/${phone}/valid-code` },
  // 修改用户信息
  UserMsg: '/users/me/initial'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}

// 手机验证码
export function getuserCode (phone) {
  // console.log('11', userApi.UserCode)
  return request({
    url: userApi.UserCode(phone),
    // url: '/api/mailbox/phone/15678596260/valid-code',
    method: 'post'
  })
}

// 修改用户信息
export function UserMsg (parameter) {
  return request({
    url: userApi.UserMsg,
    method: 'post',
    data: parameter
  })
}
