<template>
  <div>
    <a-modal v-model="gradeModelvisible" title="慢病分级" @ok="handleOk" width="800px">
      <div class="level-box">
        <!-- <a-radio-group :options="gradeOptions" v-model="Grade" size="large"/> -->
        <a-divider orientation="left">分级标准</a-divider>
        <a-row v-for="item in healthLevels" :key="item.id" class="levels">
          <a-col :span="2" class="level">
            <a-tag>{{ item.level }}级</a-tag>
          </a-col>
          <a-col :span="22" class="remark">{{ item.remark }}</a-col>
        </a-row>
        <a-row>
          <div style="margin:30px ;display: flex;justify-content: center;align-items: center;">
            <span>选择慢病分级：</span>
            <a-select
              placeholder="请选择"
              style="width: 200px;"
              :options="gradeOptions"
              v-model="Grade"
            ></a-select>
          </div>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { message, notification, Modal } from 'ant-design-vue'
import { formLevels as apiformLevels } from '@/api/followUpForm'
import { getHeathLevels } from '@/api/health'
const gradeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(step => { return { value: step, label: step + '级' } })
export default {
  name: 'DefineLevel',
  props: {
    diseaseId: {
      type: Number,
      default: 0
    },
    chronicDiseaseId: {
      type: Number,
      default: 0
    },
    customerId: {
      type: Number,
      default: 0
    },
    followId: {
      type: Number,
      default: 0
    },
    fatherModel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      gradeModelvisible: false,
      Grade: '',
      gradeOptions: gradeOptions,
      healthLevels: []
    }
  },
  methods: {
    openGradeModal () {
      this.gradeModelvisible = true
      this.Grade = ''
      getHeathLevels(this.chronicDiseaseId).then(res => {
        if (res.status === 200) {
          console.log(res.data)
          this.healthLevels = res.data
        }
      })
    },
    handleOk () {
      if (this.Grade !== '') {
        this.gradeModelvisible = false
        const levelData = { level: 0, remark: '', followUpFormId: 0 }
        levelData.level = this.Grade
        levelData.remark = ''
        levelData.followUpFormId = this.followId
        return apiformLevels(this.customerId, this.diseaseId, levelData).then(res => {
          if (res.status === 201) {
              Modal.success({
                title: () => '分级成功, ' + '当前分级为：' + this.Grade + '级'
              })
            // message.success('分级成功')
            this.$emit('fatherMethod', false)
          } else {
              notification.open({
                message: '错误提示',
                description: '分级失败，请稍后再试'
              })
            }
        })
      } else {
        message.info('请选择慢病分级')
      }
    }
  }
}
</script>

<style>
.ant-radio-wrapper{
  font-size: large;
  margin:10px 40px;
}
.level-box{
  width: 90%;
  margin: 0 auto;
}
.level{
   font-size: 16px;
   letter-spacing: 0.25rem;
}
.levels{
  margin-bottom: 10px;
}
.remark{
  /* line-height: 24px; */
}
</style>
