<template>
  <div>
    <a-modal
      forceRender
      class="modal"
      v-model="visible"
      title="健康信息"
      @ok="handleOk"
      @cancel="closeModel"
      :width="1150">
      <template v-if="selectReport" slot="footer">
        <a-button @click="closeModel">取消</a-button>
      </template>
      <a-row :gutter="20">
        <a-col :span="4" class="modalLeft">
          <div class="modal-left-panel">
            <div class="left-title-wrapper" v-for="item in objData.data" :key="item.id">
              <a @click="onSc(item.name)">{{ item.name }}</a>
            </div>
            <div class="left-title-wrapper">
              <a @click="onSc('用户诊断信息')" key="用户诊断信息">用户诊断信息</a>
            </div>
            <div class="left-title-wrapper">
              <a @click="onSc('用户症状信息')" key="用户症状信息">用户症状信息</a>
            </div>
            <!-- 回到顶部 -->
            <div class="left-title-wrapper">
              <a-icon :style="{fontSize: '25px'}" @click="onSc(objData.data[0].name)" type="up-square" theme="filled" />
            </div>
            <!-- 清空 -->
            <div v-if="!selectReport" class="left-title-wrapper">
              <a-icon @click="clearData()" :style="{fontSize: '25px'}" type="delete" theme="filled" />
            </div>
          </div>
        </a-col>
        <a-col :span="19" :offset="1" ref="modalRight" class="modal-right-panel">
          <a-form-model>
            <div v-for="item in objData.data" :key="item.id">
              <!-- 大标题 -->
              <a-row>
                <a-col class="project-header">
                  <a :id="item.name" class="project-title">{{ item.name }}</a>
                </a-col>
              </a-row>
              <!-- 大标题下的小标题加内容 -->
              <a-row style="padding-top: 24px; padding-bottom: 24px;">
                <a-col class="rightBody" :span="24" v-for="items in item.items" :key="items.id">
                  <a-row class="index-item" style="#border: 1px #eee solid;">
                    <a-col :span="3">
                      <div class="index-item-title-wrapper">
                        <div class="index-item-title-sider"/>
                        <span class="index-item-title"> {{ items.name }} </span>
                      </div>
                    </a-col>
                    <!-- 新建 -->
                    <a-col :span="21" v-if="!selectReport">
                      <AddHealthInput
                        ref="childAdd"
                        @change="({ value, diaResult }) => { items.value = value, items.diaResult = diaResult }"
                        :name="items.name"
                        :unit="items.unit"
                        :result="items.result"
                        :testMethod="items.testMethod"
                        :testRate="items.testRateValue + '次/' + items.testRateUnit"
                        :testEnvironment="items.testEnvironment"
                        :remark="items.remark"/>
                    </a-col>
                    <!-- 查看 -->
                    <a-col :span="21" v-if="selectReport">
                      <!-- <span v-if="selectReport" :span="24" class="rightBody" v-for="items in item.items" :key="items.id"> -->
                      <div>
                        <a class="exTitle">检测值:</a>
                        {{ items.value }} {{ items.unit }}
                      </div>
                      <div>
                        <a class="exTitle">检测结果:</a>
                        {{ items.diaResult }}
                      </div>
                      <!-- </span> -->
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
              <!-- 选择项目诊断时间 -->
              <a-row style="margin-bottom: 36px;">
                <a-col :span="8" :offset="16">
                  <!-- 新建 -->
                  <span>
                    检测时间:
                  </span>
                  <span style="float: right;">
                    <a-date-picker
                      show-time
                      v-if="!selectReport"
                      v-model="item.testAt"
                      type="date"
                      placeholder="请选择检测时间"
                    />
                  </span>
                  <div v-if="selectReport" style="float: right; margin-right: 12px;">{{ item.testAt | getMoment }}</div>
                </a-col>
              </a-row>
            </div>
            <!-- 用户诊断信息 -->
            <div>
              <a-row>
                <a-col class="project-header">
                  <a id="用户诊断信息" class="project-title">用户诊断信息</a>
                </a-col>
              </a-row>
              <a-row style="padding-top: 12px; padding-bottom: 12px;">
                <a-col>
                  <a-form-model-item>
                    <a-row>
                      <a-col :span="3">
                        <div class="index-item-title-wrapper">
                          <div class="index-item-title-sider"/>
                          <span class="index-item-title"> 诊断结果 </span>
                        </div>
                      </a-col>
                      <a-col :span="21">
                        <!-- 新建选择病症 -->
                        <div v-if="!selectReport" style="padding-top: 0px;">
                          <CheckDia ref="childDia" v-model="objData.diagnosisData" @changes="getDia($event)" />
                        </div>
                        <!-- 查看 -->
                        <div v-if="selectReport">{{ objData.diagnosisData }}</div>
                      </a-col>
                    </a-row>
                    <a-row style="margin-bottom: 12px;">
                      <a-col :span="8" :offset="16">
                        <!-- 新建 -->
                        <span>
                          诊断时间:
                        </span>
                        <span style="float: right;">
                          <a-date-picker
                            show-time
                            v-if="!selectReport"
                            v-model="objData.diagnosisTime"
                            type="date"
                            placeholder="请选择诊断时间"
                          />
                        </span>
                        <!-- 查看 -->
                        <div v-if="selectReport" style="float: right; margin-right: 12px;">{{ objData.diagnosisTime | getMoment }}</div>
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
            <!-- 用户症状信息 -->
            <div>
              <a-row>
                <a-col class="project-header">
                  <a id="用户症状信息" class="project-title">用户症状信息</a>
                </a-col>
              </a-row>
              <a-row style="padding-top: 12px; padding-bottom: 12px;">
                <a-col>
                  <a-form-model-item>
                    <a-row>
                      <a-col :span="3">
                        <div class="index-item-title-wrapper">
                          <div class="index-item-title-sider"/>
                          <span class="index-item-title"> 症状 </span>
                        </div>
                      </a-col>
                      <a-col :span="21">
                        <a-textarea v-if="!selectReport" v-model="objData.symptomData" placeholder="填写用户症状信息" :rows="4" />
                        <div v-if="selectReport">{{ objData.symptomData }}</div>
                      </a-col>
                    </a-row>
                    <a-row style="margin-bottom: 12px;">
                      <a-col :span="8" :offset="16">
                        <!-- 新建 -->
                        <span>
                          检测时间:
                        </span>
                        <span style="float: right;">
                          <a-date-picker
                            show-time
                            v-if="!selectReport"
                            v-model="objData.symptomTime"
                            type="date"
                            placeholder="请选择检测时间"
                          />
                        </span>
                        <div v-if="selectReport" style="float: right; margin-right: 12px;">{{ objData.symptomTime | getMoment }}</div>
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </a-form-model>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import CheckDia from '@/components/DiaMsg/CheckDia.vue'
import AddHealthInput from './AddHealthInput.vue'
import { getHealthIndex, addHealthReport } from '@/api/health'
import moment from 'moment'
// import { getHealthIndex } from '@/api/health'

