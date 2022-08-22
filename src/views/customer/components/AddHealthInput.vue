<template>
  <div>
    <a-row>
      <a-col :span="21">
        <a-row justify="center">
          <a-col :span="14">
            <a-input v-model="inputValue" @change="setUser" :addonAfter="unit" style="width: 80%;"></a-input>
          </a-col>
          <a-col :span="10">
            <a-col :span="8">
              <span>诊断结果:</span>
            </a-col>
            <a-col :span="14">
              <a-select v-model="selectValue" @change="setUser" style="width: 100%;">
                <a-select-option v-for="(ranges,index) in result" :key="index" :value="ranges.name">
                  {{ ranges.name }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-col>
        </a-row>
        <a-row >
          <a class="openMsg" @click="showInput">展开</a>
          <div v-show="inputVisible">
            <div style="padding-top:12px; display: flex;">
              <div class="exTitle" style="margin-right: 4px;">参考结果:</div>
              <div style="color: #00a0e9">
                <span style="pointer-events:none;display:block;" v-for="(ranges,index) in result" :key="index">
                  {{ ranges | getRange }}
                  <span style="margin-left: 6px; color: #999"> ({{ ranges.unit }}) </span>
                </span>
              </div>
            </div>
            <div>
              <a class="exTitle">检查方式:</a>
              {{ testMethod }}
            </div>
            <div>
              <a class="exTitle">建议频率:</a>
              {{ testRate }}
            </div>
            <div>
              <a class="exTitle">检测环境:</a>
              {{ testEnvironment }}
            </div>
            <div>
              <span class="exTitle">备注:</span>
              {{ remark || '无' }}
            </div>
          </div>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script>

export default {
    name: 'AddHealthInput',
    props: {
        name: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            default: ''
        },
        result: {
            type: Array,
            required: true
        },
        testMethod: {
            type: String,
            default: ''
        },
        testRate: {
            type: String,
            default: ''
        },
        testEnvironment: {
            type: String,
            default: ''
        },
        remark: {
            type: String,
            default: ''
        }
    },
    filters: {
        getRange: function (value) {
            // 范围或数值
            if (value.type === 'range') {
            // 范围
            return `${value.name}:\t ${value.start || 'INF'} ≤ 指标值 < ${value.end || 'INF'}`
            } else if (value.type === 'simple') {
            // 数值
            return value.value
            }
        }
    },
    data () {
        return {
            inputVisible: false,
            inputValue: null,
            selectValue: null
        }
    },
    mounted () {
        // console.log(this.testEnvironment)
    },
    methods: {
        showInput () {
            if (this.inputVisible === true) {
                this.inputVisible = false
            } else {
                this.inputVisible = true
            }
        },
        setUser () {
            this.$emit('change', { value: this.inputValue, diaResult: this.selectValue })
            // console.log(this.inputValue, '测试', this.selectValue)
        },
        clearValue () {
            // console.log('111')
            // console.log(this.inputVisible)
            this.inputValue = null
            this.selectValue = null
            this.inputVisible = false
        }
    }
}
</script>
<style>
.exTitle{
  /* font-size: 18px; */
  color: #999;
  pointer-events:none;
  min-width: 64px;
  display: inline-block;
}
</style>
