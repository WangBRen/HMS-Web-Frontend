<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
    </div>
    <div style="padding-bottom: 8px">
      <a-button type="primary" style="margin-right: 12px"> 新建指标项目 </a-button>
      <a-button type="primary" @click="openModal('create')"> 新建{{ data[currentTabKey - 1].name }}指标 </a-button>
    </div>
    <a-tabs v-model="currentTabKey">
      <a-tab-pane v-for="tab in data" :key="tab.id" :tab="tab.name" >
        <!-- <div style="padding-bottom: 42px">
          <a-button style="float: right" type="primary"> 新建{{ tab.name }}指标 </a-button>
        </div> -->
        <a-table
          row-key="id"
          size="small"
          :columns="columns"
          :data-source="tab.items"
          :scroll="scroll"
          :pagination="false"
        >
          <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
          <span slot="range" slot-scope="text">
            <div v-if="text.length" v-for="range_item in text" :key="range_item">
              <span v-if="range_item.type === 'simple'"> {{ range_item.name }} </span>
              <span v-if="range_item.type === 'range'">
                <div style="font-size: 12px">
                  <a-tag> {{ range_item.name }} </a-tag>:
                  <span v-if="range_item.gtEqual"> {{ range_item.gtEqual }} ≤ </span>
                  <span v-if="range_item.gtEqual && range_item.ltUnequal"> 且 </span>
                  <span v-if="range_item.ltUnequal"> < {{ range_item.ltUnequal }} </span>
                </div>
              </span>
            </div>
            <span v-if="!text.length"> - </span>
          </span>
          <span slot="result" slot-scope="text">
            <div v-if="text.length" v-for="range_item in text" :key="range_item">
              <span v-if="range_item.type === 'simple'"> {{ range_item.name }} </span>
              <span v-if="range_item.type === 'range'">
                <div style="font-size: 12px">
                  <a-tag> {{ range_item.name }} </a-tag>:
                  <span v-if="range_item.gtEqual"> {{ range_item.gtEqual }} ≤ </span>
                  <span v-if="range_item.gtEqual && range_item.ltUnequal"> 且 </span>
                  <span v-if="range_item.ltUnequal"> < {{ range_item.ltUnequal }} </span>
                </div>
              </span>
            </div>
            <span v-if="!text.length"> - </span>
          </span>
          <span slot="action" slot-scope="text, record">
            <a @click="openModal('edit', record)">编辑</a>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      :title="mode === 'create' ? '新建指标' : '编辑指标'"
      style="top: 20px"
      :width="800"
      v-model="visible"
      @ok="handleOkDone"
      ok-text="确定"
    >
      <a-form :form="form" v-model="current">
        <a-row :gutter="48">
          <a-col :span="12">
            <a-form-item label="指标名称">
              <a-input v-model="current.name" type="text" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="检测方式">
              <a-input v-model="current.testMethod" type="text" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :span="12">
            <a-form-item label="指标类型">
              <a-select v-model="current.type">
                <a-select-option value="Integer">整数</a-select-option>
                <a-select-option value="Float">小数</a-select-option>
                <a-select-option value="Text">主观文本</a-select-option>
                <a-select-option value="Report">图文报告</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="指标单位">
              <a-input v-model="current.unit" type="text" :disabled="!['Integer', 'Float'].includes(current.type)"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :span="12">
            <a-form-item label="检测频率">
              <a-input-group compact>
                <a-input v-model="current.testRateValue" type="number" addon-after="次" style="width: 70%" aria-autocomplete="inline"/>
                <div style="width: 5%; text-align: center; line-height: 2">/</div>
                <a-select v-model="current.testRateUnit" style="width: 25%; top: -1px">
                  <a-select-option value="年">年</a-select-option>
                  <a-select-option value="月">月</a-select-option>
                  <a-select-option value="周">周</a-select-option>
                  <a-select-option value="日">日</a-select-option>
                </a-select>
              </a-input-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="检测环境">
              <a-input type="text" v-model="current.testEnvironment"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="参考条件">
              <a-row
                v-for="condition in current.conditions"
                :key="condition.name"
                :gutter="24"
                style="padding: 12px 14px 12px 14px; margin: 12px 0; border: 1px #ddd dashed; border-radius: 8px;"
              >
                <div style="float: right; line-height: 12px;">
                  <a-icon type="close" @click="handleAddNewConditionRemove(condition)"/>
                </div>
                <a-col :span="24">
                  <a-col :span="2" style="white-space: nowrap; padding-left: 0;"> 数据类型： </a-col>
                  <a-col :span="8">
                    <a-select v-model="condition.name" @select="handleAddNewConditionSelectType(condition)" style="margin-left: 12px;">
                      <a-select-option value="性别">性别</a-select-option>
                      <a-select-option value="年龄">年龄</a-select-option>
                      <a-select-option value="时辰">时辰</a-select-option>
                      <a-select-option value="其它">其它</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="14" v-if="condition.name === '其它'">
                    <a-col :span="12">
                      <a-input placeholder="条件名称，如：孕期" style="margin-right: 12px;"/>
                    </a-col>
                    <a-col :span="12">
                      <a-select v-model="condition.type" style="margin-right: 12px;">
                        <a-select-option value="range">数值范围</a-select-option>
                        <a-select-option value="simple">选项</a-select-option>
                      </a-select>
                    </a-col>
                  </a-col>
                </a-col>
                <a-col :span="24">
                  <a-row :gutter="24">
                    <a-col :span="3" style="white-space: nowrap;"> 判定条件： </a-col>
                    <a-col :span="21" v-if="condition.type == 'range'" style="padding-left: 4px;">
                      <div v-if="condition.options" v-for="option in condition.options" :key="option">
                        <a-col :span="6" style="padding-left: 0px;">
                          <a-input type="text" v-model="option.name" placeholder="可选择项名称"/>
                        </a-col>
                        <a-col :span="17" style="display: flex; align-items: center;">
                          <a-input type="text" v-model="option.start" placeholder="数值下界" style="width: 40%" :addonAfter="condition.unit"/>
                          <div style="width: 20%; font-size: 12px; text-align: center; color: #999;"> ≤ 条件值 < </div>
                          <a-input type="text" v-model="option.end" placeholder="数值上界" style="width: 40%" :addonAfter="condition.unit"/>
                        </a-col>
                        <a-col :span="1">
                          <a-icon type="close" @click="handleAddNewConditionOptionRemove(condition, option)"/>
                        </a-col>
                      </div>
                      <a-button style="width: 100%" type="dashed" @click="handleAddNewConditionRange(condition)"> 增添一组条件选项 </a-button>
                    </a-col>
                    <a-col :span="21" v-if="condition.type == 'simple'" style="padding-left: 4px;">
                      <div>
                        <a-tag
                          type="text"
                          v-if="condition.options"
                          v-for="option in condition.options"
                          :key="option"
                          closable
                          @close="handleAddNewConditionOptionRemove(condition, option)"
                        >
                          {{ option.name }}
                        </a-tag>
                      </div>
                      <div style="width: 100%">
                        <a-col :span="9" style="padding: 0;">
                          <a-input type="text" v-model="condition.pending_value" placeholder="输入可选项"/>
                        </a-col>
                        <a-col :span="12" style="padding-left: 8px; top: -1px">
                          <a-button type="" @click="handleAddNewConditionOption(condition)"> 确认新增选项 </a-button>
                        </a-col>
                      </div>
                    </a-col>
                    <a-col :span="21" v-if="condition.type == 'text'" style="padding-left: 4px;">
                      <span style="color: #999; font-size: 12px;">< 录入指标数据时手动填写 ></span>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- <div style="margin-top: 12px; height: 1px; width: 100%; background: #ddd; clear: both;"/> -->
                <!-- <a-divider style="margin-top: 12px;"/> -->
              </a-row>
              <a-button @click="handleAddNewCondition" style="width: 100%" type="dashed"> 添加参考条件 </a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="参考结果">
              <a-row
                :gutter="24"
                style="padding: 12px 14px; margin: 12px 0; border: 1px #ddd dashed; border-radius: 8px;"
              >
                <a-col :span="12">
                  <a-col :span="5" style="white-space: nowrap; padding-left: 0;"> 数据类型： </a-col>
                  <a-col :span="19">
                    <a-select v-model="current.result.type" @select="handleAddNewResultSelectType(current.result)">
                      <a-select-option value="range">数值范围</a-select-option>
                      <a-select-option value="simple">主观选项</a-select-option>
                      <a-select-option value="text">主观文本</a-select-option>
                    </a-select>
                  </a-col>
                </a-col>
                <a-col :span="24">
                  <a-row :gutter="24">
                    <a-col :span="3" style="white-space: nowrap;"> 判定结果： </a-col>
                    <a-col :span="24" v-if="current.result.type == 'range'" style="padding-left: 12px;">
                      <div v-if="current.result.options" v-for="option in current.result.options" :key="option">
                        <a-col :span="4" style="padding-left: 0px;">
                          <a-input type="text" v-model="option.name" placeholder="名称，如：偏高、偏低、正常"/>
                        </a-col>
                        <a-col :span="19">
                          <div v-if="current.products" v-for="(prod, index) in current.products" :key="index">
                            <div>
                              <a-row>
                                <a-col :span="10">
                                  <span v-for="(opt, idx) in prod.list" :key="opt">
                                    <span v-if="idx > 0" style="padding-right: 4px;"> + </span>
                                    <a-tag> {{ opt.name }} </a-tag>
                                  </span>
                                  <span>:</span>
                                </a-col>
                                <a-col :span="14" style="display: flex; align-items: center;">
                                  <a-input type="text" v-model="option.start[index]" placeholder="数值下界" style="width: 40%" :addonAfter="current.unit"/>
                                  <div style="width: 20%; font-size: 12px; text-align: center; color: #999;"> ≤ 指标值 < </div>
                                  <a-input type="text" v-model="option.end[index]" placeholder="数值上界" style="width: 40%" :addonAfter="current.unit"/>
                                </a-col>
                              </a-row>
                            </div>
                          </div>
                          <div v-if="!current.products">
                            <a-col :span="24" style="display: flex; align-items: center;">
                              <a-input type="text" v-model="option.start" placeholder="数值下界" style="width: 40%" :addonAfter="current.unit"/>
                              <div style="width: 20%; font-size: 12px; text-align: center; color: #999;"> ≤ 指标值 < </div>
                              <a-input type="text" v-model="option.end" placeholder="数值上界" style="width: 40%" :addonAfter="current.unit"/>
                            </a-col>
                          </div>
                        </a-col>
                        <a-col :span="1">
                          <a-icon type="close" @click="handleAddNewResultOptionRemove(current.result, option)"/>
                        </a-col>
                      </div>
                      <a-button style="width: 100%" type="dashed" @click="handleAddNewResultRange(current.result)"> 增添一组结果选项 </a-button>
                    </a-col>
                    <a-col :span="24" v-if="current.result.type == 'simple'" style="padding-left: 12px;">
                      <div>
                        <a-tag
                          type="text"
                          v-if="current.result.options"
                          v-for="option in current.result.options"
                          :key="option"
                          closable
                          @close="handleAddNewResultOptionRemove(current.result, option)"
                        >
                          {{ option.name }}
                        </a-tag>
                      </div>
                      <div style="width: 100%">
                        <a-col :span="9" style="padding: 0;">
                          <a-input type="text" v-model="current.result.pending_value" placeholder="如：偏高、偏低、正常"/>
                        </a-col>
                        <a-col :span="12" style="padding-left: 8px; top: -1px">
                          <a-button type="" @click="handleAddNewResultOption(current.result)"> 确认新增选项 </a-button>
                        </a-col>
                      </div>
                    </a-col>
                    <a-col :span="24" v-if="current.result.type == 'text'" style="padding-left: 12px;">
                      <span style="color: #999; font-size: 12px;">< 录入指标数据时手动填写 ></span>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col>
            <a-form-item label="备注">
              <a-input type="textarea" v-model="current.remark"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
