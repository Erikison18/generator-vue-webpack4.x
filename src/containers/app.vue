/*
* @Author: zhanghongqia
* @email: 991034150@qq.com
* @Date: 2018-06-10 18:27:03
* @Description: 应用程序模板入口
 * @Last Modified by: zhanghongqiao
 * @Last Modified time: 2018-08-06 18:18:59
*/

<style lang="scss" scoped>
  .main-container {
    position: relative;
    top: 40px;
    width: 100%;
  }
</style>

<template>
  <div id="app">
    <!-- 未登录状态 -->
    <template v-if="logged">
      <router-view name="login"/>
    </template>
    <!-- 登录成功 -->
    <template v-else>
      <div class="main">
        <TopMenu
          :logout="logout"
          :requestChangePwd="requestChangePwd"
          :menuList="menuList"
          :topActiveId="topActiveId"
          :cityName="cityName"
          :areaList="areaList"/>
        <!-- 路由出口 路由匹配到的组件将渲染在这里 -->
        <div class="main-container clearfix">
          <router-view/>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {fetch} from '@/util/request'
  import TopMenu from '@/components/common/menus/topMenu/index'
  import {setCookie} from '@/util/util'

  export default {
    name: 'App',
    data() {
      return {
        loading: '' // 退出中
      }
    },
    components: {
      TopMenu,
    },
    /*
    * 模板内的表达式非常便利，
    * 但是设计它们的初衷是用于简单运算的。
    * 在模板中放入太多的逻辑会让模板过重且难以维护。例如：
    * <div id="example">
    *   {{ message.split('').reverse().join('') }}
    * </div>
    * 在这个地方，模板不再是简单的声明式逻辑。
    * 你必须看一段时间才能意识到，这里是想要显示变量 message 的翻转字符串。
    * 当你想要在模板中多次引用此处的翻转字符串时，就会更加难以处理。
    * 所以，对于任何复杂逻辑，你都应当使用计算属性。但是在methods也可达到同样的效果
    * 计算属性只有在它的相关依赖发生改变时才会重新求值。这就意味着只要 message 还没有发生改变，
    * 多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。
    * 两者的对比：每当触发重新渲染时，调用方法将总会再次执行函数。如果你不希望有缓存，可用方法来替代。
    */
    computed: mapGetters({
      logged: 'logged',  // 登录状态
      menuList: 'menuList', // 顶部菜单导航
      areaList: 'areaList', // 地区列表
      userId: 'userId', // 用户id
      cityName: 'cityName',
      topActiveId: 'topActiveId', // 当导航菜单导航状态
    }),

    /**
     * 在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：
     * 数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。
     * 然而，挂载阶段还没开始，$el 属性目前不可见。
     */
    mounted() {
      // 未登录跳转到登录页
      if (this.logged) {
        this.$router.push('/weather-web/login')
      }
      // 判断是否输入了login页面
      let href = window.location.href
      let isLogin = href.indexOf('weather-web/login')
      if (isLogin !== -1) {
        this.setLoginState()
      }
      if (_.isEmpty(this.userId)) {
        return
      }
      // 数据请求
      this.requestData()
    },
    methods: {
      /**
       *  数据请求(导航菜单说地区列表)
       */
      requestData() {
        // 为true是未登录
        if (this.logged) {
          return
        }
        // 获取顶部菜单数据数据
        this.$store.dispatch('topMenuRequest', {userId: this.userId})
        // 获取头部右边地区列表数据
        this.$store.dispatch('areaListRequest')
        // 权限接口数据
        this.$store.dispatch('functionRoleRequest')
        // 后端服务时间数据
        this.$store.dispatch('datatimeRequest')
      },
      /*
       * 退出
       */
      logout() {
        let self = this
        //  退出中提示信息
        this.loading = this.$loading({
          text: '正在退出',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.3)'
        })
        self.setLoginState(1)
        // 发起退出登录请求
        // fetch('fetchLogout')
      },


      /**
       * 设置登录状态
       * @Nubmer type 调用类型1,是直接退出登录，2是修改密码后退出
       */
      setLoginState(type) {
        type === 1 ? this.loading.close() : '' // 关闭弹窗
        // 修改登录状态
        this.$store.commit('setLoginState', true)
        // 链接跳转
        this.$router.push('/weather-web/login')
        // 清空城市名
        setCookie("cityName", '')
        // 清空用户id
        setCookie('userId', '')
      },
      /**
       * 修改密码请求
       * @Object pramas 请求参数
       */
      requestChangePwd(pramas) {
        let self = this
        fetch('fetchChangePwd', pramas, (data) => {
          self.$message({
            message: '密码修改成功',
            duration: 1500, // 0 不关闭弹窗
            center: true,
            type: ''
          });
          self.setLoginState()
        })
      },
    },
    watch: {
      // 监听登录状态
      'logged': function () {
        // 登录成功获取顶部导航菜单
        this.requestData()
      },
      'menuList': function () {
        localStorage.setItem('topActiveId', this.menuList[0].id)
      }
    }
  }
</script>

 

 


 
