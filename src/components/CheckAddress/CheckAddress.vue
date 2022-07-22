<template>
  <div>
    <a-row>
      <a-col :span="10">
        <a-form-model-item label="住址:">
          <a-select v-model="checkPro" :default-value="provinceData[0].name" style="" @change="handleProvinceChange">
            <a-select-option v-for="province in provinceData" :key="province.code">
              {{ province.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="6">
        <a-form-model-item>
          <a-select v-model="checkCity" style="" @change="handleCityChange">
            <a-select-option v-for="city in cityArr" :key="city.code">
              {{ city.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="6">
        <a-form-model-item>
          <a-select v-model="checkArea" style="" @change="handleAreaChange">
            <a-select-option v-for="area in areaArr" :key="area.code">
              {{ area.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import provinces from './AddressFile/provinces.json'
import cities from './AddressFile/cities.json'
import areas from './AddressFile/areas.json'

export default {
    data () {
        return {
            provinceData: provinces,
            checkPro: '',
            cityData: cities,
            cityArr: [],
            areaArr: [],
            checkCity: '',
            areaData: areas,
            checkArea: ''
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
            console.log(this.provinceData)
            this.provinceData.forEach(function (val) {
              if (val.code === value) {
                console.log('==', val)
                that.checkPro = val.name
              }
            })
            this.cityArr.length = 0
            this.cityData.forEach(function (value2) {
                if (value2.provinceCode === value) {
                    const obj = { code: '', name: '' }
                    obj.code = value2.code
                    obj.name = value2.name
                    // console.log(obj)
                    that.cityArr.push(obj)
                }
            })
            // that.checkPro = value
            that.checkCity = that.cityArr[0].name
            that.checkArea = ''
        },
        handleCityChange (value) {
            var that = this
            this.areaArr.length = 0
            this.areaData.forEach(function (value3) {
                if (value3.cityCode === value) {
                    const obj = { code: '', name: '' }
                    obj.code = value3.code
                    obj.name = value3.name
                    // console.log(obj)
                    that.areaArr.push(obj)
                }
            })
            that.checkCity = value
            that.checkArea = that.areaArr[0].name
        },
        handleAreaChange (value) {
          this.checkArea = value
          console.log(this.checkPro + this.checkCity + this.checkArea)
        }
    }
}
</script>
