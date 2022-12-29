import request from '@/utils/request'

const api = {
  getMedicine: '/medicine',
  addMedicine: (name) => '/medicine/' + name
}

export function getMedicine () {
  return request({
    url: api.getMedicine,
    method: 'get'
  })
}

export function addMedicine (name) {
  return request({
    url: api.addMedicine(name),
    method: 'post'
  })
}
