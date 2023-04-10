import request from '@/utils/request'

const api = {
  addAfterSale: 'after-sale/REPAIR',
  addInstallAfterSale: 'after-sale/INSTALL',
  getAfterSale: 'after-sale',
  addProcess: id => { return 'after-sale/' + id + '/process' },
  updateStatus: id => { return 'after-sale/' + id },
  updateProcess: (id, processId) => { return 'after-sale/' + id + '/process/' + processId }
}

// 新建维修工单
export function addAfterSale (parameter) {
  return request({
    url: api.addAfterSale,
    method: 'post',
    data: parameter
  })
}

// 新建安装工单
export function addInstallAfterSale (parameter) {
  return request({
    url: api.addInstallAfterSale,
    method: 'post',
    data: parameter
  })
}

// 获取维修工单
export function getAfterSale () {
  return request({
    url: api.getAfterSale,
    method: 'get'
  })
}

// 创建评估流程
export function addProcess (id, parameter) {
  return request({
    url: api.addProcess(id),
    method: 'post',
    data: parameter
  })
}

// 更改状态
export function updateStatus (id, parameter) {
  return request({
    url: api.updateStatus(id),
    method: 'put',
    data: parameter
  })
}

// 更改状态
export function updateProcess (id, processId, parameter) {
  return request({
    url: api.updateProcess(id, processId),
    method: 'put',
    data: parameter
  })
}
