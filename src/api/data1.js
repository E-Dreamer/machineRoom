/*
 * @Author: E-Dreamer
 * @Date: 2021-09-28 10:41:07
 * @LastEditTime: 2021-09-28 10:55:19
 * @LastEditors: E-Dreamer
 * @Description:
 */
import request from '@/utils/request'

export function getData(params) {
  return request({
    url: '/oneSceneData',
    method: 'get',
    params
  })
}