// import { STable } from '@/components'
import { listAllIndexes } from '@/api/health_indexes'
import { ref } from 'vue'

const columns = [
  {
    title: '指标名称',
    dataIndex: 'name',
    fixed: 'left',
    width: 140
  },
  {
    title: '检测方式',
    dataIndex: 'testMethod',
    width: 80
  },
  {
    title: '指标类型',
    dataIndex: 'type',
    width: 80,
    customRender: (text) => {
      switch (text) {
        case 'Integer':
        case 'Float':
          return '数值'
        case 'Text':
          return '主观文本'
        case 'Report':
          return '图文报告'
      }
      return '-'
    }
  },
  {
    title: '指标单位',
    dataIndex: 'unit',
    width: 80,
    customRender: (status) => {
      switch (status) {
        case 'inactive':
          return '未激活'
        case 'active':
          return '正常'
        case 'disable':
          return '不可用'
      }
      return status
    }
  },
  {
    title: '参考条件',
    dataIndex: 'range',
    width: 240,
    scopedSlots: { customRender: 'range' }
  },
  {
    title: '参考结果',
    dataIndex: 'result',
    width: 240,
    scopedSlots: { customRender: 'result' }
  },
  {
    title: '检测频率',
    dataIndex: 'testRate',
    width: 80,
    customRender: (text, record) => {
      if (record.testRateValue > 0) {
        return `${record.testRateValue}/${record.testRateUnit}`
      }
      return '-'
    }
  },
  {
    title: '检测环境',
    dataIndex: 'testEnvironment',
    width: 80
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 80
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 100,
    scopedSlots: { customRender: 'createTime' }
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'IndexPage',
  components: {
    // STable
  },
  data () {
    return {
      currentTabKey: null,
      // modal
      mode: 'create', // or: 'edit'
      visible: false,
      current: {
        // conditions: [{ id: new Date().getTime() }] // {name, options}
        result: {}
      },
      // form
      form: this.$form.createForm(this),
      // table
      columns,
      scroll: { x: true },
      data: []
    }
  },
  filters: {
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const resp = await listAllIndexes()
      if (resp.status === 200) {
        // reform data
        this.data = resp.data || []
        if (!this.currentTabKey) {
          this.currentTabKey = ref(resp.data[0].id)
        }
      }
    },
    openModal (mode, record) {
      const reform = (data) => {
        if (!data) return null
        return { ...data }
      }
      this.mode = mode
      this.current = reform(record) || { type: 'Float', result: { type: 'range' } }
      this.visible = true
      this.updateCurrentProducts()
    },
    closeModal () {
      this.visible = false
    },
    updateCurrentProducts () {
      const descartProduct = (bilist) => {
        const list = bilist.reduce((a, b) => {
          return a.map(item => b.map(i => [i].concat(item).reverse())).reduce((c, d) => c.concat(d), [])
        })
        // console.log({ bilist, list }, bilist.length, list.length)
        if (bilist.length === 1) {
          return list.map(item => [item])
        }
        return list
      }
      const conditions = this.current.conditions || []
      // make cross prod, object: {name, type, value, start, end}
      const result = conditions.map(cond => cond.options || []).filter(opts => opts.length > 0)
      console.log('current products', descartProduct(result))
      const products = descartProduct(result).map(prod => {
        return { list: prod, name: 'descart-placeholder', start: null, end: null, value: null }
      })
      // if result.type === range
      const options = this.current.result.options.map(option => {
        return { ...option, start: [] }
      })
      this.current.products = products
      this.current.result.options = options
    },
    handleAddNewConditionSelectType (condition) { // reset options
      // console.log(condition)
      switch (condition.name) {
        case '性别':
          condition.type = 'simple'
          condition.options = [
            { id: 1, type: 'simple', name: '男' },
            { id: 2, type: 'simple', name: '女' }
          ]
          break
        case '年龄':
          condition.type = 'range'
          condition.unit = '岁'
          condition.options = [
            { id: 1, type: 'range', name: '未成年', start: 0, end: 18 },
            { id: 2, type: 'range', name: '成年', start: 18, end: 100 }
          ]
          break
        case '时辰':
          condition.type = 'range'
          condition.unit = '时'
          condition.options = [
            { id: 1, type: 'range', name: '凌晨', start: 0, end: 6 },
            { id: 2, type: 'range', name: '上午', start: 6, end: 12 },
            { id: 3, type: 'range', name: '下午', start: 12, end: 18 },
            { id: 4, type: 'range', name: '晚上', start: 18, end: 24 }
          ]
          break
        case '其它':
          condition.type = 'range'
          condition.unit = ''
          condition.options = []
      }
      this.updateCurrentProducts()
    },
    handleAddNewCondition () {
      const conditions = this.current.conditions || []
      conditions.push({ id: new Date().getTime(), name: '', type: 'range', options: [] })
      this.current = { ...this.current, conditions }
      this.updateCurrentProducts()
    },
    handleAddNewConditionRemove (condition) {
      this.current.conditions = (this.current.conditions || []).filter(cond => cond.id !== condition.id)
      this.updateCurrentProducts()
    },
    handleAddNewConditionOption (condition) { // type: simple
      if (!condition.pending_value || !condition.pending_value.trim()) {
        console.log('Value Not Valid')
        return
      }
      const options = condition.options || []
      options.push({ id: new Date().getTime(), name: condition.pending_value })
      condition.options = options
      condition.pending_value = ''
      this.updateCurrentProducts()
    },
    handleAddNewConditionRange (condition) { // type: range
      const options = condition.options || []
      options.push({ id: new Date().getTime(), name: '', start: null, end: null })
      condition.options = options
      this.updateCurrentProducts()
    },
    handleAddNewConditionOptionRemove (condition, option) {
      condition.options = condition.options.filter(op => op.id !== option.id)
      this.updateCurrentProducts()
    },
    handleAddNewResultSelectType (condition) {
      switch (condition.type) {
        case 'range':
          condition.options = [{ id: new Date().getTime(), name: '示例', start: 0, end: 8 }]
          condition.pending_value = ''
          break
        case 'simple':
        case 'text':
          condition.options = []
          condition.pending_value = ''
          break
      }
    },
    handleAddNewResultOption (condition) { // type: simple
      if (!condition.pending_value || !condition.pending_value.trim()) {
        console.log('Value Not Valid')
        return
      }
      const options = condition.options || []
      options.push({ id: new Date().getTime(), name: condition.pending_value })
      condition.options = options
      condition.pending_value = ''
      this.$forceUpdate()
    },
    handleAddNewResultRange (condition) { // type: range
      console.log({ condition })
      const options = condition.options || []
      options.push({ id: new Date().getTime(), name: '', start: null, end: null })
      condition.options = options
      this.$forceUpdate()
    },
    handleAddNewResultOptionRemove (result, option) {
      result.options = result.options.filter(op => op.id !== option.id)
    },
    handleOkDone (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // download files
          const a = document.createElement('a')
          a.id = 'account-gen-a'
          a.href = `/api/users/generate/${values.roleId}/${values.amount}/自动生成账户（${values.amount}个）.xlsx`
          a.target = '_blank'
          document.body.appendChild(a)
          a.click()
          document.getElementById('account-gen-a').remove()
        }
      })
    },
    // 原方法：
    handleEdit (record) {
      this.visible = true
      console.log('record', record)

      const checkboxGroup = {}
      this.permissions = record.permissions.map(permission => {
        const groupKey = `permissions.${permission.permissionId}`
        checkboxGroup[groupKey] = permission.actionList
        const actionsOptions = permission.actionEntitySet.map(action => {
          return {
            label: action.describe,
            value: action.action,
            defaultCheck: action.defaultCheck
          }
        })
        return {
          ...permission,
          actionsOptions
        }
      })

      this.$nextTick(() => {
        console.log('permissions', this.permissions)
        console.log('checkboxGroup', checkboxGroup)

        this.form.setFieldsValue(pick(record, ['id', 'status', 'describe', 'name']))
        this.form.setFieldsValue(checkboxGroup)
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(err, values)
      })
    }
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>

</style>
