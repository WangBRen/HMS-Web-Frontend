<template>
  <div>
    <a-card class="chronicCard" :bordered="false">
      <a-row>
        <a-col :span="4">
          <a-button type="primary" @click="addChronic">新建慢病</a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-table class="chronicTable" :columns="columns" :data-source="tableData" :rowKey="record=>record.id">
      <span slot="items" slot-scope="text, record">
        <!-- <a>{{ record.items }}</a> -->
        <a-tag v-for="(item,index) in record.items" :key="index">{{ item.indexItem.name }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="editChronicTable(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="delChronicTable(record)">删除</a>
      </span>
    </a-table>
    <a-modal
      title="新建慢病"
      :visible="addChronicIndexVisible"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="700">
      <a-form-model ref="formData" :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- <a-button @click="resetForm">清空</a-button> -->
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="慢性病" prop="name">
              <a-input placeholder="请输入慢性病的名称" v-model="formData.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="描述" prop="describe">
              <a-textarea v-model="formData.describe" placeholder="请输入慢性病的描述" :rows="4" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-divider type="horizontal" />
        <a-row>
          <a-col>
            <span style="font-size: 16px;">指标</span>
            <a-icon @click="addTargetArr" type="plus-circle" />
            <a-icon @click="delTargetArrEnd" type="minus-circle" />
          </a-col>
        </a-row>
        <a-row v-for="target in formData.targetArr" :key="target.id">
          <a-col>
            <a-form-model-item label="指标名">
              <a-row>
                <a-col :span="18">
                  <getChronicName
                    @change="({ id }) => { target.indexItemId = id }"
                    :indexArr="indexArr"
                  />
                </a-col>
                <a-col :span="6" style="text-align: center;margin: 0 auto;">
                  <a-icon class="targetIcon" @click="addTargetArr" type="plus-circle" />
                  <a-icon class="targetIcon" @click="delTargetArr(target)" type="minus-circle" />
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col v-show="target.indexItemId">
            <a-form-model-item label="系数">
              <a-row>
                <a-col :span="12">
                  <a-slider
                    v-model="target.coefficient"
                    :default-value="2"
                    :min="0"
                    :max="10"
                    :step="0.01"
                    @afterChange="changeIndex(target.indexItemId, target.coefficient)"/>
                </a-col>
                <a-col :span="6" :push="1">
                  <a-input-number @change="changeIndex(target.indexItemId, target.coefficient)" v-model="target.coefficient" :min="0" :max="10"></a-input-number>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col v-show="target.indexItemId">
            <a-form-model-item label="结果">
              <a-row>
                <a-col v-for="(result,index) in target.result" :key="index">
                  <span v-if="result.type==='range'">{{ result | getRange(target.coefficient) }}</span>
                  <span v-if="result.type==='simple'">{{ result.name }}</span>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
    <editChronice ref="editChronic"/>
  </div>
</template>

<script>
import { getHealthIndex } from '@/api/health'
import { addChronic, getChronic } from '@/api/chronic'
import getChronicName from './components/HealthChronicName.vue'
import editChronice from './HealthChronicEdit.vue'
export default {
    components: {
      getChronicName,
      editChronice
    },
    data () {
        return {
          columns: [
            {
              title: '慢性病名',
              dataIndex: 'name',
              key: 'name'
            },
            {
              title: '慢性病描述',
              dataIndex: 'describe',
              key: 'describe'
            },
            {
              title: '指标',
              dataIndex: 'items',
              key: 'items',
              scopedSlots: { customRender: 'items' }
            },
            {
              title: '操作',
              key: 'action',
              scopedSlots: { customRender: 'action' }
            }
          ],
          tableData: [],
          formData: {
            name: null,
            describe: null,
            targetArr: []
          },
          indexArr: [
          ],
          targetArr: [
          ],
          addChronicIndexVisible: false,
          labelCol: { span: 4 },
          wrapperCol: { span: 16 }
        }
    },
    filters: {
      getRange: function (value, num) {
            // 判断范围或数值
            if (value.type === 'range') {
              // 范围
              if (value.start === null) {
                // 无上界
                return `${value.name}:\t ${(value.end * 1 + num * 1).toFixed(2) || 'INF'} > 指标值 (${value.unit})`
              } else if (value.end === null) {
                // 无下界
                return `${value.name}:\t ${(value.start * 1 - num * 1).toFixed(2) || 'INF'} ≤ 指标值 (${value.unit})`
              } else {
                return `${value.name}:\t ${(value.start * 1 + num * 1).toFixed(2) || 'INF'} ≤ 指标值 < ${(value.end * 1 + num * 1 || 'INF').toFixed(2)} (${value.unit})`
              }
            } else if (value.type === 'simple') {
            // 数值
              return value.value
            }
        }
    },
    created () {
      this.$setPageDataLoader(this.getChronic)
    },
    mounted () {
      // 获取指标
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
          // console.log('指标', this.indexArr)
        }
      })
      this.getChronic()
    },
    methods: {
        addChronic () {
            this.addChronicIndexVisible = true
            this.resetForm()
            // console.log('新建慢病')
        },
        handleOk () {
          const apiData = {
            name: this.formData.name,
            describe: this.formData.describe,
            items: this.formData.targetArr
          }
          addChronic(apiData).then(res => {
            if (res.status === 201) {
              // console.log('添加慢病成功，添加的数据', apiData)
              this.addChronicIndexVisible = false
              this.$message.info('成功添加慢病')
            }
          })
          // console.log('确定formData', this.formData)
          // console.log('确定apiData', apiData)
        },
        handleCancel () {
            this.addChronicIndexVisible = false
            // console.log('取消')
        },
        // 添加指标
        addTargetArr () {
          const item = {
            id: new Date().getTime(),
            indexItemId: null,
            coefficient: 1,
            result: null
            // 分割
          }
          this.formData.targetArr.push(item)
        },
        delTargetArrEnd () {
          this.formData.targetArr.pop()
        },
        delTargetArr (item) {
          //  const index = this.formData.targetArr.indexOf(item)
          //  console.log(item)
          //  this.formData.targetArr.splice(index, 1)
           this.formData.targetArr = this.formData.targetArr.filter(i => i.id !== item.id)
        },
        // 将输入的内容与显示的内容进行匹配
        filterOption (value, option) {
          return option.componentOptions.children[0].text.indexOf(value) >= 0
        },
        changeIndex (id, num) {
          // console.log('1')
          const targetArr = this.formData.targetArr
          const indexArr = this.indexArr
          // console.log('结果', targetArr)
          // console.log('指标', this.indexArr)
          // console.log('id', id, '系数', num)
          for (var j = 0; j < indexArr.length; j++) {
            if (indexArr[j].id === id) {
              // console.log('11', indexArr[j].result)
              for (var i = 0; i < targetArr.length; i++) {
                if (targetArr[i].indexItemId === id) {
                  const result = indexArr[j].result
                  targetArr[i].result = result
                }
              }
            }
          }
        },
        resetForm () {
          // console.log('清空')
          // 不用nextTick会报初始化错误
          this.$nextTick(() => {
            this.$refs.formData.resetFields()
          })
          this.formData.targetArr.length = 0
          this.$forceUpdate()
        },
        editChronicTable (data) {
          this.$refs.editChronic.openModel()
          this.$refs.editChronic.getChronicData(data)
          // console.log('编辑', data)
        },
        delChronicTable (data) {
          console.log('删除', data)
        },
        // 获取慢病表
        getChronic () {
          getChronic().then(res => {
            if (res.status === 200) {
              const resData = res.data.content
              this.tableData = resData
              // console.log('111', resData)
            }
          })
        },
        updateChronic () {
          // console.log('刷新了吗')
          this.getChronic()
        }
    }
}
</script>
<style scoped>
.ant-divider-horizontal{
  margin: 1px
}
.targetIcon{
  font-size: 24px;
}
/* .ant-card-body{
  padding: 10px;
} */
.chronicTable{
  background-color: white;
  padding: 0 20px;
}
</style>
