/*
 * @Author: zhanghongqiao 
 * @Date: 2018-11-02 17:08:04 
 * @Email: 991034150@qq.com 
 * @Description: 地区列表
 * @Last Modified by: zhanghongqiao
 * @Last Modified time: 2018-11-06 18:17:36
 */

<template>

  <div class="area-contain" :class="{area_contain_active: status}" v-if="status">
    <section class="area-main">
         
        <div class="area-top  border-a">
          <div class="area-province area-top-item" @click="selectArea(1)">{{CheckArea.province}}</div>
          <div class="area-city area-top-item" @click="selectArea(2)">{{CheckArea.city}}</div>
          <div class="area-district area-top-item" @click="selectArea(3)">{{CheckArea.district}}</div>
          <div class="area-district area-top-item" @click="selectArea(4)">{{CheckArea.county}}</div>
          <div class="area-district area-top-item" @click="selectArea(5)">{{CheckArea.floor}}</div>
        </div>
        <div class="area-top  border-a">
          <div class="area-province area-top-item" :class="{area_top_active: 1==areaStatus}" @click="selectArea(1)">省份</div>
          <div class="area-city area-top-item" :class="{area_top_active: 2==areaStatus}" @click="selectArea(2)">城市</div>
          <div class="area-district area-top-item" :class="{area_top_active: 3==areaStatus}" @click="selectArea(3)">区/县名</div>
          <div class="area-district area-top-item" :class="{area_top_active: 4==areaStatus}" @click="selectArea(4)">街道</div>
           <div class="area-district area-top-item" :class="{area_top_active: 5==areaStatus}" @click="selectArea(5)">楼宇</div>
        </div>
        <div class="area-content border">
          <!-- 省份 -->
        <ul class="area-data" :class="{none: 1!=areaStatus}">
            <li class="area-data-item" 
              v-for="(item,key,index) in data" 
              :key="index"
              @click="checkProvOne(key,item.name)" :class="{red: key==checkProvince}">
            <span class="area-text">{{item.name}}</span>
            </li>
        </ul>
        <!-- 城市 -->
        <ul class="area-data" :class="{none: 2!=areaStatus}" v-if="data[checkProvince]">
            <li class="area-data-item" 
              v-for="(item,key,index) in data[checkProvince].child" 
              :key="index"
              @click="checkCityOne(key,item.name,checkProvince)" :class="{red: key==checkCity}">
            <span class="area-text">{{item.name}}</span>
            </li>
        </ul>
        <!-- 区/县 -->
        <ul class="area-data" :class="{none: 3!=areaStatus}" 
          v-if="data[checkProvince]&&data[checkProvince].child[checkCity].child">
            <li class="area-data-item" 
              v-for="(item,key,index) in data[checkProvince].child[checkCity].child"
              :key="index"
              @click="checkDistrictOne(key,item.name)" :class="{red: key==checkDistrict}">
            <span class="area-text">{{item.name}}</span>
            </li>
        </ul>
        <!-- 街道 -->
         <ul class="area-data" :class="{none: 4!=areaStatus}" 
            v-if="data[checkProvince]&&data[checkProvince].child[checkCity].child[checkDistrict].child">
            <li class="area-data-item" 
              v-for="(item,key,index) in data[checkProvince].child[checkCity].child[checkDistrict].child"
              :key="index"
              @click="checkCountyOne(key,item.name)" :class="{red: key==checkCounty}">
            <span class="area-text">{{item.name}}</span>
            </li>
        </ul>
        <!-- 楼宇 -->
         <!-- <ul class="area-data" :class="{none: 5!=areaStatus}" 
            v-if="data[checkProvince]&&data[checkProvince].child[checkCity].child[checkDistrict].child[checkCounty]">
            <li class="area-data-item" 
              v-for="(item,key,index) in data[checkProvince].child[checkCity].child[checkDistrict].child[checkCounty]"
              :key="index"
              @click="checkFloorOne(key,item.name)" :class="{red: key==checkFloor}">
            <span class="area-text">{{item.name}}</span>
            </li>
        </ul> -->
        </div>
    </section>
  </div>
  
</template>

<script>
import "./area-select.css";
export default {
  name: "area-select",
  data: function() {
    return {
      maskStatus: true,
      areaStatus: 1,
      checkProvince: 0,
      checkCity: 0,
      checkDistrict: 0,
      checkCounty: 0,
      checkFloor: 0,
      province: '省份',
      city: '城市',
      district: '区/县', 
      county: '路/街道',
      floor: '楼宇',
      CheckArea: {
        province: "省份",
        city: "城市",
        district: "区/县",
        county: '路/街道',
        floor: '楼宇',
      }
    };
  },
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
    // 选择省份
    checkProvOne: function(it, name) {
      this.checkProvince = it;
      // 城市默认选种第一个
      this.CheckArea.province = name;
      this.CheckArea.city = this.data[it].child[0].name; 
      // 区/县如果显示第一个，没有显示无
      this.CheckArea.district = this.data[it].child[0].child && this.data[it].child[0].child.length != 0
          ? this.data[it].child[0].child[0].name
          : "无";
          
      this.checkCity = 0;
      // 打开第二个（城市）tab
      (this.checkDistrict = 0), (this.areaStatus = 2);
    },
     // 选择市区
    checkCityOne: function(it, name, its) {
      this.checkCity = it;
      // 已经选种省赋值
      this.CheckArea.province = this.data[its].name;
      // 当前城市赋值
      this.CheckArea.city = name;
      // 区/县，有值默认显示第一个，没有值默认无
      this.CheckArea.district = this.data[its].child[it].child &&  this.data[its].child[it].child.length != 0
          ? this.data[its].child[it].child[0].name
          : "无";
      // 打开第三个tab（区县）
      (this.checkDistrict = 0), (this.areaStatus = 3);
    },
     // 选择区
    checkDistrictOne: function(it, name) {
      this.CheckArea.province = this.data[this.checkProvince].name;
      this.CheckArea.city = this.data[this.checkProvince].child[this.checkCity].name;
      this.checkDistrict = it;
      this.CheckArea.district = name;
      // 打开第四个tab(街道)
      (this.checkCounty = 0), (this.areaStatus = 4);
    },
    // 选择街道
    checkCountyOne: function(it, name) {
      this.CheckArea.province = this.data[this.checkProvince].name;
      this.CheckArea.city = this.data[this.checkProvince].child[this.checkCity].name;
      this.CheckArea.district = this.data[this.checkProvince].child[this.checkCity].child[this.checkDistrict].name;
      this.checkCounty = it
      this.CheckArea.county = name;
      (this.checkCounty = 0), (this.areaStatus = 5);
    },
    // 选择街道
    checkFloorOne: function(it, name) {
      this.CheckArea.province = this.data[this.checkProvince].name;
      this.CheckArea.city = this.data[this.checkProvince].child[this.checkCity].name;
      this.CheckArea.district = this.data[this.checkProvince].child[this.checkCity].child[this.checkDistrict].name;
      this.checkFloor = it
      this.CheckArea.floor = name;
    }
  },
  created: function() {
    this.$on("area-select", function(id) {
      // ...
    });
  },
  
  mounted() {
    this.CheckArea = {
      province: this.default.proName,
      city: this.default.cityName,
      district: this.default.disName,
      county: this.default.address,
      floor: this.default.build
    };
  }
};
</script>

