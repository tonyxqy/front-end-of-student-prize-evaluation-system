import request from '@/utils/request'
import axios from 'axios';

export function fetchList(item) {
  return axios({
    url: 'http://47.103.85.74:8088/application/select',
    method: 'post',
    headers: {
      key: "Content-Type",
      value: "application/json",
      type: "text"
    },
    data:item
  })
}
export function getuser(item) {
  return axios({
    url: 'http://47.103.85.74:8081/stuInfo/get',
    method: 'post',
    headers: {
      key: "Content-Type",
      value: "application/json",
      type: "text"
    },
    data:{
      username:"root"
    }
  })
}
export function getxkfl() {
  return axios({
    url: 'http://47.103.85.74:8090/reference/get',
    method: 'get',
    headers: {
      key: "Content-Type",
      value: "application/json",
      type: "text"
    },
  })
}


export function delList(data) {
  return axios({
    url: 'http://47.103.85.74:8088/application/delete',
    method: 'Delete',
    headers: {
      key: "Content-Type",
      value: "application/json",
      type: "text"
    },
    data      
  })
}
export function changestatus(data) {
  return axios({
    url: 'http://47.103.85.74:8088/application/status',
    method: 'post',
    headers: {
      key: "Content-Type",
      value: "application/json",
      type: "text"
    },
    data      
  })
}
export function fetchArticle(id) {
  return request({
    // url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    // url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    // url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    // url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
