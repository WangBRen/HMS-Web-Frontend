<template>
  <div>
    <a-modal
      class="modal"
      v-model="visible"
      title="健康信息"
      @ok="handleOk"
      :width="1150">
      <template v-if="selectReport" slot="footer">
        <a-button @click="closeModel">取消</a-button>
      </template>
      <a-row>
        <a-col :span="5" class="modalLeft">
          <!-- 使用fixed -->
          <div class="modalLeftNav">
            <div class="leftBody" v-for="item in objData.data" :key="item.id">
              <a @click="onSc(item.name)" class="leftTitle">{{ item.name }}</a>
            </div>
            <div>
              <a @click="onSc('用户诊断信息')" key="用户诊断信息" class="leftTitle">用户诊断信息</a>
            </div>
            <div>
              <a @click="onSc('用户症状信息')" key="用户症状信息" class="leftTitle">用户症状信息</a>
            </div>
            <!-- 回到顶部 -->
            <div>
              <a-icon :style="{fontSize: '25px'}" @click="onSc(objData.data[0].name)" type="up-square" theme="filled" />
            </div>
            <!-- 清空 -->
            <div v-if="!selectReport">
              <a-icon @click="clearData()" :style="{fontSize: '25px'}" type="delete" theme="filled" />
            </div>
          </div>
        </a-col>
        <a-col :span="19" ref="modalRight" class="modalRight">
          <a-form-model v-model="objData">
            <div v-for="item in objData.data" :key="item.id">
              <!-- 大标题 -->
              <a-row>
                <a-col>
                  <a :id="item.name" class="rightTitle">{{ item.name }}</a>
                </a-col>
              </a-row>
              <!-- 大标题下的小标题加内容 -->
              <a-row>
                <a-col v-if="!selectReport" class="rightBody" :span="12" v-for="items in item.items" :key="items.id">
                  <a-row>
                    <a-col span="24">
                      <a-form-model-item>
                        <!-- 新建 -->
                        <div v-if="!selectReport">
                          <a-input v-model="items.value" :addonBefore="items.name" :addonAfter="items.unit" style="width: 200px"></a-input>
                          诊断结果:
                          <a-select v-model="items.diaResult" style="width: 130px">
                            <a-select-option v-for="(ranges,index) in items.result" :key="index" :value="ranges.name">
                              {{ ranges.name }}
                            </a-select-option>
                          </a-select>
                        </div>
                        <!-- 查看 -->
                        <a-collapse v-if="!selectReport" style="width: 90%;">
                          <a-collapse-panel header="点击展开">
                            <div>
                              <a class="exTitle">数据拓展:</a>
                              <a v-if="ranges.type === 'range'" style="pointer-events:none;" v-for="(ranges,index) in items.result" :key="index">
                                {{ ranges | getRange }}
                                <!-- {{ ranges }} -->
                              </a>
                            </div>
                            <div>
                              <a class="exTitle">检查方式:</a>
                              {{ items.testMethod }}
                              <a class="exTitle">频率:</a>
                              {{ items.testRate }}
                              <a class="exTitle">检测环境:</a>
                              {{ items.testEnvironment }}
                            </div>
                            <div>备注:{{ items.remark || '无' }}</div>
                          </a-collapse-panel>
                        </a-collapse>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col v-if="selectReport" :span="24" class="rightBody" v-for="items in item.items" :key="items.id">
                  {{ items.name }}: {{ items.value }} {{ items.unit }} 诊断结果: {{ items.diaResult }}
                </a-col>
              </a-row>
              <!-- 选择项目诊断时间 -->
              <a-row>
                <a-col :span="4">
                  <!-- 新建 -->
                  <a-date-picker
                    show-time
                    v-if="!selectReport"
                    v-model="item.testAt"
                    type="date"
                    placeholder="请选择诊断时间"
                    style="width: 100%;"
                  />
                  <div v-if="selectReport">{{ item.testAt | getMoment }}</div>
                </a-col>
              </a-row>
            </div>
            <!-- 用户诊断信息 -->
            <a-row>
              <a-col>
                <a-form-model-item>
                  <a id="用户诊断信息" class="rightTitle">用户诊断信息</a>
                  <!-- 新建 -->
                  <CheckDia v-if="!selectReport" ref="childDia" v-model="objData.diagnosisData" @changes="getDia($event)" />
                  <!-- 查看 -->
                  <div v-if="selectReport">{{ objData.diagnosisData }}</div>
                  <a-row>
                    <a-col :span="4">
                      <a-date-picker
                        show-time
                        v-if="!selectReport"
                        v-model="objData.diagnosisTime"
                        type="date"
                        placeholder="请选择诊断时间"
                        style="width: 100%;"
                      />
                      <div v-if="selectReport">{{ objData.diagnosisTime | getMoment }}</div>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              </a-col>
            </a-row>
            <!-- 用户症状信息 -->
            <a-row>
              <a-col>
                <a-form-model-item>
                  <a-row>
                    <a-col :span="12">
                      <a id="用户症状信息" class="rightTitle">用户症状信息</a>
                      <a-textarea v-if="!selectReport" v-model="objData.symptomData" placeholder="填写用户症状信息" :rows="4" />
                      <div v-if="selectReport">{{ objData.symptomData }}</div>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="4">
                      <a-date-picker
                        show-time
                        v-if="!selectReport"
                        type="date"
                        v-model="objData.symptomTime"
                        placeholder="请选择症状诊断时间"
                        style="width: 100%;"
                      />
                      <div v-if="selectReport">{{ objData.symptomTime | getMoment }}</div>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import CheckDia from '@/components/DiaMsg/CheckDia.vue'
