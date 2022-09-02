<template>
  <div>
    <a-modal
      :visible="editVisible"
      title="编辑慢病"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="700"
    >
      <a-form-model ref="formData" :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="慢性病" prop="name">
              <a-input v-model="formData.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="描述" prop="describe">
              <a-textarea v-model="formData.describe" placeholder="慢性病描述" :rows="4" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-divider type="horizontal" />
        <a-row>
          <a-col>
            <span style="font-size: 16px;">指标</span>
            <a-icon @click="addEdit" type="plus-circle" />
            <a-icon @click="delEditEnd" type="minus-circle" />
          </a-col>
        </a-row>
        <a-row v-for="target in formData.items" :key="target.indexItem.id">
          <a-col>
            <a-form-model-item label="指标名">
              <a-row>
                <a-col :span="18">
                  <a-select v-model="target.indexItem.id" show-search :filterOption="filterOption">
                    <a-select-option v-for="item in indexArr" :key="item.id">
                      {{ item.name }} - <span style="font-size: 11px; color: #999">({{ item.category }})</span>
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="6" style="text-align: center;margin: 0 auto;">
                  <a-icon class="targetIcon" @click="addEdit" type="plus-circle" />
                  <a-icon class="targetIcon" @click="delEdit(target)" type="minus-circle" />
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col v-show="target.indexItem.id">
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
          </a-col>
          <a-col v-show="target.indexItem.id">
            <a-form-model-item label="结果">
              <a-row>
                <a-col v-for="(result,index) in target.indexItem.result" :key="index">
                  <span v-if="result.type==='range'">{{ result | getRange(target.coefficient) }}</span>
                  <span v-if="result.type==='simple'">{{ result.name }}</span>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getHealthIndex } from '@/api/health'
import { editChronic } from '@/api/chronic'

export default {
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
            formData: {},
            editVisible: false,
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
        openModel () {
            // console.log('进入编辑')
            this.editVisible = true
        },
        getChronicData (data) {
            // 需要解除双向绑定，不然在编辑框改变数据，table里面的数据也会跟着变
            const editData = JSON.parse(JSON.stringify(data))
            // console.log('获取编辑的数据', editData)
            this.formData = editData
        },
        handleOk () {
            const apiData = this.formData
            const diseaseId = apiData.id
            editChronic(diseaseId, apiData).then(res => {
                if (res.status === 200) {
                    // console.log('编辑成功')
                    this.$message.info('成功编辑慢病')
                    this.$parent.upDataChronic() // 编辑后触发父组件刷新
                    this.editVisible = false
                }
            })
            // console.log('确定', this.formData)
        },
        handleCancel () {
            this.editVisible = false
            // console.log('取消')
        },
        filterOption (value, option) {
          return option.componentOptions.children[0].text.indexOf(value) >= 0
        },
        addEdit () {
            const item = {
                timeid: new Date().getTime(),
                indexItem: {
                  id: null,
                  result: null
                },
                coefficient: 1
            }
            this.formData.items.push(item)
        },
        delEdit (item) {
            // console.log(item)
           this.formData.items = this.formData.items.filter(i => i.indexItem.id !== item.indexItem.id)
        },
        delEditEnd () {
            this.formData.items.pop()
        },
        changeIndex (id) {
          const targetArr = this.formData.items
          const indexArr = this.indexArr
          // console.log('结果', targetArr)
        //   console.log('指标', indexArr)
          // console.log('id', id)
          for (var j = 0; j < indexArr.length; j++) {
            if (indexArr[j].id === id) {
              // console.log('11', indexArr[j].result)
              for (var i = 0; i < targetArr.length; i++) {
                if (targetArr[i].indexItem.id === id) {
                  const result = indexArr[j].result
                  targetArr[i].indexItem.result = result
                }
              }
            }
          }
        }
    }
}
</script>
<style scoped>
.targetIcon{
  font-size: 24px;
}
</style>
