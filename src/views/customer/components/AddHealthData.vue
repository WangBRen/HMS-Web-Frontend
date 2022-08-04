<template>
  <div>
    <a-modal class="modal" v-model="visible" title="健康信息" @ok="handleOk" :width="1200">
      <a-row>
        <a-col :span="5" class="modalLeft">
          <a-row>
            <a-col>
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
                <div>
                  <a @click="onSc(objData.data[0].name)">点击回到顶部</a>
                </div>
                <div>
                  <a-button @click="clearData()">清空</a-button>
                </div>
              </div>
            </a-col>
          </a-row>
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
                <a-col class="rightBody" :span="12" v-for="items in item.items" :key="items.id">
                  <a-row>
                    <a-col span="24">
                      <a-form-model-item>
                        <a-input v-model="items.value" :addonBefore="items.name" :addonAfter="items.unit" style="width: 200px"></a-input>
                        诊断结果:
                        <a-select v-model="items.diaResult" style="width: 150px">
                          <a-select-option v-for="(ranges,index) in items.result" :key="index" :value="ranges.name">
                            {{ ranges.name }}
                          </a-select-option>
                        </a-select>
                        <a-collapse style="width: 90%;">
                          <a-collapse-panel header="点击展开">
                            <div>
                              <a class="exTitle">数据拓展:</a>
                              <a style="pointer-events:none;" v-for="(ranges,index) in items.result" :key="index">
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
              </a-row>
              <!-- 选择诊断时间 -->
              <a-row>
                <a-col :span="4">
                  <a-date-picker
                    v-model="item.testAt"
                    type="date"
                    placeholder="请选择诊断时间"
                    style="width: 100%;"
                  />
                </a-col>
              </a-row>
            </div>
            <!-- 用户诊断信息 -->
            <a-row>
              <a-col>
                <a-form-model-item>
                  <a id="用户诊断信息" class="rightTitle">用户诊断信息</a>
                  <CheckDia ref="childDia" v-model="objData.diagnosisData" @changes="getDia($event)" />
                  <a-row>
                    <a-col :span="4">
                      <a-date-picker
                        v-model="objData.diagnosisTime"
                        type="date"
                        placeholder="请选择诊断时间"
                        style="width: 100%;"
                      />
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
                      <a-textarea v-model="objData.symptomData" placeholder="填写用户症状信息" :rows="4" />
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="4">
                      <a-date-picker
                        type="date"
                        v-model="objData.symptomTime"
                        placeholder="请选择诊断时间"
                        style="width: 100%;"
                      />
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
// import { getHealthIndex } from '@/api/health'

