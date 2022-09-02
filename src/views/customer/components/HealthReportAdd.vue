<template>
  <div>
    <a-modal
      forceRender
      v-model="addReportVisible"
      title="健康信息"
      @ok="handleOk"
      @cancel="closeAddModal"
      :width="1150"
    >
      <div v-for="items in formData.indexArr" :key="items.id">
        <div v-if="items.indexId !== '用户症状信息' && items.indexId !== '用户诊断信息' ">
          <a-row>
            <a-col>
              <a-form-model :model="formData">
                <a-form-model-item>
                  <a-row class="project-header">
                    <a-col :span="5">
                      <a class="project-title">{{ items.indexId }}</a>
                      <!-- <a-icon class="targetIcon" @click="delIndex(items)" type="close" /> -->
                    </a-col>
                    <a-col :span="1" :offset="18">
                      <a-icon class="targetIcon" @click="delIndex(items)" type="close" />
                    </a-col>
                  </a-row>
                  <a-row v-for="item in items.indexArr" :key="item.id">
                    <a-col>
                      <a-row>
                        <a-col :span="4">
                          <div class="index-item-title-wrapper">
                            <div class="index-item-title-sider"/>
                            <span class="index-item-title"> {{ item.name }} </span>
                          </div>
                        </a-col>
                        <a-col :span="6">
                          <a-input @change="e => { item.value = e.target.value }" :addonAfter="item.unit"></a-input>
                        </a-col>
                        <a-col :span="2" :offset="2"><span>诊断结果:</span></a-col>
                        <a-col :span="8">
                          <a-select @change="e => { item.diaResult = e }">
                            <a-select-option v-for="result in item.result" :key="result.id" :value="result.name">
                              {{ result.name }}
                            </a-select-option>
                          </a-select>
                        </a-col>
                      </a-row>
                    </a-col>
                    <a-col>
                      <a-row>
                        <a-col style="margin-left: 550px; line-height: 20px;">
                          <a :id="'str'+item.id" style="line-height: 20px;" @click="showInput(item.id)">展开</a>
                          <div :id="item.id" style="display: none;">
                            <div style="padding-top:12px; display: flex;line-height: 20px;">
                              <div class="exTitle" style="margin-right: 4px;">参考结果:</div>
                              <div style="color: #00a0e9">
                                <span style="pointer-events:none;display:block;" v-for="(ranges,index) in item.result" :key="index">
                                  {{ ranges | getRange }}
                                  <span style="margin-left: 6px; color: #999"> ({{ ranges.unit }}) </span>
                                </span>
                              </div>
                            </div>
                            <div><a class="exTitle">检查方式:</a>{{ item.testMethod }}</div>
                            <div><a class="exTitle">建议频率:</a>{{ item.testRateValue + '次/' + item.testRateUnit }}</div>
                            <div><a class="exTitle">检测环境:</a>{{ item.testEnvironment }}</div>
                            <div><span class="exTitle">备注:</span>{{ item.remark || '无' }}</div>
                          </div>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              </a-form-model>
            </a-col>
          </a-row>
          <a-row style="margin-bottom: 36px;">
            <a-col :span="6" offset="18">
              <span>检测时间:</span>
              <span style="float: right;">
                <a-date-picker
                  show-time
                  v-model="items.testAt"
                  type="date"
                  placeholder="请选择检测时间"
                />
              </span>
            </a-col>
          </a-row>
        </div>
        <div v-if="items.indexId === '用户诊断信息'">
          <a-row class="project-header">
            <a-col>
              <a-col :span="5">
                <a id="用户诊断信息" class="project-title">用户诊断信息</a>
              </a-col>
              <a-col :span="1" :offset="18">
                <a-icon class="targetIcon" @click="delIndex(items)" type="close" />
              </a-col>
            </a-col>
          </a-row>
          <a-row style="padding-top: 12px; padding-bottom: 12px;">
            <a-col>
              <a-row>
                <a-col :span="3">
                  <div class="index-item-title-wrapper">
                    <div class="index-item-title-sider"/>
                    <span class="index-item-title"> 诊断结果 </span>
                  </div>
                </a-col>
                <a-col :span="21">
                  <div>
                    <CheckDia ref="childDia" v-model="formData.diagnosisData" @changes="getDia($event)" />
                  </div>
                </a-col>
              </a-row>
              <a-row style="margin-bottom: 12px;">
                <a-col :span="2" :offset="18">
                  <span>
                    诊断时间:
                  </span>
                </a-col>
                <a-col :span="4">
                  <span style="float: right;">
                    <a-date-picker
                      show-time
                      v-model="formData.diagnosisTime"
                      type="date"
                      placeholder="请选择诊断时间"
                    />
                  </span>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
        <div v-if="items.indexId === '用户症状信息'">
          <a-row class="project-header">
            <a-col :span="5">
              <a id="用户症状信息" class="project-title">用户症状信息</a>
            </a-col>
            <a-col :span="1" :offset="18">
              <a-icon class="targetIcon" @click="delIndex(items)" type="close" />
            </a-col>
          </a-row>
          <a-row style="padding-top: 12px; padding-bottom: 12px;">
            <a-col>
              <a-row>
                <a-col :span="3">
                  <div class="index-item-title-wrapper">
                    <div class="index-item-title-sider"/>
                    <span class="index-item-title"> 症状 </span>

                  </div>
                </a-col>
                <a-col :span="21">
                  <a-textarea v-model="formData.symptomData" placeholder="填写用户症状信息" :rows="4" />
                </a-col>
              </a-row>
              <a-row style="margin-top:12px;margin-bottom: 12px;">
                <a-col :span="2" :offset="18">
                  <span>
                    诊断时间:
                  </span>
                </a-col>
                <a-col :span="4">
                  <span style="float: right;">
                    <a-date-picker
                      show-time
                      v-model="formData.symptomTime"
                      type="date"
                      placeholder="请选择诊断时间"
                    />
                  </span>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </div>
      <a-row>
        <a-col style="text-align:center">
          <a-button @click="openIndexModal" type="dashed" style="width: 30%">
            <a-icon type="plus" /> 添加指标
          </a-button>
          <a-button @click="delIndexEnd" type="dashed" style="width: 30%">
            <a-icon type="plus" /> 删除指标
          </a-button>
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      forceRender
      v-model="addIndexVisible"
      @cancel="closeIndexModal"
      :width="900"
      title="报告类型"
    >
      <template slot="footer">
        <a-button @click="closeIndexModal">取消</a-button>
      </template>
      <div>
        <!-- <div style="height: 300px;" v-for="item in filterHealthIndexData" :key="item.name">
          <a-button class="indexButton" @click="checkIndex(item.name)">
            {{ item.name }}
          </a-button>
        </div> -->
        <a-row>
          <a-col :span="12" class="indexCol" v-for="item in filterHealthIndexData" :key="item.name">
            <a-button class="indexButton" @click="checkIndex(item.name)">
              {{ item.name }}
            </a-button>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getHealthIndex, addHealthReport } from '@/api/health'
