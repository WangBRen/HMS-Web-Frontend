<template>
  <div>
    <a-modal
      forceRender
      class="modal"
      v-model="seeReportVisible"
      title="健康信息"
      :footer="null"
      @cancel="closeSeeModal"
      :width="1150"
    >
      <!-- <template slot="footer">
        <a-button @click="closeSeeModal">取消</a-button>
      </template> -->
      <a-row :gutter="20">
        <a-col :span="4" class="modalLeft">
          <div class="modal-left-panel">
            <div class="left-title-wrapper" v-for="item in formData.testData" :key="item.id">
              <a @click="onSc(item.indexProjectName)">{{ item.indexProjectName }}</a>
            </div>
            <div class="left-title-wrapper" v-if="formData.diseaseAt">
              <a @click="onSc('用户诊断信息')" key="用户诊断信息">用户诊断信息</a>
            </div>
            <div class="left-title-wrapper" v-if="formData.symptomAt">
              <a @click="onSc('用户症状信息')" key="用户症状信息">用户症状信息</a>
            </div>
            <!-- 回到顶部 -->
            <div class="left-title-wrapper">
              <a-icon :style="{fontSize: '25px'}" @click="onSc(formData.testData[0].indexProjectName)" type="up-square" theme="filled" />
            </div>
            <!-- 清空 -->
            <!-- <div class="left-title-wrapper">
              <a-icon @click="clearData()" :style="{fontSize: '25px'}" type="delete" theme="filled" />
            </div> -->
          </div>
        </a-col>
        <a-col :span="19" :offset="1" class="modal-right-panel">
          <a-form-model>
            <div v-for="item in formData.testData" :key="item.id">
              <!-- 指标项目 -->
              <a-row>
                <a-col class="project-header">
                  <a :id="item.indexProjectName" class="project-title">{{ item.indexProjectName }}</a>
                </a-col>
              </a-row>
              <div style="padding: 0 10px">
                <a-row>
                  <div class="index-title">
                    <a-col :span="7"><span>指标名称</span></a-col>
                    <a-col :span="6"><span>检测值</span></a-col>
                    <a-col :span="6"><span>参考范围</span></a-col>
                    <a-col :span="5"><span>检测结果</span></a-col>
                    <!-- <a-col :span="4"><span>结果意义</span></a-col> -->
                  </div>
                </a-row>
                <!-- 指标 -->
                <a-row>
                  <a-col class="rightBody" :span="24" v-for="items in item.items" :key="items.id">
                    <a-row class="index-item">
                      <a-col :span="7">
                        <div class="index-item-title-wrapper">
                          <span> {{ items.name }} </span>
                        </div>
                      </a-col>
                      <a-col :span="6">
                        <div class="index-item-title-wrapper">
                          <!-- <a class="exTitle">检测值:</a> -->
                          <span v-if="items.type === 'Integer' || items.type === 'Float'">
                            {{ items.value || '--' }} {{ items.unit }}
                          </span>
                          <span v-if="items.type === 'Text'">
                            {{ items.value || '--' }}
                          </span>
                          <span v-if="items.type === 'Report'">
                            <a v-if="items.value" :href="items.value[0].url" target="_blank">{{ items.value[0].fileName }}</a>
                            <span v-else >--</span>
                          </span>
                        </div>
                      </a-col>
                      <a-col :span="6">
                        <div class="index-item-title-wrapper">
                          <!-- <span v-for="resultValue in items.result" :key="resultValue.id">
                            <span v-if="resultValue.name.indexOf('正常') != -1">
                              {{ resultValue.start }}-{{ resultValue.end }}
                            </span>
                          </span> -->
                          {{ items.min }}-{{ items.max }}
                        </div>
                      </a-col>
                      <a-col :span="5">
                        <div class="index-item-title-wrapper">
                          <!-- <a class="exTitle">检测结果:</a> -->
                          {{ items.endResult || '无' }}
                        </div>
                      </a-col>
                      <!-- <a-col :span="4">
                        <div class="index-item-title-wrapper">
                          <div v-for="i in items.result" :key="i.id">
                            <div v-if="i.name ===items.endResult" style="width:160px;white-space: nowrap;overflow:hidden;text-overflow:ellipsis;">
                              <a-tooltip placement="topLeft">
                                <template slot="title">
                                  {{ i.remark }}
                                </template>
                                {{ i.remark }}
                              </a-tooltip>
                            </div>
                          </div>
                        </div>
                      </a-col> -->
                    </a-row>
                  </a-col>
                </a-row>
                <!-- 诊断时间 -->
                <a-row style="margin: 28px 0;">
                  <a-col :span="6" :offset="18">
                    <span>检测时间：</span>
                    <div style="float: right; margin-right: 12px;">{{ item.testAt | getMoment }}</div>
                  </a-col>
                </a-row>
                <div style="font-size:16px;font-weight:600;color:#888;padding:10px;">异常指标小结：</div>
                <a-row v-for="items in item.items" :key="items.id" style="background:#F4F8FA;">
                  <div v-if="(items.max!==null && items.value > items.max) || (items.min!==null && items.value < items.min)">
                    <a-col :span="5" style="color:#00A3DB;padding: 10px;">
                      {{ items.name }} 【{{ items.value || '--' }} {{ items.unit }}】
                    </a-col>
                    <a-col :span="19">
                      <div v-for="i in items.result" :key="i.id">
                        <div v-if="i.name ===items.endResult" style="padding:5px 10px;">
                          {{ i.remark }}
                        </div>
                      </div>
                    </a-col>
                  </div>
                </a-row>
              </div>
            </div>
            <!-- 用户诊断信息 -->
            <div v-if="formData.diseaseAt">
              <a-row>
                <a-col class="project-header">
                  <a id="用户诊断信息" class="project-title">用户诊断信息</a>
                </a-col>
              </a-row>
              <a-row style="padding-top: 12px;">
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
                        <div>{{ formData.title }}</div>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="3">
                        <div class="index-item-title-wrapper">
                          <span class="index-item-title" style="margin-left:8px;"> 诊断文件： </span>
                        </div>
                      </a-col>
                      <a-col :span="21">
                        <div v-for="file in formData.diseaseFiles" :key="file.index"><a :href="file.url" target="_blank"><a-icon type="file-image" /> {{ file.fileName }}</a></div>
                      </a-col>
                    </a-row>
                    <a-row style="margin: 28px 0;">
                      <a-col :span="6" :offset="18">
                        <span>检测时间：</span>
                        <div style="float: right; margin-right: 12px;">{{ formData.diseaseAt | getMoment }}</div>
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
            <!-- 用户症状信息 -->
            <div v-if="formData.symptomAt">
              <a-row>
                <a-col class="project-header">
                  <a id="用户症状信息" class="project-title">用户症状信息</a>
                </a-col>
              </a-row>
              <a-row style="padding-top: 12px;">
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
                        <span v-for="item in formData.symptom" :key="item.index">【{{ item }}】、</span>
                      </a-col>
                    </a-row>
                    <a-row style="margin: 28px 0;">
                      <a-col :span="6" :offset="18">
                        <span>检测时间：</span>
                        <div style="float: right; margin-right: 12px;">{{ formData.symptomAt | getMoment }}</div>
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
import moment from 'moment'
import { getHealthIndex } from '@/api/health'
export default {
  filters: {
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
      seeReportVisible: false,
      formData: {},
      healthIndex: []
    }
  },
  mounted () {
    getHealthIndex().then(res => {
      if (res.status === 200) {
        this.healthIndex = res.data
        console.log('总指标', this.healthIndex)
      }
    })
  },
  methods: {
    seeReportCom (data) {
      this.formData = {}
      this.formData = data
      this.formData.testData = []
      this.formData.testData.length = 0
      const arrData = this.formData.projects
      const healthData = this.healthIndex
      for (var i = 0; i < arrData.length; i++) {
        for (var j = 0; j < healthData.length; j++) {
          if (arrData[i].indexProjectName === healthData[j].name) {
            const aa = {
              indexProjectName: arrData[i].indexProjectName,
              testAt: arrData[i].testAt,
              items: healthData[j].items
            }
            this.formData.testData.push(aa)
            console.log('this.formData.testData', this.formData.testData)
          }
        }
      }
      for (let m = 0; m < this.formData.testData.length; m++) {
        for (let n = 0; n < this.formData.testData[m].items.length; n++) {
          // console.log(this.formData.testData[m].items[n].id)
            this.formData.testData[m].items[n].value = null
            this.formData.testData[m].items[n].endResult = null
        }
      }
      for (var k = 0; k < arrData.length; k++) {
        for (var l = 0; l < arrData[k].items.length; l++) {
          // console.log(arrData[k].items[l].healthIndexItem.id)
          for (var m = 0; m < this.formData.testData.length; m++) {
            for (var n = 0; n < this.formData.testData[m].items.length; n++) {
              // console.log(this.formData.testData[m].items[n].id)
              if (arrData[k].items[l].healthIndexItem.id === this.formData.testData[m].items[n].id) {
                if (arrData[k].items[l].healthIndexItem.type === 'Report') {
                  this.formData.testData[m].items[n].value = JSON.parse(arrData[k].items[l].value)
                } else {
                  this.formData.testData[m].items[n].value = arrData[k].items[l].value
                }
                // console.log('value', arrData[k].items[l])
                this.formData.testData[m].items[n].endResult = arrData[k].items[l].result
              }
            }
          }
        }
      }
      if (data.disease) {
        this.formData.title = data.disease.title
      } else {
        this.formData.title = null
      }
      // console.log('查看报告', this.formData)
    },
    openSeeModal () {
      this.seeReportVisible = true
    },
    closeSeeModal () {
      this.seeReportVisible = false
    },
    onSc (value) {
      // console.log('11', value)
      document.getElementById(value).scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>
<style lang="less" scoped>
.modal-left-panel{
  position: fixed;
  // height: 400px;
  overflow: auto;
  border-radius: 6px;
  border: 1px #eee solid;
  text-align: left;
  width: 186px;
  padding: 24px 18px;
}
.left-title-wrapper{
  font-size: 14px;
  padding-bottom: 12px;
  // padding: 0 12px 12px 12px;
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
  // padding: 24px 12px;
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
  padding: 0 12px;
}
.rightBody:hover{
  background-color: #e6f7ff;
  /* text-align: center; */
  /* height: 240px; */
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
  // display: flex;
  // height: 34px;
  // align-items: center;
}
.index-title {
  font-size: 16px;
  font-weight: 700;
  padding: 0 12px;
  line-height: 40px;
  margin-top: 10px;
}
.index-item-title-sider {
  width: 8px;
  height: 24px;
  background: #00a0e9;
}
</style>
