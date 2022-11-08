<template>
  <div>
    <a-modal
      :visible="editVisible"
      v-if="editVisible"
      :title="'编辑慢病【'+editData.name+'】'"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="700"
    >
      <a-form-model :model="editData" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="慢性病" prop="name">
              <a-input v-model="editData.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="描述" prop="describe">
              <a-textarea v-model="editData.describe" placeholder="慢性病描述" :rows="4" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-divider type="horizontal" dashed style="margin-bottom:24px"/>
        <a-row v-for="target in editData.items" :key="target.indexItem.id">
          <a-col>
            <a-form-model-item label="指标名">
              <a-row>
                <a-col :span="22">
                  <a-select disabled v-model="target.indexItem.id" show-search :filterOption="filterOption">
                    <a-select-option v-for="item in indexArr" :key="item.id">
                      {{ item.name }} - <span style="font-size: 11px; color: #999">({{ item.category }})</span>
                    </a-select-option>
                  </a-select>
                </a-col>
                <!-- <a-col :span="2" style="text-align: center;margin: 0 auto;">
                  <a-icon class="targetIcon" @click="delEdit(target)" type="close-circle" />
                </a-col> -->
              </a-row>
            </a-form-model-item>
          </a-col>
          <!-- <a-col v-show="target.indexItem.id">
            <a-form-model-item label="系数">
              <a-row>
                <a-col :span="12">
                  <a-slider
                    v-model="target.coefficient"
                    :default-value="2"
                    :min="0"
                    :max="10"
                    :step="0.01"
                    @afterChange="changeIndex(target.indexItem.id, target.coefficient)"
                  />
                </a-col>
                <a-col :span="6" :push="1">
                  <a-input-number @change="changeIndex(target.indexItem.id, target.coefficient)" v-model="target.coefficient" :min="0" :max="10"></a-input-number>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col> -->
          <a-col v-show="target.indexItem.id">
            <a-form-model-item label="结果">
              <a-row>
                <a-col v-for="(result,index) in target.indexItem.result" :key="index" class="index-result">
                  <span v-if="result.type==='range'">{{ result | getRange(target.coefficient) }}</span>
                  <span v-if="result.type==='simple'">{{ result.name }}</span>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- <a-row>
          <a-col :span="22">
            <a-button @click="addEdit" type="dashed" style="display:block;margin:0 auto;width:60%">
              <a-icon type="plus" /> 添加指标
            </a-button>
          </a-col>
        </a-row> -->
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getHealthIndex } from '@/api/health'
import { editChronic as apiEditChronic } from '@/api/chronic'

export default {
    props: {
      editVisible: {
          type: Boolean,
          default: false
      },
      editData: {
          type: Object,
          default: function () {
            return {}
        }
      }
    },
    filters: {
      getRange: function (value, num) {
            // 范围或数值
            if (value.type === 'range') {
              if (value.start === null) {
                // return `${value.name}:\t  指标值 < ${value.end * 1 + num * 1 || 'INF'}`
                return `${value.name}:\t ${value.end * 1 + num * 1 || 'INF'} > 指标值 (${value.unit})`
              } else if (value.end === null) {
                return `${value.name}:\t ${value.start * 1 + num * 1 || 'INF'} ≤ 指标值 (${value.unit})`
              } else {
                return `${value.name}:\t ${value.start * 1 + num * 1 || 'INF'} ≤ 指标值 < ${value.end * 1 + num * 1 || 'INF'} (${value.unit})`
              }
            } else if (value.type === 'simple') {
            // 数值
              return value.value
            }
        }
    },
    data () {
        return {
            // editVisible: false,
            indexArr: [],
            labelCol: { span: 4 },
            wrapperCol: { span: 16 }
        }
    },
    mounted () {
        getHealthIndex().then(res => {
        if (res.status === 200) {
          const resData = res.data
          // console.log('接口数据', resData)
          for (var i = 0; i < resData.length; i++) {
            if (resData[i].items) {
              // console.log('指标', resData[i].items)
              for (var j = 0; j < resData[i].items.length; j++) {
                // console.log('指标', resData[i].items[j].name)
                const firstIndex = resData[i]
                const secondIndex = resData[i].items[j]
                this.indexArr.push({
                  category: firstIndex.name,
                  id: secondIndex.id,
                  name: secondIndex.name,
                  result: secondIndex.result,
                  type: secondIndex.type,
                  unit: secondIndex.unit
                })
              }
            }
          }
        //   console.log('指标', this.indexArr)
        }
      })
    },
    methods: {
        handleOk () {
            // console.log(this.editData)
            const apiData = this.editData
            const diseaseId = apiData.id
            apiEditChronic(diseaseId, apiData).then(res => {
                if (res.status === 200) {
                    // console.log('编辑成功')
                    this.$message.info('成功编辑慢病')
                    this.$parent.getChronic() // 编辑后触发父组件刷新
                    // this.$parent.closeEditModal()
                    this.$emit('closeEditModal')
                    // this.editVisible = false
                } else {
                    this.$message.error('编辑失败')
                }
            })
            // console.log('确定', this.editData)
        },
        handleCancel () {
            // this.editVisible = false
            this.$emit('closeEditModal')
            // console.log('取消')
        },
        filterOption (value, option) {
          return option.componentOptions.children[0].text.indexOf(value) >= 0
        }
        // addEdit () {
        //     const item = {
        //         timeid: new Date().getTime(),
        //         indexItem: {
        //           id: null,
        //           result: null
        //         },
        //         coefficient: 1
        //     }
        //     this.editData.items.push(item)
        // },
        // delEdit (item) {
        //     // console.log(item)
        //    this.editData.items = this.editData.items.filter(i => i.indexItem.id !== item.indexItem.id)
        // },
        // delEditEnd () {
        //     this.editData.items.pop()
        // },
        // changeIndex (id) {
        //   const targetArr = this.editData.items
        //   const indexArr = this.indexArr
        //   // console.log('结果', targetArr)
        //   // console.log('指标', indexArr)
        //   // console.log('id', id)
        //   for (var j = 0; j < indexArr.length; j++) {
        //     if (indexArr[j].id === id) {
        //       // console.log('11', indexArr[j].result)
        //       for (var i = 0; i < targetArr.length; i++) {
        //         if (targetArr[i].indexItem.id === id) {
        //           const result = indexArr[j].result
        //           targetArr[i].indexItem.result = result
        //         }
        //       }
        //     }
        //   }
        // }
    }
}
</script>
<style scoped>
.targetIcon{
  font-size: 18px;
  color: #999;
}
.index-result{
  color: #999;
  line-height: 22px;
  font-size: 12px;
}
</style>
