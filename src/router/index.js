/*
 * @Author: zhanghongqiao
 * @Date: 2018-05-29 21:07:35 
 * @Description: 路由配置
 * @Last Modified by: zhanghongqiao
 * @Last Modified time: 2018-10-12 10:06:36
 */

import Vue from 'vue'
import Router from 'vue-router'
// 注册Router
Vue.use(Router)
// 登录
const Login = () => import('@/containers/login/index.vue')
// 首页
const Home = () => import('@/containers/home/index.vue')
// 配置项
import config from '@/config/base.config'

const routes = [
  {
    path: '*',
    redirect: `${config.routerPath}/airMonitoring/landingPage`,
    component: Home // 首页
  },
  {
    path: `${config.routerPath}/login`, // 登录
    name: '登录',
    components: {
      login: Login
    } 
  },{
    path: `${config.routerPath}/airMonitoring/landingPage`,
    name: '首页',
    component: Home // 首页
  }
]


export default new Router({
  mode: 'history',
  routes
})
