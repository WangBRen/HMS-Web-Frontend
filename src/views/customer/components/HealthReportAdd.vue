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
                    <a-col :span="15">
                      <a class="project-title">{{ items.indexId }}</a>
                      <!-- <a-icon class="targetIcon" @click="delIndex(items)" type="close" /> -->
                    </a-col>
                    <a-col :span="1" :offset="8">
                      <a-icon class="targetIcon" @click="delIndex(items)" type="close" />
                    </a-col>
                  </a-row>
                  <div style="padding:10px 30px; background-color: #f0f0f0;">
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
                            <!-- 整数或小数 -->
                            <a-input v-if="item.type === 'Integer' || item.type === 'Float'" @change="e => { item.value = e.target.value }" :addonAfter="item.unit" @blur="handleBlur(item)"></a-input>
                            <!-- 主观文本 -->
                            <a-textarea v-if="item.type === 'Text'" v-model="item.value" :rows="2" />
                            <!-- 图文报告 -->
                            <a-upload
                              v-if="item.type === 'Report'"
                              v-model="item.value"
                              name="file"
                              :multiple="false"
                              :action="'https://dev.hms.yootane.com/api/files/upload/file?watermark=yootane-' + userInfo.name + '-' + userInfo.customerId"
                              @change="value => handleChange(value, item)"
                            >
                              <a-button> <a-icon type="upload" />上传报告</a-button>
                            </a-upload>
                          </a-col>
                          <a-col :span="2" :offset="2"><span>诊断结果:</span></a-col>
                          <a-col :span="8">
                            <a-textarea placeholder="请输入诊断结果" :auto-size="{ minRows: 2, maxRows: 6 }" v-if="(item.result.length === 0)"/>
                            <a-select v-else @change="changeResult" v-model="item.diaResult">
                              <a-select-option v-for="result in item.result" :key="result.id" :value="result.name">
                                {{ result.name }}
                              </a-select-option>
                            </a-select>
                          </a-col>
                        </a-row>
                      </a-col>
                      <a-col>
                        <a-row>
                          <a-col :span="10">
                            <span v-if="item.conditions.length > 0">
                              <span v-for="conditions in item.conditions" :key="conditions.id" style="margin-left: 20px;">
                                {{ conditions.name }}:
                                <a-radio-group button-style="solid" @change="value => onChangeCondition(value, conditions, item)" size="small">
                                  <a-radio-button v-for="condition in conditions.options" :key="condition.id" :value="condition.name">{{ condition.name }}</a-radio-button>
                                </a-radio-group>
                              </span>
                            </span>
                          </a-col>
                          <a-col :span="2"></a-col>
                          <a-col :span="12" style=" line-height: 20px;">
                            <a-row>
                              <a-col :span="4">
                              </a-col>
                              <a-col :span="14" style="color:#999;margin-bottom:10px;">
                                参考范围：【<span>{{ item.min }}-{{ item.max }}</span>】
                              </a-col>
                              <a-col :span="2">
                                <a :id="'str'+item.id" style="line-height: 20px;" @click="showInput(item.id)">展开</a>
                              </a-col>
                            </a-row>
                            <a-row>
                              <a-col :span="4"></a-col>
                              <a-col :span="20">
                                <div :id="item.id" style="display: none;">
                                  <div style="padding-top:12px; display: flex;line-height: 20px;">
                                    <div class="exTitle" style="margin-right: 4px;">参考结果:</div>
                                    <div style="color: #00a0e9">
                                      <span style="pointer-events:none;display:block;" v-for="(ranges,index) in item.result" :key="index">
                                        <!-- 显示参考结果的条件，如性别、年龄 -->
                                        <a-tag v-for="condition in ranges.conditionFilters" :key="condition.conditionId">
                                          <span v-for="conditionItem in item.conditions" :key="conditionItem.id">
                                            <template v-if="(conditionItem.id === condition.conditionId)">
                                              <span v-for="i in conditionItem.options" :key="i.id">
                                                <span v-if="(i.id === condition.optionId)">{{ i.name }}</span>
                                              </span>
                                            </template>
                                          </span>
                                        </a-tag>
                                        <!-- {{ ranges }} -->
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
                      </a-col>
                    </a-row>
                  </div>
                </a-form-model-item>
              </a-form-model>
            </a-col>
          </a-row>
          <a-row style="margin-bottom: 36px;">
            <a-col :span="6" offset="18">
              <span style="line-height:32px">检测时间:</span>
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
          <a-row>
            <a-col>
              <div style="padding:20px 30px; background-color: #f0f0f0;">
                <a-row>
                  <a-col :span="3">
                    <div class="index-item-title-wrapper">
                      <div class="index-item-title-sider"/>
                      <span class="index-item-title"> 诊断结果 </span>
                    </div>
                  </a-col>
                  <a-col :span="21">
                    <div>
                      <CheckDia v-model="formData.diagnosisData" @changes="getDia($event)" />
                    </div>
                  </a-col>
                </a-row>
                <div class="index-item-title" style="margin:16px 700px 0 8px;">
                  上传诊断文件：
                  <a-upload
                    name="file"
                    :multiple="true"
                    :action="'https://dev.hms.yootane.com/api/files/upload/file?watermark=yootane-' + userInfo.name + '-' + customerId"
                    :default-file-list="defaultFileList"
                    @change="value => handleUpload(value, formData)"
                  >
                    <a-button> <a-icon type="upload" />点击上传</a-button>
                  </a-upload>
                </div>
              </div>
              <a-row style="margin:18px 0 36px 0;">
                <a-col :span="2" :offset="18">
                  <span style="line-height:32px">
                    诊断时间:
                  </span>
                </a-col>
                <a-col :span="4">
                  <span style="float: right;">
                    <a-date-picker
                      show-time
                      @change="e => {formData.diagnosisTime = e}"
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
          <a-row>
            <a-col>
              <div style="padding:20px 30px; background-color: #f0f0f0;">
                <a-row>
                  <a-col :span="3">
                    <div class="index-item-title-wrapper">
                      <div class="index-item-title-sider"/>
                      <span class="index-item-title"> 症状 </span>
                    </div>
                  </a-col>
                  <a-col :span="21">
                    <!-- <a-textarea v-model="formData.symptomData" placeholder="填写用户症状信息" :rows="4" /> -->
                    <!-- <a-select mode="tags" style="width: 100%;" placeholder="请输入症状，按回车确认" @change="handleChangeSymptom">
                      <a-select-option v-for="i in symptomData2" :key="i.name">
                        {{ i.name }}
                      </a-select-option>
                    </a-select> -->
                    <Symptom v-model="formData.symptomData" @changeSymptom="getSymptom($event)"/>
                    <!-- <span v-for="symptom in symptomData2" :key="symptom">【{{ symptom.name }}】</span> -->
                  </a-col>
                </a-row>
              </div>
              <a-row style="margin:18px 0 36px 0;">
                <a-col :span="2" :offset="18">
                  <span style="line-height:32px">
                    诊断时间:
                  </span>
                </a-col>
                <a-col :span="4">
                  <span style="float: right;">
                    <a-date-picker
                      show-time
                      @change="e => {formData.symptomTime = e}"
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
            <a-icon type="minus" /> 删除指标
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
        <a-row>
          <a-col :span="12" class="indexCol" v-for="item in filterHealthIndexData" :key="item.name">
            <a-button class="indexButton special_index" @click="checkIndex(item.name)" v-if="item.name === '用户诊断信息' || item.name === '用户症状信息'">
              {{ item.name }}
            </a-button>
            <a-button class="indexButton" @click="checkIndex(item.name)" v-else>
              {{ item.name }}
            </a-button>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getHealthIndex, addHealthReport, analysisChronicDisease as apiAnalysisChronicDisease } from '@/api/health'