// import { getHealthIndex } from '@/api/health'
import CheckDia from '@/components/DiaMsg/CheckDia.vue'
export default {
    components: {
        CheckDia
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
            healthIndexData: [],
            filterHealthIndexData: [],
            formData: {
                indexArr: [],
                diagnosisData: null, // 诊断信息
                diagnosisTime: null, // 诊断时间
                symptomData: null, // 症状信息
                symptomTime: null // 症状时间
            },
            apiData: {
                projects: []
            },
            customerId: null,
            addReportVisible: false,
            addIndexVisible: false,
            labelCol: { span: 4 },
            wrapperCol: { span: 16 }
        }
    },
    mounted () {
        getHealthIndex().then(res => {
            if (res.status === 200) {
                const healthIndexData = res.data
                const x = { name: '用户诊断信息', items: [] }
                const y = { name: '用户症状信息', items: [] }
                healthIndexData.push(x, y)
                this.healthIndexData = JSON.parse(JSON.stringify(healthIndexData))
                this.filterHealthIndexData = JSON.parse(JSON.stringify(healthIndexData))
                console.log('指标', this.healthIndexData)
            }
        })
    },
    methods: {
        handleOk () {
            // console.log('确定', this.formData)
            const apiData = this.apiData
            const formData = this.formData
            const customerId = this.customerId
            apiData.projects.length = 0
            if (formData.indexArr.length !== 0) {
                formData.indexArr.forEach(function (val) {
                    if (val.indexId !== '用户诊断信息' && val.indexId !== '用户症状信息') {
                        const x = { indexProjectName: null, items: [], testAt: null }
                        x.indexProjectName = val.indexId
                        x.testAt = val.testAt
                        val.indexArr.forEach(function (val2) {
                            if (val.testAt != null) {
                                if (val2.value != null) {
                                    const y = { indexId: val2.id, value: val2.value, result: val2.diaResult }
                                    x.items.push(y)
                                }
                                // const y = { indexId: val2.id, value: val2.value, result: val2.diaResult }
                                // x.items.push(y)
                            }
                            // if (val2.value != null) {
                            //     const y = { indexId: val2.id, value: val2.value, result: val2.diaResult }
                            //     x.items.push(y)
                            // }
                        })
                        apiData.projects.push(x)
                    }
                // const x = { indexProjectName: null, items: [], testAt: null }
                // x.indexProjectName = val.indexId
                // x.testAt = val.testAt
                // val.indexArr.forEach(function (val2) {
                //     if (val2.value != null) {
                //         const y = { indexId: val2.id, value: val2.value, result: val2.diaResult }
                //         x.items.push(y)
                //     }
                // })
                // apiData.projects.push(x)
                })
                apiData.diseaseId = formData.diagnosisData
                apiData.diseaseAt = formData.diagnosisTime
                apiData.symptom = formData.symptomData
                apiData.symptomAt = formData.symptomTime
                addHealthReport(customerId, apiData).then(res => {
                    if (res.status === 201) {
                        this.$message.info('成功新建报告单')
                        this.addReportVisible = false
                    }
                })
            } else {
                this.$message.error('请选择指标')
                // console.log('为空')
            }
            console.log('formData', formData)
            console.log(customerId, 'apiData', apiData)
        },
        openAddModal () {
            this.addReportVisible = true
            this.formData.indexArr.length = 0
            this.formData.diagnosisData = null
            this.formData.diagnosisTime = null
            this.formData.symptomData = null
            this.formData.symptomTime = null
            // this.$nextTick(() => {
            //     this.$refs.childDia.clearDia()
            // })
        },
        openADDmodalCustId (cusmId) {
            this.customerId = cusmId
            console.log(cusmId, '我是点击新建触发的时间,传入custmoerId')
        },
        closeAddModal () {
            this.addReportVisible = false
        },
        filterOption (value, option) {
            return option.componentOptions.children[0].text.indexOf(value) >= 0
        },
        addIndex () {
            // console.log('增加')
            const item = {
                id: new Date().getTime(),
                indexId: null,
                indexArr: [],
                testAt: null
            }
            this.formData.indexArr.push(item)
            console.log(this.formData)
        },
        checkIndex (indexId) {
            const healthIndexData = this.healthIndexData
            for (let i = 0; i < healthIndexData.length; i++) {
                if (healthIndexData[i].name === indexId) {
                    const item = {
                        id: new Date().getTime(),
                        indexId: indexId,
                        indexArr: [],
                        testAt: null
                    }
                    item.indexArr = healthIndexData[i].items
                    for (let j = 0; j < item.indexArr.length; j++) {
                        item.indexArr[j].value = null
                        item.indexArr[j].diaResult = null
                        item.indexArr[j].showIndex = false
                    }
                    // 选择后添加到表单中
                    this.formData.indexArr.push(item)
                }
            }
            this.addIndexVisible = false
            console.log(this.formData)
            // healthIndexData.sort((a, b) => {
            //     return a.name.length - b.name.length
            // })
            console.log('healthIndexData', healthIndexData)
        },
        delIndex (item) {
            console.log('删除', item)
            this.formData.indexArr = this.formData.indexArr.filter(i => i.id !== item.id)
        },
        delIndexEnd () {
            this.formData.indexArr.pop()
        },
        selectChange (indexId, items) {
            console.log(indexId, '选择', items)
            const healthIndexData = this.healthIndexData
            for (let i = 0; i < healthIndexData.length; i++) {
                if (healthIndexData[i].name === indexId) {
                    items.indexArr = healthIndexData[i].items
                    for (let j = 0; j < items.indexArr.length; j++) {
                        items.indexArr[j].value = null
                        items.indexArr[j].diaResult = null
                        items.indexArr[j].showIndex = false
                    }
                }
            }
        },
        showInput (data) {
            if (document.getElementById('str' + data).innerHTML === '展开') {
                document.getElementById(data).style.display = 'block'
                document.getElementById('str' + data).innerHTML = '收起'
            } else {
                document.getElementById(data).style.display = 'none'
                document.getElementById('str' + data).innerHTML = '展开'
            }
        },
        // 保存五级联动的诊断结果
        getDia (value) {
            this.formData.diagnosisData = value
            // console.log('我是诊断结果', value)
        },
        openIndexModal () {
            var healthIndexData = JSON.parse(JSON.stringify(this.healthIndexData))
            for (var i = 0; i < this.formData.indexArr.length; i++) {
                healthIndexData = healthIndexData.filter(item => item.name !== this.formData.indexArr[i].indexId)
            }
            this.filterHealthIndexData = healthIndexData
            this.addIndexVisible = true
        },
        closeIndexModal () {
            this.addIndexVisible = false
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
.project-header {
  background: linear-gradient(to bottom right, #00a0e9, #00abb9);
  padding: 0 14px;
  color: white;
  border-radius: 2px;
  border-color: none;
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
  line-height: 14px;
}
.index-item-title-sider {
  width: 8px;
  height: 24px;
  background: #00a0e9;
}
.project-title{
  font-size: 18px;
  pointer-events: none;
  height: 48px;
  line-height: 48px;
  color: white;
  font-weight: 700;
}
.targetIcon{
    text-align: center;
    line-height: 48px;
}
.indexCol {
    padding: 0 60px;
    margin-bottom: 12px;
}
.indexButton {
    width: 100%;
    /* margin: 5px; */
    border-style: dashed;
    background-color: #fdfdfd;
}
</style>
