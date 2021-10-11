/*
 * @Author: E-Dreamer
 * @Date: 2021-10-08 10:27:25
 * @LastEditTime: 2021-10-08 10:27:25
 * @LastEditors: E-Dreamer
 * @Description:
 */
import request from '@/utils/request'

export function getData(params) {
  return request({
    url: '/twoSceneData',
    method: 'get',
    params
  })
}
