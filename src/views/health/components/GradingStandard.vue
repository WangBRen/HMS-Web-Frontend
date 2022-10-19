<template>
  <div>
    <a-modal v-model="visible" :title="`【${chronicTitle || ''}】分级标准`" @ok="handleOk" width="800px">
      <div class="group-body">
        <a-input-group v-for="(item, index) in levelArr" :key="index" class="group-item">
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
  },
  data () {
    return {
      visible: false,
      chronicTitle: '',
      levelArr: [],
      diseaseId: null
    }
  },
  methods: {
    openModel (data) {
      this.chronicTitle = data.name
      this.diseaseId = data.id
      this.visible = true
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
      this.levelArr.forEach(function (item) {
        const levelItem = {
          level: item.key,
          remark: item.describe
         }
        apiData.levels.push(levelItem)
      })
      updateHeathLevels(this.diseaseId, apiData).then(res => {
        // console.log('给后端的', apiData)
        if (res.status === 200) {
          this.$message.info('分级信息加载成功')
          this.visible = false
        } else {
          notification.warning({ message: '请求失败', description: res.message })
        }
      })
    },
    addLevelArr () {
      if (this.levelArr.length < 9) {
        const newLevel = { key: null, level: null, describe: '' }
        if (this.levelArr.length === 0) {
          newLevel.key = 1
          newLevel.level = newLevel.key + '级'
          newLevel.describe = ''
        } else {
          newLevel.key = this.levelArr[this.levelArr.length - 1].key + 1
          newLevel.level = newLevel.key + '级'
          newLevel.describe = ''
        }
        this.levelArr.push(newLevel)
      } else {
        message.warning('你已达到分级上限，最高九级')
      }
    },
    deleteLevel (index) {
      // console.log(this.levelArr)
      // // this.levelArr = this.levelArr.filter(i => i.key !== keys.key)
      this.levelArr = this.levelArr.filter((item, idx) => idx !== index)
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
