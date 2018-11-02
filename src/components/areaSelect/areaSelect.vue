/*
 * @Author: zhanghongqiao 
 * @Date: 2018-11-02 17:08:04 
 * @Email: 991034150@qq.com 
 * @Description: 地区列表
 * @Last Modified by: zhanghongqiao
 * @Last Modified time: 2018-11-02 18:07:40
 */

<template>

  <div class="area-contain" :class="{area_contain_active: status}" v-if="status">
    <section class="area-main">
         
        <div class="area-top  border-a">
          <div class="area-province area-top-item" @click="selectArea(1)">{{CheckArea.province}}</div>
          <div class="area-city area-top-item" @click="selectArea(2)">{{CheckArea.city}}</div>
          <div class="area-district area-top-item" @click="selectArea(3)">{{CheckArea.district}}</div>
        </div>
        <div class="area-top  border-a">
          <div class="area-province area-top-item" :class="{area_top_active: 1==areaStatus}" @click="selectArea(1)">省份</div>
          <div class="area-city area-top-item" :class="{area_top_active: 2==areaStatus}" @click="selectArea(2)">城市</div>
          <div class="area-district area-top-item" :class="{area_top_active: 3==areaStatus}" @click="selectArea(3)">区/县名</div>
        </div>
        <div class="area-content border">
        <ul class="area-data" :class="{none: 1!=areaStatus}">
            <li class="area-data-item" 
              v-for="(item,key,index) in data" 
              :key="index"
              @click="checkProvOne(key,item.name)" :class="{red: key==checkProvince}">
            <span class="area-text">{{item.name}}</span>
            <i class="icon-check iconfont" style="margin-left: 0.1rem" :class="{none: key != checkProvince}"></i>
            </li>
        </ul>
        <ul class="area-data" :class="{none: 2!=areaStatus}" v-if="data[checkProvince]">
            <li class="area-data-item" 
              v-for="(item,key,index) in data[checkProvince].child" 
              :key="index"
              @click="checkCityOne(key,item.name,checkProvince)" :class="{red: key==checkCity}">
            <span class="area-text">{{item.name}}</span>
            <i class="icon-check iconfont" style="margin-left: 0.1rem" :class="{none: key != checkCity}"></i>
            </li>
        </ul>
        <ul class="area-data" :class="{none: 3!=areaStatus}" v-if="data[checkProvince]&&data[checkProvince].child[checkCity].child">
            <li class="area-data-item" 
              v-for="(item,key,index) in data[checkProvince].child[checkCity].child"
              :key="index"
              @click="checkDistrictOne(key,item.name)" :class="{red: key==checkDistrict}">
            <span class="area-text">{{item.name}}</span>
            <i class="icon-check iconfont" style="margin-left: 0.1rem" :class="{none: key != checkDistrict}"></i>
            </li>
        </ul>
        </div>
    </section>
  </div>
  
</template>

<script>
import "./area-select.css";
export default {
  name: "area-select",
  props: ["data", "status", "default"],
  methods: {
    select: function() {
      // 关闭选择器 广播事件
      this.$emit("areashow", this.CheckArea); // 广播关闭选择器
      var data = this.CheckArea.province + this.CheckArea.city + this.CheckArea.district;
      this.$emit("update:area", data); // 更新选择的地址
    },
    selectArea: function(it) {
      // 高亮 省 市 区 其中一个
      this.areaStatus = it;
    },
    checkProvOne: function(it, name) {
      // 选择省份
      this.checkProvince = it;
      this.CheckArea.province = name;
      this.CheckArea.city = this.data[it].child[0].name;
      this.CheckArea.district =
        this.data[it].child[0].child && this.data[it].child[0].child.length != 0
          ? this.data[it].child[0].child[0].name
          : "无";
      this.checkCity = 0;
      (this.checkDistrict = 0), (this.areaStatus = 2);
    },
    checkCityOne: function(it, name, its) {
      // 选择市区
      this.checkCity = it;
      this.CheckArea.province = this.data[its].name;
      this.CheckArea.city = name;
      this.CheckArea.district =
        this.data[its].child[it].child &&
        this.data[its].child[it].child.length != 0
          ? this.data[its].child[it].child[0].name
          : "无";
      (this.checkDistrict = 0), (this.areaStatus = 3);
    },
    checkDistrictOne: function(it, name) {
      // 选择区
      this.CheckArea.province = this.data[this.checkProvince].name;
      this.CheckArea.city = this.data[this.checkProvince].child[
        this.checkCity
      ].name;
      this.checkDistrict = it;
      this.CheckArea.district = name;
    }
  },
  created: function() {
    this.$on("area-select", function(id) {
      // ...
    });
  },
  data: function() {
    return {
      maskStatus: true,
      areaStatus: 1,
      checkProvince: 0,
      checkCity: 0,
      checkDistrict: 0,
      province: '省份',
      city: '城市',
      district: '区/县', 
      county: '路/街道',
      floor: '楼宇',
      CheckArea: {
        province: "省份",
        city: "城市",
        district: "区/县"
      }
    };
  },
  mounted() {
    this.CheckArea = {
      province: this.default.proName,
      city: this.default.cityName,
      district: this.default.disName
    };
  }
};
</script>