export default {
    components: {
      CheckDia
    },
    filters: {
      getRange: function (value) {
        if (value.type === 'range') {
          if (value.ltUnequal != null && value.gtEqual === null) {
            return value.name + '<' + value.ltUnequal
          } else if (value.ltUnequal != null && value.gtEqual != null) {
            return value.gtEqual + '≤' + value.name + '<' + value.ltUnequal
          } else if (value.ltUnequal === null && value.gtEqual != null) {
            return value.name + '≥' + value.gtEqual
          } else {
            return '1'
          }
        }
      }
    },
    data () {
        return {
            top: 10,
            visible: false,
            customerId: null,
            objData: {
              // item
              data: [
                // {
                //   id: '1',
                //   name: '个人基础信息',
                //   // items
                //   items: [
                //     {
                //       id: '1',
                //       name: '舒张压',
                //       testMethod: '血压仪',
                //       unit: 'mmHg',
                //       remark: '用于筛查是否患有高血压',
                //       // value: null,
                //       range: [
                //         {
                //           name: '低血压',
                //           type: 'range',
                //           value: null,
                //           gtEqual: null,
                //           itUnequal: '60',
                //           unit: 'mmHg',
                //           subRanges: null
                //         },
                //         {
                //           name: '正常血压',
                //           type: 'range',
                //           value: null,
                //           gtEqual: '60',
                //           itUnequal: '80',
                //           unit: 'mmHg',
                //           subRanges: null
                //         },
                //         {
                //           name: '正常高值',
                //           type: 'range',
                //           value: null,
                //           gtEqual: '80',
                //           itUnequal: '89',
                //           unit: 'mmHg',
                //           subRanges: null
                //         },
                //         {
                //           name: '一级高血压',
                //           type: 'range',
                //           value: null,
                //           gtEqual: '90',
                //           itUnequal: '99',
                //           unit: 'mmHg',
                //           subRanges: null
                //         },
                //         {
                //           name: '二级高血压',
                //           type: 'range',
                //           value: null,
                //           gtEqual: '100',
                //           itUnequal: '109',
                //           unit: 'mmHg',
                //           subRanges: null
                //         },
                //         {
                //           name: '三级高血压',
                //           type: 'range',
                //           value: null,
                //           gtEqual: '110',
                //           itUnequal: null,
                //           unit: 'mmHg',
                //           subRanges: null
                //         }
                //       ],
                //       testEnvironment: '家庭/社区/体检',
                //       testRate: '3次非同日'
                //     },
                //     {
                //       id: '2',
                //       name: '收缩压',
                //       testMethod: '血压仪',
                //       unit: 'mmHg',
                //       remark: '用于筛查是否患有高血压',
                //       range: [
                //         {
                //           name: '低血压',
                //           type: 'range',
                //           value: null,
                //           gtEqual: null,
                //           itUnequal: '90',
                //           unit: 'mmHg',
                //           subRanges: null
                //         },
                //         {
                //           name: '正常血压',
                //           type: 'range',
                //           value: null,
                //           gtEqual: '90',
                //           itUnequal: '119',
                //           unit: 'mmHg',
                //           subRanges: null
                //         },
                //         {
                //           name: '正常高值',
                //           type: 'range',
                //           value: null,
                //           gtEqual: '120',
                //           itUnequal: '139',
                //           unit: 'mmHg',
                //           subRanges: null
                //         }
                //       ],
                //       testEnvironment: '家庭/社区/体检',
                //       testRate: '3次非同日'
                //     },
                //     {
                //       id: '3',
                //       name: '心率',
                //       testMethod: '智能穿戴,心电图机',
                //       unit: '次/min',
                //       range: [
                //         {
                //           name: '心动过缓',
                //           type: 'range',
                //           value: null,
                //           gtEqual: null,
                //           itUnequal: '60',
                //           unit: '次/min',
                //           subRanges: null
                //         },
                //         {
                //           name: '正常',
                //           type: 'range',
                //           value: null,
                //           gtEqual: '60',
                //           itUnequal: '100',
                //           unit: '次/min',
                //           subRanges: null
                //         },
                //         {
                //           name: '心动过速',
                //           type: 'range',
                //           value: null,
                //           gtEqual: '100',
                //           itUnequal: null,
                //           unit: '次/min',
                //           subRanges: null
                //         }
                //       ],
                //       testEnvironment: '家庭/社区/体检',
                //       testRate: null
                //     },
                //     {
                //       id: '4',
                //       name: '收缩压',
                //       testMethod: '血压仪',
                //       unit: 'mmHg',
                //       range: [
                //         {
                //           name: '低血压'
                //         }
                //       ],
                //       testEnvironment: '家庭/社区/体检',
                //       testRate: '3次非同日'
                //     }
                //   ]
                // },
                // {
                //   id: '2',
                //   name: '内科',
                //   items: [
                //     {
                //       id: '1',
                //       name: '舒张压',
                //       testMethod: '血压仪',
                //       unit: 'mmHg',
                //       range: [
                //         {
                //           name: '低血压'
                //         }
                //       ],
                //       testEnvironment: '家庭/社区/体检',
                //       testRate: '3次非同日'
                //     },
                //     {
                //       id: '2',
                //       name: '收缩压',
                //       testMethod: '血压仪',
                //       unit: 'mmHg',
                //       range: [
                //         {
                //           name: '低血压'
                //         }
                //       ],
                //       testEnvironment: '家庭/社区/体检',
                //       testRate: '3次非同日'
                //     }
                //   ]
                // },
                // {
                //   id: '3',
                //   name: '外科+肛门指诊',
                //   items: [
                //     {
                //       id: '1',
                //       name: '舒张压',
                //       testMethod: '血压仪',
                //       unit: 'mmHg',
                //       range: [
                //         {
                //           name: '低血压'
                //         }
                //       ],
                //       testEnvironment: '家庭/社区/体检',
                //       testRate: '3次非同日'
                //     },
                //     {
                //       id: '2',
                //       name: '收缩压',
                //       testMethod: '血压仪',
                //       unit: 'mmHg',
                //       range: [
                //         {
                //           name: '低血压'
                //         }
                //       ],
                //       testEnvironment: '家庭/社区/体检',
                //       testRate: '3次非同日'
                //     }
                //   ]
                // },
                // {
                //   id: '4',
                //   name: '外科+肛门指诊',
                //   items: []
                // },
                // {
                //   id: '5',
                //   name: '外科+肛门指诊',
                //   items: []
                // },
                // {
                //   id: '6',
                //   name: '外科+肛门指诊',
                //   items: []
                // },
                // {
                //   id: '7',
                //   name: '外科+肛门指诊',
                //   items: []
                // },
                // {
                //   id: '8',
                //   name: '外科+肛门指诊',
                //   items: []
                // },
                // {
                //   id: '9',
                //   name: '外科+肛门指诊',
                //   items: []
                // },
                // {
                //   id: '10',
                //   name: '外科+肛门指诊',
                //   items: []
                // },
                // {
                //   id: '11',
                //   name: '外科+肛门指诊',
                //   items: []
                // },
                // {
                //   id: '12',
                //   name: '外科+肛门指诊',
                //   items: []
                // }
              ],
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
          console.log(this.objData.data)
        }
      })
    },
    methods: {
      // 保存五级联动的诊断结果
      getDia (value) {
        this.objData.diagnosisData = value
        console.log('我是诊断结果', value)
      },
      openModel () {
        this.visible = true
      },
      // 新建触发事件
      AddHealthCom (cusmId) {
        this.customerId = cusmId
        const csid = 7
        // 如果cusmid不一样则清空已填写的表单
        if (cusmId === csid) {
          console.log('不清空')
        } else {
          this.$nextTick(() => {
            this.clearData()
          })
          console.log('清空')
        }
        console.log('我是点击新建触发的时间,传入custmoerId', this.customerId)
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
        console.log('表格数据', formData)
        console.log('传回接口数据', apiData)
        addHealthReport(customerId, apiData).then(res => {
          if (res.status === 201) {
            console.log('成功新建报告单')
            this.$message.info('成功新建报告单')
            this.visible = false
          }
        })
      },
      onSc (value) {
        console.log('11', value)
        document.getElementById(value).scrollIntoView({ behavior: 'smooth' })
      },
      clearData () {
        // console.log('清空')
        getHealthIndex().then(res => {
        if (res.status === 200) {
          const formdata = res.data
          for (var i = 0; i < formdata.length; i++) {
            for (var j = 0; j < formdata[i].items.length; j++) {
              formdata[i].items[j].value = null
              formdata[i].items[j].diaResult = null
            }
          }
          this.objData.data = formdata
          console.log(this.objData.data)
        }
        })
        this.$refs.childDia.clearDia()
        this.objData.diagnosisData = null
        this.objData.diagnosisTime = null
        this.objData.symptomData = null
        this.objData.symptomTime = null
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
