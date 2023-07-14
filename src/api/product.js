import request from '@/utils/request'

const api = {
  addProduct: 'factory/products', // 产品新增与查询
  devices: 'factory/devices', // 设备新增与查询
  orders: 'factory/orders', // 出库订单新增与查询
  updateProduct: (id) => `factory/products/${id}`, // 产品修改
  updateDevices: (id) => `factory/devices/${id}` // 设备修改
}

// 创建产品
export function addProduct (parameter) {
  return request({
    url: api.addProduct,
    method: 'post',
    data: parameter
  })
}

// 查询产品
export function getProducts (pages) {
  return request({
    url: api.addProduct,
    method: 'get',
    params: {
      page: pages.page || 0,
      size: pages.size || 10
    }
  })
}
// 删除产品
export function delProduct (id) {
  return request({
    url: api.updateProduct(id),
    method: 'delete'
  })
}

// 创建设备
export function creatDevice (parameter) {
  return request({
    url: api.devices,
    method: 'post',
    data: parameter
  })
}

// 查询设备
export function getDevices (pages) {
  return request({
    url: api.devices,
    method: 'get',
    params: {
        page: pages.page || 0,
        size: pages.size || 10
    }
  })
}

export function creatOrders (parameter) {
  return request({
    url: api.orders,
    method: 'post',
    data: parameter
  })
}

export function getOrders (pages) {
  return request({
    url: api.orders,
    method: 'get',
    params: {
        page: pages.page || 0,
        size: pages.size || 10,
        order: 'desc'
    }
  })
}

export function updateProduct (id, parameter) {
  return request({
    url: api.updateProduct(id),
    method: 'put',
    data: parameter
  })
}

export function updateDevices (id, parameter) {
  return request({
    url: api.updateDevices(id),
    method: 'put',
    data: parameter
  })
}
