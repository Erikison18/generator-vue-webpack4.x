/*
* @Author: zhanghongqia
* @email: 991034150@qq.com
* @Date: 2018-06-08 21:31:55
* @Description: 首页入口组件
 * @Last Modified by: zhanghongqiao
 * @Last Modified time: 2018-11-02 17:29:53
*/

<style lang="scss" scoped>
.weather-web-home {
  font-size: 32px;
  color: #fff;
  text-align: center;
  padding-top: 90px;
}
</style>


<template>
  <div class="weather-web-home">
     <area-select :data="areaList" :status="areaSelect" @areashow="maskStatus" :class="{'none':!areaSelect}" :area='areaStatus'
          :default="defaultValue"
          @update:area="val => areaStatus = val"></area-select>
  </div>
</template>

<script>
import AreaSelect from "@/components/areaSelect/areaSelect.vue";
import { JSON_ } from '../data.js'
export default {
  data() {
    return {
      areaList: [], // 地址数据
      JSON_: JSON_,
      areaSelect: false, // 控制地址选择器显示
      areaStatus: "", // 更新选择之后的地址
      defaultValue: {
        address: "东三环中路",
        cityName: "北京市",
        city: 110100,
        build: "环球金融中心东楼",
        proName: "北京",
        pro: 110000,
        disName: "朝阳区",
        dis: 110105
      }
    };
  },
  components: {
    "area-select": AreaSelect
  },
  mounted() {
    this.maskStatus();
  },
  methods: {
    maskStatus: function() {
      // 更改显示状态
      this.areaSelect = !this.areaSelect;
    }
  },
  created: function() {
    this.areaList = JSON_; //地址数据赋值
  }
};
</script>


 



