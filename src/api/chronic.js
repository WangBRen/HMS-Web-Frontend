import request from '@/utils/request'

const api = {
  addChronic: 'chronic-diseases',
  getChronic: 'chronic-diseases',
  editChronic: diseaseId => { return 'chronic-diseases/' + diseaseId }
}

export function addChronic (parameter) {
  return request({
    url: api.addChronic,
    method: 'post',
    data: parameter
  })
}

export function getChronic () {
  return request({
    url: api.getChronic,
    method: 'get'
  })
}
export function editChronic (diseaseId, parameter) {
  return request({
    url: api.editChronic(diseaseId),
    method: 'put',
    data: parameter
  })
}
