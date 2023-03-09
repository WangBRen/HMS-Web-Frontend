<template>
  <div>
    <a-card>
      <a-tabs>
        <a-tab-pane v-for="tab in questData" :key="tab.id" :tab="tab.name">
          <!-- <a-table
            :scroll="{ y: 600 }"
            :columns="columns"
            :data-source="tab.quest"
            :pagination="false"
            row-key="id"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="actionModal(record)">操作</a>
            </span>
          </a-table> -->
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      questData: [
        {
          id: 1,
          name: '漏水',
          quest: [
            {
              id: 1,
              name: '漏水方案1',
              resolvent: '解决方法1'
            },
            {
              id: 2,
              name: '漏水方案2',
              resolvent: '解决方法2'
            }
          ]
        },
        {
          id: 2,
          name: '开关',
          quest: [
            {
              id: 1,
              name: '漏水方案1',
              resolvent: '解决方法1'
            },
            {
              id: 2,
              name: '漏水方案2',
              resolvent: '解决方法2'
            }
          ]
        }
      ],
      columns: [
        {
          title: '药物名',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '解决方法',
          dataIndex: 'resolvent',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    actionModal (data) {
      console.log(data)
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>

</style>