// import { getHealthIndex } from '@/api/health'
import CheckDia from '@/components/DiaMsg/CheckDia.vue'
import Symptom from '@/components/DiaMsg/UserSymptom.vue'
// import symptom from '@/components/DiaMsg/symptom.json'
export default {
    components: {
        CheckDia,
        Symptom
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
            userInfo: [],
            healthIndexData: [], // 保存所有的指标项
            filterHealthIndexData: [], // 过滤选择后的所有指标项
            formData: {
                indexArr: [] // 用于保存添加的指标项
                // diagnosisData: null, // 诊断信息
                // diagnosisTime: null, // 诊断时间
                // symptomData: null, // 症状信息
                // symptomTime: null // 症状时间
            },
            apiData: {
                projects: []
            },
            customerId: null,
            addReportVisible: false,
            addIndexVisible: false,
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
            defaultFileList: []
            // symptomData2: symptom
        }
    },
    mounted () {
        // 初始化时，获取所有的指标项
        getHealthIndex().then(res => {
            if (res.status === 200) {
                const healthIndexData = res.data
                // 添加两个独立的指标项目
                const x = { name: '用户诊断信息', items: [] }
                const y = { name: '用户症状信息', items: [] }
                healthIndexData.push(x, y)
                this.healthIndexData = JSON.parse(JSON.stringify(healthIndexData))
                this.filterHealthIndexData = JSON.parse(JSON.stringify(healthIndexData))
                // console.log('所有的指标', this.healthIndexData)
            }
        })
    },
    methods: {
        handleOk () {
            var apiData = this.apiData
            // const apiData = { projects: [] }
            const formData = this.formData
            const that = this
            var indexItem = 0
            const customerId = this.customerId
            // apiData.projects.length = 0
            apiData = {
              projects: []
            }
            if (formData.indexArr.length !== 0) {
                formData.indexArr.forEach(function (val) {
                    if (val.indexId !== '用户诊断信息' && val.indexId !== '用户症状信息') {
                        if (val.testAt !== null) {
                            const x = { indexProjectName: null, items: [], testAt: null }
                            x.indexProjectName = val.indexId
                            x.testAt = val.testAt
                            val.indexArr.forEach(function (val2) {
                                if (val.testAt != null) {
                                    if (val2.value != null && val2.value !== '') {
                                        const y = { indexId: val2.id, value: val2.value, result: val2.diaResult }
                                        x.items.push(y)
                                    }
                                }
                            })
                            apiData.projects.push(x)
                            indexItem = indexItem + 1
                        } else {
                            that.$message.error(val.indexId + '检测时间未填写')
                        }
                    }
                })
                // 诊断信息
                if (formData.diagnosisData !== null && formData.diagnosisTime === null) {
                  // console.log(formData)
                  this.$message.error('用户诊断信息检测时间未填写')
                } else if (formData.diagnosisData === null && formData.diagnosisTime !== null) {
                  // console.log(formData)
                  this.$message.error('用户诊断信息诊断结果未填写')
                } else if (formData.diagnosisData && formData.diagnosisTime) {
                  apiData.diseaseId = formData.diagnosisData
                  apiData.diseaseAt = formData.diagnosisTime
                  apiData.diseaseFiles = formData.diseaseFiles
                  indexItem = indexItem + 1
                } else if (formData.diagnosisData === null && formData.diagnosisTime === null) {
                  // console.log(formData)
                  this.$message.error('用户症状信息检测时间未填写')
                }
                // 症状信息
                if (formData.symptomData !== null && formData.symptomTime === null) {
                  // console.log(formData)
                  this.$message.error('用户症状信息检测时间未填写')
                } else if ((formData.symptomData === null || formData.symptomData === '') && formData.symptomTime !== null) {
                  // console.log(formData)
                  this.$message.error('用户症状信息未填写')
                } else if (formData.symptomData && formData.symptomTime) {
                  apiData.symptom = formData.symptomData
                  apiData.symptomAt = formData.symptomTime
                  indexItem = indexItem + 1
                } else if (formData.symptomData === null && formData.symptomTime === null) {
                  // console.log(formData)
                  this.$message.error('用户症状信息检测时间未填写')
                }
                // console.log(indexItem, 'apiData', apiData)
                if (indexItem === formData.indexArr.length) {
                  // console.log('apiData', apiData, 'formData', formData)
                  // 调接口创建报告单
                  addHealthReport(customerId, apiData).then(res => {
                    if (res.status === 201) {
                      apiAnalysisChronicDisease(customerId).then(res => {
                        if (res.status === 200) {
                          this.$message.info('判断慢病成功')
                          // console.log('111')
                        } else {
                          this.$message.error(res.message)
                        }
                      })
                      this.$message.info('成功新建报告单')
                      this.addReportVisible = false
                      this.$emit('successCreatReport')
                    } else {
                      this.$message.error(res.message)
                    }
                  })
                }
                // console.log('apiData', apiData, 'formData', formData)
            } else {
                this.$message.error('请添加指标')
            }
        },
        openAddModal (userInfo) {
            this.addReportVisible = true
            this.userInfo = userInfo.member.baseInfo
            // this.formData.indexArr.length = 0
            this.formData = {
              indexArr: []
            }
            // this.formData.diagnosisData = null
            // this.formData.diagnosisTime = null
            // this.formData.symptomData = null
            // this.formData.symptomTime = null
            // this.$nextTick(() => {
            //     this.$refs.childDia.clearDia()
            // })
        },
        openADDmodalCustId (cusmId) {
            this.customerId = cusmId
            // console.log(cusmId, '我是点击新建触发的时间,传入custmoerId')
        },
        closeAddModal () {
            this.addReportVisible = false
        },
        filterOption (value, option) {
            return option.componentOptions.children[0].text.indexOf(value) >= 0
        },
        checkIndex (indexId) {
            const healthIndexData = this.healthIndexData
            for (let i = 0; i < healthIndexData.length; i++) {
                if (healthIndexData[i].name === indexId) {
                    if (healthIndexData[i].name === '用户诊断信息') {
                      this.formData.diagnosisData = null
                      this.formData.diagnosisTime = null
                    }
                    if (healthIndexData[i].name === '用户症状信息') {
                      this.formData.symptomData = null
                      this.formData.symptomTime = null
                    }
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
            // console.log('formData', this.formData)
            // healthIndexData.sort((a, b) => {
            //     return a.name.length - b.name.length
            // })
            // console.log('healthIndexData', healthIndexData)
        },
        delIndex (item) {
            // console.log('删除', item)
            if (item.indexId === '用户诊断信息') {
              delete this.formData.diagnosisData
              delete this.formData.diagnosisTime
              // this.formData.diagnosisData = null
              // this.formData.diagnosisTime = null
            }
            if (item.indexId === '用户症状信息') {
              delete this.formData.symptomData
              delete this.formData.symptomTime
              // this.formData.symptomData = null
              // this.formData.symptomTime = null
            }
            this.formData.indexArr = this.formData.indexArr.filter(i => i.id !== item.id)
        },
        delIndexEnd () {
            if (this.formData.indexArr[this.formData.indexArr.length - 1].indexId === '用户诊断信息') {
              delete this.formData.diagnosisData
              delete this.formData.diagnosisTime
                // this.formData.diagnosisData = null
                // this.formData.diagnosisTime = null
            }
            if (this.formData.indexArr[this.formData.indexArr.length - 1].indexId === '用户症状信息') {
              delete this.formData.symptomData
              delete this.formData.symptomTime
              // this.formData.symptomData = null
              // this.formData.symptomTime = null
            }
            this.formData.indexArr.pop()
        },
        selectChange (indexId, items) {
            // console.log(indexId, '选择', items)
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
        getSymptom (value) {
          this.formData.symptomData = value
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
        },
        // 文件上传
        handleChange (info, item) {
          if (info.file.status === 'uploading') {
          }
          // 上传成功
          if (info.file.status === 'done') {
            if (info.fileList.length > 1) {
              // console.log('删除')
              info.fileList.shift()
            }
            const itemArr = []
            for (var i = 0; i < info.fileList.length; i++) {
              // console.log('需要的', info.fileList[i].response.data)
              itemArr.push(info.fileList[i].response.data)
            }
            item.value = JSON.stringify(itemArr)
            this.$message.success(`文件上传成功`)
          } else if (info.file.status === 'error') {
            if (info.fileList.length > 1) {
              // console.log('删除')
              info.fileList.shift()
            }
            this.$message.error(`文件上传失败`)
          } else if (info.file.status === 'removed') {
            if (info.fileList.length > 1) {
              // console.log('删除')
              info.fileList.shift()
            }
            item.value = null
            // console.log(info.fileList)
            // const itemArr = []
            // for (var j = 0; j < info.fileList.length; j++) {
            //   itemArr.push(info.fileList[j].response.data)
            // }
            // item.value = JSON.stringify(itemArr)
            this.$message.success(`文件移除成功`)
          }
        },
        handleUpload (fileInfo, formData) {
          const files = []
          if (fileInfo.file.status === 'done' || fileInfo.file.status === 'removed') {
            for (var i of fileInfo.fileList) {
              if (i.response) {
                files.push(i.response.data)
              }
            }
          } else if (fileInfo.file.status === 'error') { this.$message.error(`文件上传失败,请删除上传失败的文件`) }
          formData.diseaseFiles = files
        },
        handleBlur (item) {
          console.log(item)
          if (item.value === '' || item.value === null) {
            item.diaResult = ''
          } else if (item.conditions.length === 0) {
            for (const i of item.result) {
              if ((i.start == null || i.start === '') && Number(item.value) < Number(i.end)) {
                item.diaResult = i.name
                break
              } else if (Number(item.value) >= Number(i.start) && Number(item.value) < Number(i.end)) {
                item.diaResult = i.name
                break
              } else if (i.end == null && Number(item.value) >= Number(i.start)) {
                item.diaResult = i.name
                break
              } else { item.diaResult = '' }
            }
          } else {

          }
          this.$forceUpdate()
        },
        onChangeCondition (e, condition, item) {
          console.log(item, condition, e.target.value)
          const optionId = condition.options.filter(i => { if (i.name === e.target.value) return true })
          const resultList = item.result.filter(result => {
            for (const i of result.conditionFilters) {
              if (i.conditionId === condition.id && i.optionId === optionId[0].id) {
                return true
              }
            }
          })
          // item.result = resultList
          if (item.value !== '' && item.value !== null) {
            for (const i of resultList) {
              if ((i.start == null || i.start === '') && Number(item.value) < Number(i.end)) {
                item.diaResult = i.name
                break
              } else if (Number(item.value) >= Number(i.start) && Number(item.value) < Number(i.end)) {
                item.diaResult = i.name
                break
              } else if (i.end == null && Number(item.value) >= Number(i.start)) {
                item.diaResult = i.name
                break
              } else { item.diaResult = '' }
            }
          }
          this.$forceUpdate()
          // console.log('resultList', optionId[0].id, resultList)
        },
        changeResult () {
          this.$forceUpdate()
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
  /* background: linear-gradient(to bottom right, #00a0e9, #00abb9); */
  background: linear-gradient(to bottom right, #118bfd, #5bbdff);
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
.special_index{
    color: #fa8c16;
    background: #fff7e6;
    border-color: #ffd591;
}

.ant-select-selection--multiple{
  /* height: 90px; */
}
</style>
