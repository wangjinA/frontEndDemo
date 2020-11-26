/*
 * @Author: 汪锦
 * @Date: 2020-10-14 20:16:40
 * @LastEditors: 杨汝岱
 * @LastEditTime: 2020-10-20 15:36:13
 * @Description: 40000端口下
 */
import axios from '@/axios'
const { $40000 } = axios
import Vue from 'vue'
const API = {
  //避难场所
  Shelter: {
    // 获取列表
    getList: params => $40000.get('/shelter/page', { params }),
    // 新增
    getAdd: params => $40000.post('/shelter/create', params),
    // 修改
    getUpdate: params => $40000.put('/shelter/update', params),
    // 删除
    getRemove: id => $40000.delete(`/shelter/remove/${id}`)
  },
  //水文信息
  Hydrology: {
    //获取列表
    getWaterList: params => $40000.get('/hydrology/page', { params }),
    // 新增
    getWaterAdd: params => $40000.post('/hydrology/create', params),
    //修改
    getWaterUpdate: params => $40000.put('/hydrology/update', params),
    //删除
    getWaterRemove: id => $40000.delete(`/hydrology/remove/${id}`)
  },
  //救援队伍
  RescueTeam: {
    //获取列表
    getRescueList: params => $40000.get('/rescue-team/page', { params }),
    // 新增
    getRescueAdd: params => $40000.post('/rescue-team/create', params),
    //修改
    getRescueUpdate: params => $40000.put('/rescue-team/update', params),
    //删除
    getRescueRemove: id => $40000.delete(`/rescue-team/remove/${id}`)
  }
}

Vue.prototype.$40000 = API
