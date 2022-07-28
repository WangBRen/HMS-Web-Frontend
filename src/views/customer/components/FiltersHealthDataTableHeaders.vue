<template>
  <a-card :bordered="false" class="search">
    <div>
      <a-modal
        :width="1200"
        title="Title"
        :visible="filtersVisible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <div>
          <div :style="{ borderBottom: '1px solid #E9E9E9' }">
            <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
              全选
            </a-checkbox>
          </div>
          <br />
          <div :style="{display:'flex', margin: '20px' }">
            <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onChange" />
          </div>
        </div>
      </a-modal>
    </div>
  </a-card>
</template>
<script>
const plainOptions = []
for (let i = 0; i < 100; i++) {
  plainOptions.push({
    key: i,
    index: i,
    value: `血清支链氨基酸/芳香族氨基酸比值 ${i}`,
    label: `血清支链氨基酸/芳香族氨基酸比值 ${i}`
  })
}
export default {
  props: {
    filtersVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      indeterminate: true,
      checkAll: false,
      plainOptions,
      confirmLoading: false,
      checkedList: []
    }
  },
  methods: {
    onChange (checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length
      this.checkAll = checkedList.length === plainOptions.length
    },
    onCheckAllChange (e) {
      console.log(e)
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    handleOk () {
      console.log(plainOptions)
    },
    handleCancel () {
      this.$emit('handleCancel')
    }
  }
}
</script>
