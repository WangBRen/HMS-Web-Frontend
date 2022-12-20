<template>
  <div>
    <a-modal
      :visible="medicineVisible"
      v-if="medicineVisible"
      :title="'慢病药物'"
      @ok="medicineHandleOk"
      @cancel="medicineHandleCancel"
      :width="1300"
      :maskClosable="false"
    >
      <div >
        <div class="medicine_body" v-for="(item, index) in medicineDatas" :key="index">
          <a-row style="margin: 10px;">
            <a-col :span="4">
              <a-input v-model="item.target" addonBefore="治疗目标"></a-input>
            </a-col>
            <a-col :span="4">
              <a-input v-model="item.category" addonBefore="类别"></a-input>
            </a-col>
            <a-col :span="4">
              <a-input v-model="item.name" addonBefore="药名"></a-input>
            </a-col>
            <a-col :span="7" :push="2">
              <a-input v-model="item.frequency" addonBefore="使用剂量:" addonAfter="次" style="width: 45%;"></a-input>
              <span style="width: 5%; text-align: center; line-height: 2">/</span>
              <a-select v-model="item.company" style="width: 20%;">
                <a-select-option value="年">年</a-select-option>
                <a-select-option value="月">月</a-select-option>
                <a-select-option value="周">周</a-select-option>
                <a-select-option value="日">日</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="4">
              <a-input v-model="item.dose" addonBefore="每次"></a-input>
            </a-col>
          </a-row>
          <a-row style="margin: 10px;">
            <a-col :span="2" style="text-align: right;">
              <span>不良反应：</span>
            </a-col>
            <a-col :span="16">
              <a-textarea v-model="item.reaction" :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea>
            </a-col>
            <a-col :span="4" style="text-align: center;margin: 0 auto;">
              <a-icon class="targetIcon" @click="delMedicine(index)" type="close-circle" />
            </a-col>
          </a-row>
        </div>
        <a-button @click="addMedicine">
          <a-icon type="plus"/>添加药物
        </a-button>
        <a-button @click="test">测试</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>

export default {
  props: {
    medicineVisible: {
      type: Boolean,
    default: false
      },
    medicineData: {
      type: Array,
      default: function () {
      return []
      }
    },
    medicineInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      medicineDatas: this.medicineData
    }
  },
  methods: {
    medicineHandleOk () {
      console.log('1', this.medicineDatas)
      const medData = this.medicineDatas
      for (const item of medData) {
        // console.log(item)
        var okIndex = true
        for (const key in item) {
        //   console.log(item[key])
          if (item[key] === '') {
            okIndex = false
            break
          }
        }
        console.log(okIndex)
        if (okIndex === false) {
          console.log('结束')
          break
        }
      }
      if (okIndex) {
        console.log('调接口')
      } else {
        console.log('提示')
      }
    },
    medicineHandleCancel () {
      this.$emit('closeMedicineModal')
    },
    addMedicine () {
      console.log(this.medicineDatas, '111')
      this.medicineDatas.push({
        name: '',
        target: '', // 治疗目标
        category: '', // 药物类别
        dose: '', // 剂量
        frequency: '', // 次数
        company: '', // 单位
        reaction: '' // 不良反应
      })
    },
    delMedicine (index) {
      this.medicineDatas = this.medicineDatas.filter((item, ind) => ind !== index)
    },
    test () {
      console.log('/..', this.medicineDatas)
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
    medicineData (newData, oldData) {
      this.medicineDatas = newData
      console.log('this.medicineDatas', this.medicineDatas)
    }
  }
}
</script>
<style scoped>
.medicine_body{
  border-style: solid;
  border-width: 1px;
  margin: 10px 0px;
}
.targetIcon{
  width: 18px;
  height: 18px;
  margin-top: 10px;
  margin-left: 12px;
  color: #999;
}
</style>
