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
      <!-- 模板示例 -->
      <div class="template_example">
        <div class="template_title">模板示例:</div>
        <div>
          身高为<span class="check_variable">${身高}</span>cm,体重为<span class="check_variable">${体重}</span>kg <span class="check_variable">>>>>>></span> 身高为170cm,体重为50kg
        </div>
        <div>模板可选变量:
          <a-tag class="check_variable">${身高}</a-tag>
          <a-tag class="check_variable">${体重}</a-tag>
        </div>
        <div>可用后面的代码组合自动获取用户的指标,点击标签可添加至模板中</div>
      </div>

      <a-card class="speech_card" v-for="item in formData" :key="item.id" :title="'等级'+item.level+'话术模板'">
        <a-textarea
          :id="item.id"
          v-model="item.template.templateText"
          placeholder="请编辑话术模板"
          :auto-size="{ minRows: 2, maxRows: 6 }"
        />
        <div class="check_variable_list">
          模板可选变量:
          <a-tag class="check_variable" @click="addTmp(item,variable)" v-for="variable in variablesArr" :key="variable.targetId"> {{ variable.name }} </a-tag>
        </div>
      </a-card>
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
        // console.log('cutArr', cutArr)
        while (cutArr.length !== 0) {
          // console.log(cutArr, '截取前', cutArr.length)
          if (cutArr.indexOf('${') !== -1 && cutArr.indexOf('}') !== -1 && (cutArr.indexOf('${') < cutArr.indexOf('}'))) {
            haveArr.push(cutArr.slice(cutArr.indexOf('${'), cutArr.indexOf('}') + 1))
            // console.log('???', cutArr.slice(cutArr.indexOf('${'), cutArr.indexOf('}') + 1))
            cutArr = cutArr.slice(cutArr.indexOf('}') + 1)
          } else {
            cutArr = cutArr.slice(1)
          }
          // console.log(cutArr, '截取后cutArr', cutArr.length)
        }
      })
      // console.log('有的变量', haveArr, '可选变量', checkArr)
      const resultArr = []
      haveArr.filter(item => {
        resultArr.push(checkArr.includes(item)) // includes 判断一个数组中是否包含某一个元素，有则返回true，没有返回false
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
      // 满足校验
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
    },
    addTmp (item, check) {
      // console.log(item.template.templateText, check.name)
      const tmpText = item.template.templateText
      const test = document.getElementById(item.id)
      item.template.templateText = tmpText.slice(0, test.selectionStart) + check.name + tmpText.slice(test.selectionEnd)
      // console.log('endDom', test.selectionStart, 'offset', test.selectionEnd)
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
<style lang="less" scoped>
.template_title{
  font-size: 20px;
}
.speech_card{
  margin: 10px 0;
}
.check_variable_list{
  margin-top: 10px;
}
.check_variable{
  color: blue;
}
.template_example{
  opacity: 0.75
}
/deep/.ant-card-body{
  padding: 16px;
}
/deep/.ant-card-head{
  padding: 0 16px;
}
</style>
