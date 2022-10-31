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
        // 校验
        // console.log('传进来的', this.formData)
        var haveArr = [] // 慢病拥有的变量
        // 可选变量
        var checkArr = this.variablesArr.map(item => {
            return item.name
        })
        // 遍历读取当前慢病拥有的变量
        this.formData.forEach(item => {
            var cutArr = item.template.templateText
            for (var i = 0; i <= cutArr.length; i++) {
                // console.log(cutArr.indexOf('}'))
                if (cutArr.indexOf('${') !== -1 && cutArr.indexOf('}') !== -1) {
                  haveArr.push(cutArr.slice(cutArr.indexOf('${'), cutArr.indexOf('}') + 1))
                }
                // console.log(cutArr)
                cutArr = cutArr.slice(cutArr.indexOf('}') + 1)
            }
        })
        // console.log('有的变量', haveArr, '可选变量', checkArr)
        const resultArr = []
        haveArr.filter(item => {
          resultArr.push(checkArr.includes(item))
          // console.log('校验', checkArr.includes(item))
        })
        // console.log('结果', resultArr)
        var checkIndex = true
        for (var j = 0; j < resultArr.length; j++) {
            if (resultArr[j] === false) {
                checkIndex = false
                // console.log('返回', checkIndex)
                break
            } else {
                checkIndex = true
                // console.log('返回', checkIndex)
            }
        }
        if (checkIndex) {
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
            // console.log('满足')
        } else {
            // console.log('不满足')
            this.$message.error('使用错误的模板变量，请修改模板')
        }
        // 校验

        // console.log('传进来info', this.speechInfo.id)
    },
    speechHandleCancel () {
        this.$emit('closeSpeechModal')
    },
    // 获取话术变量
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
