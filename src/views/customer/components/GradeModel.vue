<template>
  <div>
    <a-modal v-model="gradeModelvisible" title="慢病分级" @ok="handleOk">
      <!-- <a-radio-group :options="gradeOptions" v-model="Grade" size="large"/> -->
      <div style="margin:30px ;display: flex;justify-content: center;align-items: center;">
        <span>选择慢病分级：</span>
        <a-select
          placeholder="请选择"
          style="width: 200px;"
          :options="gradeOptions"
          v-model="Grade"
        ></a-select>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import { formLevels as apiformLevels } from '@/api/followUpForm'
const gradeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(step => { return { value: step, label: step + '级' } })
export default {
  name: 'GradeModel',
  props: {
    diseaseId: {
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
    }
  },
  data () {
    return {
      gradeModelvisible: false,
      Grade: '',
      gradeOptions: gradeOptions
    }
  },
  methods: {
    openGradeModal () {
      this.gradeModelvisible = true
      this.Grade = ''
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
            // message.success('分级成功')
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
</style>