export default {
    components: {
      CheckDia,
      AddHealthInput
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
      },
      // 过滤时间
      getMoment: function (value) {
        if (value === null) {
          return ''
        } else {
          return moment(value).format('YYYY-MM-DD HH:mm')
        }
      }
    },
    data () {
        return {
            selectReport: false, // 用于查看报告单v-if
            top: 10,
            visible: false,
            customerId: null,
            objData: {
              // item
              data: [],
              diagnosisData: null, // 诊断信息
              diagnosisTime: null, // 诊断时间
              symptomData: null, // 症状信息
              symptomTime: null // 症状时间
            },
            apiData: {
              projects: [
              ]
            }
        }
    },
    mounted () {
      // console.log('mounted')
      getHealthIndex().then(res => {
        if (res.status === 200) {
          const formdata = res.data
          for (var i = 0; i < formdata.length; i++) {
            // console.log(formdata[i])
            formdata[i].testAt = null
            for (var j = 0; j < formdata[i].items.length; j++) {
              formdata[i].items[j].value = null
              formdata[i].items[j].diaResult = null
              // console.log(formdata[i].items[j])
            }
          }
          this.objData.data = formdata
          // console.log('objdata', this.objData.data)
        }
      })
      // this.$refs.childDia.clearDia()
      this.objData.diagnosisData = null
      this.objData.diagnosisTime = null
      this.objData.symptomData = null
      this.objData.symptomTime = null
    },
    methods: {
      // 保存五级联动的诊断结果
      getDia (value) {
        this.objData.diagnosisData = value
        // console.log('我是诊断结果', value)
      },
      openModel () {
        this.visible = true
      },
      closeModel () {
        this.visible = false
      },
      // 新建报告
      AddHealthCom (cusmId) {
        this.selectReport = false
        this.customerId = cusmId
        // console.log(cusmId, '我是点击新建触发的时间,传入custmoerId')
        this.$nextTick(() => {
          this.clearData() // 调清空方法
        })
        // if (this.customerId) {
        //   // 如果用户不同，则清空新建弹窗
        //   if (this.customerId !== cusmId) {
        //     this.customerId = cusmId
        //     this.$nextTick(() => {
        //       this.clearData() // 调清空方法
        //     })
        //   }
        // } else {
        //   this.customerId = cusmId
        // }
      },
      filterHealthData (data) {
        if (data) {
          return data
        } else {
          return null
        }
      },
      // 查看报告
      seeHealthCom (data) {
        this.selectReport = true
        const that = this
        // console.log('我是点击查看触发,传入的数据', data)
        // console.log('查看objdataval1', this.objData)
        this.objData.data.forEach(function (one) {
          one.testAt = null
          one.items.forEach(function (two) {
            two.value = null
            two.diaResult = null
          })
        })
        // console.log('点击查看报告单数据val2', data.projects)
        this.objData.symptomData = this.filterHealthData(data.symptom)
        this.objData.symptomTime = this.filterHealthData(data.symptomAt) // 有点小问题，会报警告，问题为日期格式初始化
        this.objData.diagnosisTime = this.filterHealthData(data.diseaseAt)
        if (data.disease) {
          this.objData.diagnosisData = this.filterHealthData(data.disease.title)
        } else {
          this.objData.diagnosisData = null
        }
        // // console.log('查看objdataval1', this.objData.data)
        this.objData.data.forEach(function (val1) {
          if (data.projects.length !== 0) {
            data.projects.forEach(function (val2) {
              if (val1.name === val2.indexProjectName) {
                val1.items.forEach(function (val3) {
                  val2.items.forEach(function (val4) {
                    if (val3.id === val4.healthIndexItem.id) {
                      val3.value = that.filterHealthData(val4.value)
                      val3.diaResult = that.filterHealthData(val4.result)
                    }
                  })
                })
                if (val2.testAt) {
                  val1.testAt = val2.testAt
                }
              }
            })
          }
        })
      },
      handleOk () {
        const apiData = this.apiData
        const formData = this.objData
        const customerId = this.customerId
        apiData.projects.length = 0
        formData.data.forEach(function (val) {
          const x = { indexProjectName: null, items: [], testAt: null }
          x.indexProjectName = val.name
          x.testAt = val.testAt
          val.items.forEach(function (val2) {
            if (val2.value != null) {
              const y = { indexId: val2.id, value: val2.value, result: val2.diaResult }
              x.items.push(y)
              // console.log(x)
            }
          })
          // 判断items是否为空，空则不传回后端
          if (x.items.length !== 0) {
            apiData.projects.push(x)
          }
        })
        apiData.diseaseId = formData.diagnosisData
        apiData.diseaseAt = formData.diagnosisTime
        apiData.symptom = formData.symptomData
        apiData.symptomAt = formData.symptomTime
        // console.log('表格数据', formData)
        // console.log('传回接口数据', apiData)
        addHealthReport(customerId, apiData).then(res => {
          if (res.status === 201) {
            // console.log('成功新建报告单')
            this.$message.info('成功新建报告单')
            this.visible = false
          }
        })
      },
      // 跳转导航
      onSc (value) {
        // console.log('11', value)
        document.getElementById(value).scrollIntoView({ behavior: 'smooth' })
      },
      clearData () {
        // console.log('清空')
        this.$nextTick(() => {
          this.$refs.childDia.clearDia()
          const that = this
          this.$nextTick(() => {
            this.objData.data.forEach(function (arr1) {
              arr1.items.forEach((item, index) => {
              that.$refs.childAdd[index].clearValue()
              })
            })
          })
          // console.log('objData', this.objData)
          for (var i = 0; i < this.objData.data.length; i++) {
            this.objData.data[i].testAt = null
            for (var j = 0; j < this.objData.data[i].items.length; j++) {
              this.objData.data[i].items[j].value = null
              this.objData.data[i].items[j].diaResult = null
            }
          }
          this.objData.diagnosisData = null
          this.objData.diagnosisTime = null
          this.objData.symptomData = null
          this.objData.symptomTime = null
        })
      }
    }
}
</script>

