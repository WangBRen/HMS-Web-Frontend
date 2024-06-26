import request from '@/utils/request'

const userApi = {
  Login: '/login',
  phoneLogin: '/login/byPhone',
  Logout: '/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/users/me/detail',
  UserMenu: '/user/nav',
  // 手机验证码(需输入手机号)
  UserCode: phone => { return `/mailbox/phone/${phone}/valid-code` },
  // 创建用户信息
  UserMsg: '/users/me/initial',
  editUserMsg: '/users/me',
  getUserInfo: '/users/me', // 获取当前登录用户基础信息
  editUserPassword: '/users/me/password', // 修改登录密码
  editUserPhone: '/forget-password/reset-phone',
  // 更改绑定手机号发送验证码
  getUserPhoneCode: phone => `/forget-password/phone/${phone}/valid-code`
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

export function phoneLogin (parameter) {
  return request({
    url: userApi.phoneLogin,
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
export function getCode (phone) {
  // console.log('11', userApi.UserCode)
  return request({
    url: userApi.UserCode(phone),
    method: 'post'
  })
}

// 创建用户信息
export function UserMsg (parameter) {
  return request({
    url: userApi.UserMsg,
    method: 'post',
    data: parameter
  })
}
export function getUserInfo () {
  return request({
    url: userApi.getUserInfo,
    method: 'get'
  })
}

// 编辑用户信息
export function editUserMsg (parameter) {
  return request({
    url: userApi.editUserMsg,
    method: 'put',
    data: parameter
  })
}

// 修改登录密码
export function editUserPassword (parameter) {
  return request({
    url: userApi.editUserPassword,
    method: 'put',
    data: parameter
  })
}

// 修改绑定手机号
export function editUserPhone (parameter) {
  return request({
    url: userApi.editUserPhone,
    method: 'post',
    data: parameter
  })
}

export function getUserPhoneCode (phone, parameter) {
  return request({
    url: userApi.getUserPhoneCode(phone),
    method: 'post',
    data: parameter
  })
}