import { getHealthIndex, addHealthReport } from '@/api/health'
import moment from 'moment'
// import { getHealthIndex } from '@/api/health'

export default {
    components: {
      CheckDia
    },
    filters: {
      getRange: function (value) {
        // 范围或数值
        if (value.type === 'range') {
          // 范围
          if (value.end != null && value.start === null) {
            return value.name + '<' + value.end
          } else if (value.end != null && value.start != null) {
            return value.start + '≤' + value.name + '<' + value.end
          } else if (value.end === null && value.start != null) {
            return value.name + '≥' + value.start
          }
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
        this.customerId = cusmId
        // console.log(cusmId, '我是点击新建触发的时间,传入custmoerId')
        this.selectReport = false
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
        const that = this
        console.log('我是点击查看触发,传入的数据', data)
        this.selectReport = true
        console.log('查看objdataval1', this.objData)
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
          // data.projects.forEach(function (val2) {
          //   if (val1.name === val2.indexProjectName) {
          //     val1.items.forEach(function (val3) {
          //       val2.items.forEach(function (val4) {
          //         if (val3.id === val4.healthIndexItem.id) {
          //           val3.value = that.filterHealthData(val4.value)
          //           val3.diaResult = that.filterHealthData(val4.result)
          //         }
          //       })
          //     })
          //     // console.log(val1, '???', val2)
          //     if (val2.testAt) {
          //       val1.testAt = val2.testAt
          //     }
          //   }
          // })
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
      onSc (value) {
        // console.log('11', value)
        document.getElementById(value).scrollIntoView({ behavior: 'smooth' })
      },
      clearData () {
        // console.log('清空')
        this.$nextTick(() => {
          getHealthIndex().then(res => {
          if (res.status === 200) {
            const formdata = res.data
            for (var i = 0; i < formdata.length; i++) {
              formdata[i].testAt = null
              for (var j = 0; j < formdata[i].items.length; j++) {
                formdata[i].items[j].value = null
                formdata[i].items[j].diaResult = null
              }
            }
            this.objData.data = formdata
            // console.log(this.objData.data)
          }
          })
          this.$nextTick(() => {
            this.$refs.childDia.clearDia()
          })
          this.objData.diagnosisData = null
          this.objData.diagnosisTime = null
          this.objData.symptomData = null
          this.objData.symptomTime = null
        })
      },
      // 初始化
      getHealth () {
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
          // console.log(this.objData.data)
        }
      })
      }
    }
}
</script>

<style lang="less" scoped>
/* .modalLeft{
} */
.modalLeftNav{
  position: fixed;
  height: 500px;
  overflow: auto;
  border-radius: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: black;
  text-align: center;
  width: 220px;
}
// .leftBody{
//   border-style: solid;
//   border-width: 1px;
//   border-color: black;
// }
.leftTitle{
  font-size: 20px;
  color: black;
}
.modalRight{
  /* height: 500px; */
  /* overflow: auto; */
  border-radius: 20px;
  padding: 10px;
  border-style: solid;
  border-width: 1px;
  border-color: black;
}
.rightTitle{
  font-size: 20px;
  pointer-events:none;
  color: black;
}
.rightBody{
  /* text-align: center; */
  /* height: 240px; */
  padding: 5px;
}
.exTitle{
  /* font-size: 18px; */
  color: #999;
  pointer-events:none;
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
</style>
