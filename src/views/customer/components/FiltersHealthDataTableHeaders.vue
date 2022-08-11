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
        <div class="tags-layout">
          <span v-for="(item,index) in tags" :key="index" class="span2">
            <a-checkable-tag
              :key="index"
              :checked="!item.hide"
              @change="checked => handleChange(item, checked)"
            >
              {{ item.title }}
            </a-checkable-tag>
          </span>
        </div>
      </div>
    </a-card>
  </a-modal>
</template>
<script>

export default {
  props: {
    columns: {
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
  },
  watch: {
    columns: {
      immediate: true, // 刷 新页面立即触发
      deep: true, // 深度监听
      handler (newCol, oldCol) {
        this.tags = newCol
        // console.log(this.tags)
      }
    }
  },
  methods: {
    /**
     * 伪双向绑定
     */
    open (columns) {
      this.filtersVisible = true
    },
    handleOk () {
      this.$emit('ok', this.tags)
      this.filtersVisible = false
    },
    handleCancel () {
      this.filtersVisible = false
    },
    handleChange (tag, checked) {
      this.tags.forEach(t => {
        if (t.key === tag.key) {
          tag.hide = !checked
        }
      })
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
