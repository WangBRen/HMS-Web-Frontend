<template>
  <div>
    <a-modal
      :visible="visible1"
      v-if="gradingInfo"
      :title="`分级标准【${gradingInfo.name || ''}】`"
      @ok="handleOk"
      @cancel="gradingHandleCancel"
      width="800px"
      ok-text="保存">
      <div class="group-body">
        <a-input-group v-for="(item, index) in gradingData1" :key="index" class="group-item">
          <a-input style="width: 15%;text-align: center;" :value="index + 1 + '级'" disabled/>
          <a-input style="width: 80%;" v-model="item.describe" placeholder="请输入等级描述"/>
          <a-icon class="targetIcon" @click="deleteLevel(index)" type="close-circle" />
        </a-input-group>
        <a-button @click="addLevelArr" type="dashed" style="display:block;margin:10px auto;width:70%">
          <a-icon type="plus" /> 添加等级
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { message, notification } from 'ant-design-vue'
import { updateHeathLevels } from '@/api/health'
export default {
  props: {
      gradingVisible: {
          type: Boolean,
          default: false
      },
      gradingData: {
          type: Array,
          default: function () {
            return []
          }
      },
      gradingInfo: {
          type: Object,
          default: function () {
            return {}
          }
      }
  },
  data () {
    return {
      visible1: this.gradingVisible,
      chronicTitle: '',
      // levelArr: [],
      diseaseId: null,
      gradingData1: this.gradingData
    }
  },
  methods: {
    openModel (data) {
      this.chronicTitle = data.name
      this.diseaseId = data.id
      this.visible1 = true
    },
    getHealthLevels (data) {
      this.levelArr = []
      // const oldLevels = JSON.parse(JSON.stringify(data))
      const oldLevels = data
      const aaa = []
      oldLevels.forEach(function (item) {
        const levelItem = {
          key: item.level,
          level: item.level + '级',
          describe: item.remark
        }
        aaa.push(levelItem)
      })
      this.levelArr = aaa
    },
    handleOk () {
      const apiData = { levels: [] }
      // console.log('this.levelArr', this.levelArr)
      this.gradingData1.forEach(function (item) {
        const levelItem = {
          level: item.key,
          remark: item.describe
         }
        apiData.levels.push(levelItem)
      })
      updateHeathLevels(this.gradingInfo.id, apiData).then(res => {
        // console.log('给后端的', apiData)
        if (res.status === 200) {
          this.$message.success('保存成功')
          this.$emit('closeGradingModal')
          // this.visible1 = false
          // this.gradingVisible = false
        } else {
          notification.warning({ message: '保存失败', description: res.message })
        }
      })
    },
    addLevelArr () {
      if (this.gradingData1.length < 9) {
        const newLevel = { key: null, level: null, describe: '' }
        if (this.gradingData1.length === 0) {
          newLevel.key = 1
          newLevel.level = newLevel.key + '级'
          newLevel.describe = ''
        } else {
          newLevel.key = this.gradingData1[this.gradingData1.length - 1].key + 1
          newLevel.level = newLevel.key + '级'
          newLevel.describe = ''
        }
        this.gradingData1.push(newLevel)
      } else {
        message.warning('你已达到分级上限，最高九级')
      }
    },
    deleteLevel (index) {
      // console.log(this.levelArr)
      // // this.levelArr = this.levelArr.filter(i => i.key !== keys.key)
      this.gradingData1 = this.gradingData1.filter((item, idx) => idx !== index)
    },
    gradingHandleCancel () {
      this.$emit('closeGradingModal')
    }
  },
  watch: {
    gradingData () {
      // console.log('++')
      this.gradingData1 = this.gradingData
    },
    gradingVisible (newa, old) {
      this.visible1 = this.gradingVisible
      // console.log(old, '>>', newa)
    }
  }
}
</script>

<style>
.group-body{
  width: 90%;
  margin: 0 auto;
}
.group-item{
  margin-bottom:15px;
  display: flex;
  /* align-content: center; */
}
.targetIcon{
  width: 5%;
  font-size: 18px;
  color: #ccc;
  /* line-height: 30px; */
  /* height: 30px; */
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>
