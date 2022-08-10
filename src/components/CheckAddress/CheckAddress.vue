<template>
  <div>
    <a-row>
      <a-col :span="6">
        <a-select v-model="checkPro" :default-value="provinceData[0].name" style="" @change="handleProvinceChange">
          <a-select-option v-for="province in provinceData" :key="province.code">
            {{ province.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6" :push="1">
        <a-select v-model="checkCity" style="" @change="handleCityChange">
          <a-select-option v-for="city in cityArr" :key="city.code">
            {{ city.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6" :push="2">
        <a-select v-model="checkArea" style="" @change="handleAreaChange">
          <a-select-option v-for="area in areaArr" :key="area.code">
            {{ area.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6" :push="3">
        <a-select v-model="checkStreet" style="" @change="handleStreetChange">
          <a-select-option v-for="street in streetArr" :key="street.code">
            {{ street.name }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import provinces from './AddressFile/provinces.json'
import cities from './AddressFile/cities.json'
import areas from './AddressFile/areas.json'
import streets from './AddressFile/streets.json'

export default {
    data () {
        return {
            provinceData: provinces,
            cityData: cities,
            areaData: areas,
            streetsData: streets,
            cityArr: [],
            areaArr: [],
            streetArr: [],
            checkPro: '',
            checkCity: '',
            checkArea: '',
            checkStreet: ''
        }
    },
    mounted () {
        // console.log('1', this.provinceData)
        // console.log('2', this.cityData)
        // console.log('3', this.area)
    },
    methods: {
        handleProvinceChange (value) {
            var that = this
            // console.log(this.provinceData)
            // 循环省级
            this.provinceData.forEach(function (val) {
              if (val.code === value) {
                that.checkPro = val.name
              }
            })
            this.cityArr.length = 0
            this.areaArr.length = 0
            this.streetArr.length = 0
            // 循环市级,根据选择的省构造市级数组
            this.cityData.forEach(function (value2) {
                if (value2.provinceCode === value) {
                    const obj = { code: '', name: '' }
                    obj.code = value2.code
                    obj.name = value2.name
                    that.cityArr.push(obj)
                }
            })
            // 默认市
            // that.checkCity = that.cityArr[0].name
            that.checkCity = null
            that.checkArea = null
            that.checkStreet = null
        },
        handleCityChange (value) {
            var that = this
            this.areaArr.length = 0
            this.streetArr.length = 0
            // 循环区级,根据选择的省构造区级表
            this.areaData.forEach(function (value3) {
                if (value3.cityCode === value) {
                    const obj = { code: '', name: '' }
                    obj.code = value3.code
                    obj.name = value3.name
                    that.areaArr.push(obj)
                }
            })
            // 循环市级
            this.cityArr.forEach(function (value2) {
              if (value2.code === value) {
                that.checkCity = value2.name
              }
            })
            // console.log(this.checkCity)
            // that.checkArea = that.areaArr[0].name
            that.checkArea = null
            that.checkStreet = null
        },
        handleAreaChange (value) {
            var that = this
            this.streetArr.length = 0
            // 循环区级
            this.areaArr.forEach(function (value2) {
              if (value2.code === value) {
                that.checkArea = value2.name
              }
            })
            this.streetsData.forEach(function (value3) {
              if (value3.areaCode === value) {
                const obj = { code: '', name: '' }
                obj.code = value3.code
                obj.name = value3.name
                that.streetArr.push(obj)
              }
            })
            // this.checkStreet = this.streetArr[0].name
            this.checkStreet = null
        },
        handleStreetChange (value) {
          // console.log(value)
          var that = this
          this.streetArr.forEach(function (value2) {
            if (value2.code === value) {
              that.checkStreet = value2.name
            }
          })
          const address = { pro: '', city: '', area: '', street: '' }
          address.pro = this.checkPro
          address.city = this.checkCity
          address.area = this.checkArea
          address.street = this.checkStreet
          this.$emit('changes', address)
        },
        setAddress (value) {
          this.checkPro = value.province
          this.checkCity = value.city
          this.checkArea = value.area
          this.checkStreet = value.street
        }
    }
}
</script>

<style>
.qq{
  margin-right: 10px;
}
</style>
