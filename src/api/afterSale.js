import request from '@/utils/request'

const api = {
  addAfterSale: 'after-sale/REPAIR',
  addInstallAfterSale: 'after-sale/INSTALL',
  getAfterSale: 'after-sale',
  getSaleRepair: (id) => { return `after-sale/${id}` },
  addProcess: id => { return 'after-sale/' + id + '/process' },
  updateStatus: id => { return 'after-sale/' + id },
  updateProcess: (id, processId) => { return 'after-sale/' + id + '/process/' + processId },
  saleRefund: 'pay/refund',
  processPay: (processId) => { return `after-sale/${processId}/pay` },
  addNewPart: 'after-sale/part',
  editPart: (id) => { return `after-sale/part/${id}` }
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
// 退款
export function saleRefund (parameter) {
  return request({
    url: api.saleRefund,
    method: 'post',
    data: parameter
  })
}
export function processPay (processId, parameter) {
  return request({
    url: api.processPay(processId),
    method: 'post',
    data: parameter
  })
}

// 获取单个维修工单
export function getSaleRepair (id) {
  return request({
    url: api.getSaleRepair(id),
    method: 'get'
  })
}

// 新增配件
export function addNewPart (parameter) {
  return request({
    url: api.addNewPart,
    method: 'post',
    data: parameter
  })
}

export function getParts (pages) {
  return request({
    url: api.addNewPart,
    method: 'get',
    params: {
      page: pages.page || 0,
      size: pages.size || 10
    }
  })
}
// 编辑配件
export function editPart (id, parameter) {
  return request({
    url: api.editPart(id),
    method: 'put',
    data: parameter
  })
}
// 删除配件
export function deletePart (id) {
  return request({
    url: api.editPart(id),
    method: 'delete'
  })
}
