<template>
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
  // props: {
  //   filtersVisible: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
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
  // computed: {
  // rowSelection () {
  //   return {
  //     onSelectChange: (selectedRowKeys, selectedRows) => {
  //       // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  //       const selectTitles = (selectedRows || []).map(item =>
  //         item.name
  //       )
  //       this.selectTitle = selectTitles
  //     },
  //     getCheckboxProps: record => ({
  //       props: {
  //         disabled: record.name === 'Disabled User', // Column configuration not to be checked
  //         name: record.name
  //       }
  //     })
  //    }
  //   }
  // },
  created () {
    this.onSearch()
  },
  methods: {
    async onSearch () {
      const res = await apiGethealthIndexes()
      console.log(res)
      this.tags = res.data || []
      //  const datas = (res.data || []).map(item => item.items).flat().map(col => {
      //   return {
      //     itemName: col.name
      //   }
      // })
      // const tagName = (res.data || []).map(item => {
      //  return {
      //   name: item.name,
      //    ...item.items.flat()
      //  }
      // })
      // console.log(tagName)
    },
    open () {
      // data.forEach(element => {
      //   this.checkArray[element] = true
      // })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      const selectTitles = (selectedRows || []).map(item =>
          item.name
        )
        this.selectTitle = selectTitles
    },
    handleOk () {
      const selectTitle = (this.selectedTags || []).map(item => item.name)
      this.$emit('filterTitlie', selectTitle)
      // this.$emit('',selectTitle)
    },
    handleCancel () {
      this.filtersVisible = false()
    },
    handleChange (tag, checked) {
      const { selectedTags } = this
      console.log('selectedTags=====>', selectedTags, 'checked', checked)
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter(t => t !== tag)
      console.log('选择的标签: ', nextSelectedTags)
      console.log('选择的key:', this.checkArray)
      this.selectedTags = nextSelectedTags
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