<style lang="less" scoped>
/* .modalLeft{
} */
.modal-left-panel{
  position: fixed;
  height: 400px;
  overflow: auto;
  border-radius: 6px;
  border: 1px #eee solid;
  text-align: left;
  width: 186px;
  padding: 24px 12px;
}
.left-title-wrapper{
  font-size: 18px;
  padding-bottom: 12px;
  padding: 0 12px 12px 12px;
}
.left-title-wrapper>a {
  color: #333;
  font-weight: 600;
}
.left-title-wrapper>a:hover {
  color: #00a0e9;
}
.modal-right-panel{
  /* height: 500px; */
  /* overflow: auto; */
  border-radius: 6px;
  padding: 10px;
  border-style: solid;
  border-width: 1px;
  border-color: #eee;
  padding: 24px 12px;
}
.project-header {
  background: linear-gradient(to bottom right, #00a0e9, #00abb9);
  padding: 0 14px;
  color: white;
  border-radius: 2px;
  border-color: none;
}
.project-title{
  font-size: 18px;
  pointer-events: none;
  height: 48px;
  line-height: 48px;
  color: white;
  font-weight: 700;
}
.rightBody{
  /* text-align: center; */
  /* height: 240px; */
  padding: 0 4px;
}
.exTitle{
  /* font-size: 18px; */
  color: #999;
  pointer-events:none;
  min-width: 64px;
  display: inline-block;
}
/deep/.ant-collapse > .ant-collapse-item > .ant-collapse-header{
  padding: 5px 30px;
}
/deep/.ant-collapse-content > .ant-collapse-content-box{
  padding: 0px 10px;
}
/deep/.ant-form-item{
  margin-bottom: 0px
}
.index-item-title-wrapper {
  display: flex;
  height: 34px;
  align-items: center;
}
.index-item-title {
  font-size: 14px;
  font-weight: 700;
  padding: 0 12px;
}
.index-item-title-sider {
  width: 8px;
  height: 24px;
  background: #00a0e9;
}
</style>
