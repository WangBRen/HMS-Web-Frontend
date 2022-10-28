<template>
  <div>
    <a-modal
      :visible="speechVisible"
      v-if="speechVisible"
      :title="'编辑话术【'+speechInfo.name+'】'"
      @ok="speechHandleOk"
      @cancel="speechHandleCancel"
      :width="700"
    >
      <div v-for="item in formData" :key="item.id" class="template_body">
        <span class="template_title">等级{{ item.level }}话术模板:</span>
        <a-textarea
          v-model="item.template.templateText"
          placeholder="请编辑话术模板"
          :auto-size="{ minRows: 2, maxRows: 6 }"
        />
        <div>
          模板可选变量:
          <span class="variable" v-for="variable in variablesArr" :key="variable.targetId"> {{ variable.name }} </span>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { editSpeech as apiEditSpeech, getSpeechVariables as apiGetSpeechVariables } from '@/api/chronic'
// import { editSpeech as apiEditSpeech } from '@/api/chronic'
// import { getSpeechVariables as apiGetSpeechVariables } from '@/api/chronic'
export default {
  props: {
    speechVisible: {
        type: Boolean,
        default: false
    },
    speechData: {
        type: Array,
        default: function () {
            return []
        }
    },
    speechInfo: {
        type: Object,
        default: function () {
            return {}
        }
    }
  },
  data () {
    return {
      formData: this.speechData, // 用于展示
      variablesArr: [] // 可选变量
    }
  },
  methods: {
    speechHandleOk () {
        // console.log('传进来info', this.speechInfo.id)
        const diseaseId = this.speechInfo.id
        const apiData = this.formData.map((item) => {
            const temporaryData = {
                level: item.level,
                template: {
                  templateText: item.template.templateText
                }
            }
            return temporaryData
        })
        const templates = {}
        templates.templates = apiData
        apiEditSpeech(diseaseId, templates).then(res => {
            if (res.status === 200) {
                this.$message.info('编辑话术成功')
                this.$emit('closeSpeechModal')
            } else {
                this.$message.error('编辑失败')
            }
        })
        // console.log('传给后端', templates)
    },
    speechHandleCancel () {
        this.$emit('closeSpeechModal')
    },
    getSpeechVariables (diseaseId) {
      apiGetSpeechVariables(diseaseId).then(res => {
          if (res.status === 200) {
              // console.log('变量', res.data)
              this.variablesArr = res.data
          }
      })
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
    // 处理数组
    speechData () {
      // console.log('speechData')
      this.formData = this.speechData
      // console.log('formData', this.formData)
      this.formData.forEach(item => {
        // console.log(item)
        if (!item.template) {
          const objData = {
            templateText: '',
            templateVariables: ''
          }
          item.template = objData
        }
      })
    },
    speechInfo () {
        // console.log('info', this.speechInfo.id)
        const diseaseId = this.speechInfo.id
        this.getSpeechVariables(diseaseId)
    }
  }
}
</script>
<style scoped>
.template_body{
  margin: 10px 0;
}
.template_title{
  font-size: 20px;
}
.variable{
  color: blue;
}
</style>
