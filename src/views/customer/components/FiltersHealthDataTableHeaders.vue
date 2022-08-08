<template>
  <a-modal
    :width="1200"
    title="筛选需要查看的健康指标"
    :visible="filtersVisible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-card :bordered="false" class="search">
      <div>
        <div v-for="(tag,index) in tags" :key="index" class="tags-layout">
          <a-row>
            <a-col :span="4">
              <span class="span1">{{ tag.name }}:</span>
            </a-col>
            <a-col :span="20" :push="1.6">
              <span v-for="(item,i) in tag.items" :key="i" class="span2">
                <a-checkable-tag
                  v-model="checkArray[item.id]"
                  :key="i"
                  :checked="selectedTags.indexOf(item) > -1"
                  @change="checked => handleChange(item, checked)"
                >
                  {{ item.name }}
                </a-checkable-tag>
              </span>
            </a-col>
          </a-row>
          <!-- <span :style="{ marginRight: 8}" class="span1">{{ tag.name }}:</span>
          <span v-for="(item,id) in tag.items" :key="id" class="span2">
            <a-checkable-tag
              :key="id"
              :checked="selectedTags.indexOf(item) > -1"
              @change="checked => handleChange(item, checked)"
            >
              {{ item.name }}
            </a-checkable-tag>
          </span> -->
        </div>
      </div>
    </a-card>
  </a-modal>
</template>
<script>
import { gethealthIndexes as apiGethealthIndexes } from '@/api/healthIndexes'

/**
 * 测试用的
 */
// const plainOptions = []
// for (let i = 0; i < 100; i++) {
//   plainOptions.push(
//    {
//     title: `分类${i}`,
//     chlid: [
//       {
//         name: `血清支链氨基酸/芳香族氨基酸比值 ${i}`,
//         age: 32,
//         address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
//         tags: ['nice', 'developer']
//       }
//     ]
//    }
//   )
// }
export default {
  props: {
    saveTableTitle: {
      type: Array,
      default: function () {
      return []
     }
    },
    dataColums: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      indeterminate: true,
      checkAll: false,
      confirmLoading: false,
      checkedList: [],
      filtersVisible: false,
      selectTitle: [],
      tags: [],
      selectedTags: [],
      checkArray: [] // 通过双向绑定去该改变 是否被选中
    }
  },
  created () {
    this.onSearch()
    console.log('触发子组件')
  },
  methods: {
    async onSearch () {
      const res = await apiGethealthIndexes()
      this.tags = res.data || []
    },
    /**
     * 伪双向绑定
     */
    open (columns) {
      console.log(columns)
      this.filtersVisible = true
      this.onSearch()
      columns.forEach(element => {
        this.checkArray[element.key] = true // 父组件展示的列名这边显示为True
      })
      const tags = JSON.parse(window.localStorage.getItem('columns'))
      this.selectedTags = tags.map(i => {
        return {
          id: i.key
        }
      })
      console.log(this.selectedTags)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      const selectTitles = (selectedRows || []).map(item =>
          item.name
        )
        this.selectTitle = selectTitles
    },
    handleOk () {
    //   const selectTitle = []
    //   this.selectedTags.forEach(i => {
    //     selectTitle.push('field_' + i.id + '.value')
    // })
    // console.log(selectTitle)
      // const selectTitle = (this.selectedTags || []).map(item => {
      //   const field = 'field_' + item.id
      //   return {
      //       id: field + '.value'
      //     }
      // })
      const selectTitle = (this.selectedTags || []).map(item => 'field_' + item.id + '.value')
      window.localStorage.setItem('selectTitle', JSON.stringify(selectTitle) || [])
      this.$emit('parseColumns')
      this.filtersVisible = false
      // this.$emit('filterTitlie', selectTitle)
      // this.$emit('selectHealthTitles', selectTitle)
    },
    handleCancel () {
      this.filtersVisible = false
    },
    // removeDuplicatedTag (selectdTag = []) {
    //   const newArr = []
    //   selectdTag.forEach(item => {
    //     if (!newArr.includes(item)) {
    //       newArr.push(item)
    //     }
    //   })
    //   return newArr
    // },
    handleChange (tag, checked) {
      const { selectedTags } = this
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter(t => t.id !== tag.id)
      this.selectedTags = nextSelectedTags
      console.log(nextSelectedTags)
    }
  }
}
</script>
<style lang="less">
.ant-modal-title{
  font-size: 17px;
  font-weight: bold;
}
.tags-layout{
  line-height: 30px;
  //  display: inline !important;
   font-size: 16px;
  .span1{
    font-weight: bold;
    color: #000;
  }
  .span2{
    .ant-tag{
      font-size: 14px;
    }
    display: inline-block;
  }
}
</style>
