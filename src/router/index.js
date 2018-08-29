/*
 * @Author: zhanghongqiao
 * @Date: 2018-05-29 21:07:35 
 * @Description: 路由配置
 * @Last Modified by: zhanghongqiao
 * @Last Modified time: 2018-08-29 13:48:16
 */

import Vue from 'vue'
import Router from 'vue-router'
// 注册Router
Vue.use(Router)
// 登录
const Login = () => import('@/containers/login/index.vue')
// 首页
const Home = () => import('@/containers/home/index.vue')



const routes = [
  {
    path: '*',
    redirect: '/weather-web/airMonitoring/landingPage',
    component: Home // 首页
  },
  {
    path: '/weather-web/login', // 登录
    name: '登录',
    components: {
      login: Login
    } 
  },{
    path: '/weather-web/airMonitoring/landingPage',
    name: '首页',
    component: Home // 首页
  }
]


export default new Router({
  mode: 'history',
  routes
})
