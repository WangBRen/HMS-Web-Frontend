<template>
  <div>
    <a-table :columns="columns" :data-source="data">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <!-- <span slot="customTitle"><a-icon type="smile-o" /> Name</span> -->
      <span slot="mode" slot-scope="tags">
        <a-tag
          v-for="tag in tags"
          :key="tag"
          :color="tag === '短信' ? 'geekblue' : 'green'"
        >
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
      <span slot="action">
        <a>查看</a>
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '创建时间',
    dataIndex: 'creatAt',
    key: 'creatAt'
  },
  {
    title: '发送人',
    key: 'name',
    dataIndex: 'name'
    // slots: { title: 'customTitle' },
    // scopedSlots: { customRender: 'name' }
  },
  {
    title: '发送方式',
    key: 'mode',
    dataIndex: 'mode',
    scopedSlots: { customRender: 'mode' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const data = [
  {
    key: '1',
    name: 'John Brown',
    creatAt: '2022-10-25 17:29',
    mode: ['短信', '小程序']
  },
  {
    key: '2',
    name: 'Jim Green',
    creatAt: '2022-10-25 17:29',
    mode: ['短信']
  },
  {
    key: '3',
    name: 'Joe Black',
    creatAt: '2022-10-25 17:29',
    mode: ['小程序']
  }
]
export default {
  name: 'HealthCoachingRecords',
  data () {
    return {
      columns,
      data
    }
  }
}
</script>

<style>

</style>
