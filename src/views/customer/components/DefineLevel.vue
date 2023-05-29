<template>
  <div>
    <a-modal :visible="gradeModelvisible" title="慢病分级" @ok="handleOk" @cancel="handleOnLevelModalCancel" width="800px">
      <div class="level-box">
        <!-- <a-radio-group :options="gradeOptions" v-model="Grade" size="large"/> -->
        <a-card :title="`【${diseaseName}】分级标准`" style="width: 100%" :loading="loading">
          <!-- <a-divider orientation="left">分级标准</a-divider> -->
          <a-row v-for="item in healthLevels" :key="item.id" class="levels">
            <a-col :span="2" class="level">
              <a-tag>{{ item.level }}级</a-tag>
            </a-col>
            <a-col :span="22" class="remark">{{ item.remark }}</a-col>
          </a-row>
        </a-card>
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
import { message, notification } from 'ant-design-vue'
import { formLevels as apiformLevels } from '@/api/followUpForm'
import { getHeathLevels } from '@/api/health'
// const gradeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(step => { return { value: step, label: step + '级' } })
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
    formId: {
      type: Number,
      default: 0
    },
    gradeModelvisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      Grade: '',
      healthLevels: [],
      gradeOptions: [], // this.healthLevels.map(step => { return { value: step, label: step + '级' } })
      diseaseName: ''
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData () {
      this.loading = true
      const resp = await getHeathLevels(this.chronicDiseaseId)
      this.loading = false
      if (resp.status === 200) {
        this.healthLevels = resp.data
        this.diseaseName = this.healthLevels[0].diseaseName
        this.gradeOptions = resp.data.map(item => { return { value: item.level, label: item.level + '级' } })
        // console.log('级别', this.healthLevels)
      }
    },
    handleOk () {
      if (this.Grade !== '') {
        // this.gradeModelvisible = false
        const levelData = { level: 0, remark: '', followUpFormId: 0 }
        levelData.level = this.Grade
        levelData.remark = ''
        levelData.followUpFormId = this.formId
        return apiformLevels(this.customerId, this.diseaseId, levelData).then(res => {
          if (res.status === 201) {
            this.$confirm({
              title: '分级成功',
              content: '当前分级为：' + this.Grade + '级',
              okText: '确认',
              cancelText: '返回修改',
              onOk: () => {
                this.$emit('fatherMethod', false)
              }
            })
              // Modal.success({
              //   title: () => '分级成功, ' + '当前分级为：' + this.Grade + '级'
              // })
            // this.$emit('fatherMethod', false)
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
    },
    handleOnLevelModalCancel () {
      this.$emit('onclose')
    }
  }
}
</script>

<style>
/* .ant-radio-wrapper{
  font-size: large;
  margin:10px 40px;
} */
.level-box{
  width: 90%;
  margin: 0 auto;
}
.level{
   font-size: 16px;
   letter-spacing: 0.25rem;
   text-align: center;
}
.levels{
  margin-bottom: 10px;
}
/* .remark{ */
  /* line-height: 24px; */
/* } */
</style>
