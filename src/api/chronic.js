import request from '@/utils/request'

const api = {
  addChronic: 'chronic-diseases',
  getChronic: 'chronic-diseases',
  editChronic: diseaseId => { return 'chronic-diseases/' + diseaseId },
  getSpeechList: diseaseId => { return `chronic-diseases/${diseaseId}/templates` }
}

export function addChronic (parameter) {
  return request({
    url: api.addChronic,
    method: 'post',
    data: parameter
  })
}

export function getChronic (pages) {
  return request({
    url: api.getChronic,
    method: 'get',
    params: {
      page: pages.page || 1,
      siez: pages.size || 10
    }
  })
}
export function editChronic (diseaseId, parameter) {
  return request({
    url: api.editChronic(diseaseId),
    method: 'put',
    data: parameter
  })
}
export function getSpeechList (diseaseId) {
  return request({
    url: api.getSpeechList(diseaseId),
    method: 'get'
  })
}
