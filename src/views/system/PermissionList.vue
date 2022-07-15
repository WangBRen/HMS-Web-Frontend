<template>
  <div>
    <a-row>
      <a-col>
        <a-button type="primary" @click="showAddModal">新建</a-button>
        <a-button @click="jiekou">点</a-button>
      </a-col>
    </a-row>

    <a-table :columns="columns" :row-key="record => record.id" :data-source="data" style="background-color:white">
      <!-- <a slot="displayName" slot-scope="displayName">{{ displayName }}</a> -->
      <span slot="permissions" slot-scope="permissions">
        <a-tag
          v-for="tag in permissions"
          :key="tag.permission"
        >
          <a-tooltip>
            <template slot="title">
              {{ tag.des }}
            </template>
            {{ tag.permission }}
          </a-tooltip>
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <!-- <a>Invite {{ record.name }}</a> -->
        <a @click="showEditModal(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="showDelModal(record)">删除</a>
      </span>
    </a-table>

    <!-- 新建窗口 -->
    <a-modal destroyOnClose title="新建窗口" :visible="addVisible" @ok="addOk" @cancel="addCancel">
      <h1>我是新建</h1>
    </a-modal>

    <!-- 编辑窗口 -->
    <a-modal
      destroyOnClose
      title="编辑窗口"
      :visible="editVisible"
      @ok="editOk"
      @cancel="editCancel">
      <div class="editModal">
        <h1>{{ this.editData.displayName }}</h1>
        <a>{{ this.editData.description }}</a>
        <!-- <a>{{ this.editData.permissions[0] }}</a> -->
        <a-table :data-source="editTabData" :columns="editColumns" :row-key="record => record.permission">
          <span slot="canCreate" slot-scope="text, record">
            <a-checkbox v-model="record.canCreate" :defaultChecked="record.canCreate" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="canDelete" slot-scope="text, record">
            <a-checkbox v-model="record.canDelete" :defaultChecked="record.canDelete" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="canView" slot-scope="text, record">
            <a-checkbox v-model="record.canView" :defaultChecked="record.canView" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="canEdit" slot-scope="text, record">
            <a-checkbox v-model="record.canEdit" :defaultChecked="record.canEdit" @change="onChange">
            </a-checkbox>
          </span>
          <span slot="all" slot-scope="text, record">
            <a @click="onCheckAll(record)">全选</a>
          </span>
        </a-table>
      </div>
    </a-modal>
    <!-- 删除窗口 -->
    <a-modal
      class="delModal"
      title="删除窗口"
      :visible="delVisible"
      @ok="delOk"
      @cancel="delCancel">
      <div>
        <span>你确定要删除<span style="color:red">{{ this.delData.name }}</span>这个角色吗</span>
      </div>
    </a-modal>
  </div>
</template>
<script>

import { GetPermissionRoles, GetPermissionPermissions } from '@/api/permission'

export default {
  data () {
    return {
      // 权限表数据
      data: [
        {
          id: '1',
          displayName: '超级管理员',
          name: 'suproot',
          description: '我是超级管理员的描述',
          permissions: [
            { permission: '主页', des: '我是介绍1', canView: true, canEdit: true, canCreate: true, canDelete: true },
            { permission: '其他页1', des: '我是介绍2', canView: false, canEdit: true, canCreate: true, canDelete: false },
            { permission: '其他页2', des: '我是介绍3', canView: true, canEdit: false, canCreate: false, canDelete: true },
            { permission: '其他页3', des: '我是介绍4', canView: false, canEdit: false, canCreate: true, canDelete: true }
          ]
        },
        {
          id: '2',
          displayName: '管理员',
          name: 'root',
          description: '我是管理员的描述',
          permissions: [
            { permission: '主页', canView: true, canEdit: true, canCreate: true, canDelete: true },
            { permission: '其他页1', canView: false, canEdit: true, canCreate: true, canDelete: false },
            { permission: '其他页2', canView: true, canEdit: false, canCreate: false, canDelete: true }
          ]
        },
        {
          id: '3',
          displayName: '健康师',
          name: 'teacher',
          description: '我是健康师的描述',
          permissions: [
            { key: '1', permission: '主页', canView: true, canEdit: true, canCreate: true, canDelete: true },
            { key: '2', permission: '其他页1', canView: false, canEdit: true, canCreate: true, canDelete: false }
          ]
        }
      ],
      // 权限表列属性
      columns: [
        {
          dataIndex: 'displayName',
          key: 'displayName',
          // slots: { title: 'customTitle' },
          title: '角色',
          scopedSlots: { customRender: 'displayName' }
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '权限',
          key: 'permissions',
          dataIndex: 'permissions',
          scopedSlots: { customRender: 'permissions' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      addVisible: false,
      editVisible: false,
      delVisible: false,
      addData: '',
      editData: {
        permissions: []
      },
      // 初始化编辑权限表
      editPerTab: [
        { permission: '', des: '', canView: false, canEdit: false, canCreate: false, canDelete: false }
      ],
      editTabData: [
      ],
      editColumns: [
            {
              title: '',
              dataIndex: 'permission',
              key: 'permission'
            },
            {
              title: '增',
              key: 'canCreate',
              scopedSlots: { customRender: 'canCreate' }
            },
            {
              title: '删',
              key: 'canDelete',
              dataIndex: 'canDelete',
              scopedSlots: { customRender: 'canDelete' }
            },
            {
              title: '查',
              key: 'canView',
              dataIndex: 'canView',
              scopedSlots: { customRender: 'canView' }
            },
            {
              title: '改',
              key: 'canEdit',
              scopedSlots: { customRender: 'canEdit' }
            },
            {
              title: 'All',
              key: 'all',
              scopedSlots: { customRender: 'all' }
            }
      ],
      delData: ''
    }
  },
  mounted () {
    GetPermissionRoles().then(res => {
        if (res.status === 200) {
          console.log(res)
          this.data = res.data
        }
    })
  },
  methods: {
    onChange (e) {
      console.log('========', e.target.checked)
    },
    onCheckAll (e) {
      if (e.canCreate && e.canDelete && e.canEdit && e.canView) {
        console.log('全不选')
        e.canCreate = false
        e.canDelete = false
        e.canEdit = false
        e.canView = false
      } else {
        console.log('全选')
        e.canCreate = true
        e.canDelete = true
        e.canEdit = true
        e.canView = true
      }
    },
    showEditModal (editData) {
      this.editVisible = true
      this.editData = editData
      this.editTabData = editData.permissions
      console.log('传入修改的数据', this.editData)
      console.log('表格数据', this.editTabData)
    },
    showDelModal (delData) {
      this.delVisible = true
      this.delData = delData
      console.log('删除的数据', delData)
    },
    showAddModal () {
      this.addVisible = true
    },
    addOk () {
      this.addVisible = false
    },
    addCancel () {
      this.addVisible = false
    },
    editOk () {
      this.editVisible = false
    },
    editCancel () {
      this.editVisible = false
    },
    delOk () {
      this.delVisible = false
    },
    delCancel () {
      this.delVisible = false
    },
    jiekou () {
      GetPermissionPermissions().then(res => {
        console.log('1', res)
        console.log('==', this.editPerTab)
        // console.log(this.editData.permissions)
        // for (var i = 0; i < res.data.length; i++) {
        // }
      })
    }
  },
  computed: {
  }
}
</script>

<style>
.editModal{
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.delModal{
  text-align: center;
}
</style>
