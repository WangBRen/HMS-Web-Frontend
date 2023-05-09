import config from '@/config/defaultSettings'

export const setDocumentTitle = function (title) {
  const domin = window.location.host
  if (domin.includes('aftersale')) {
    document.title = '智能马桶信息管理'
  } else {
    document.title = '攸太健康管理系统'
  }
  const ua = navigator.userAgent
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')
    i.src = '/favicon.ico'
    i.style.display = 'none'
    i.onload = function () {
      setTimeout(function () {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}

export const domTitle = config.title
