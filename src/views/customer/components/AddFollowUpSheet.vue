<template>
  <div>
    <a-modal
      v-model="FollowUpSheetVisible"
      title="慢病随访单记录表"
      width="1100px"
      style="top: 10px"
    >
      <template #footer>
        <a-button @click="handlePreview">点击预览</a-button>
        <a-button type="primary" @click="handleSend">发送</a-button>
      </template>
      <div class="Tbody">
        <!-- 基础信息开始 -->
        <div class="SheetTitle">基础信息</div>
        <!-- <a-card title="基础信息" style="width: 300px"></a-card> -->
        <div class="BasicInformation">
          <span>姓名：{{ userInfo.name }}</span>
          <span>性别：{{ userInfo.gender }}</span>
          <span>年龄：{{ userInfo.age }}岁</span><br>
          <span>血型：{{ userInfo.aboBloodType }}</span>
          <span>本人电话：{{ userInfo.phoneNumber }}</span>
          <span>家人电话：{{ userInfo.contactNumber }}</span>
        </div>
        <div>
          <span style="display:inline-block; height:35px;line-height: 45px;">填写提示：</span>
          <a-textarea v-model="textareaValue" placeholder="请输入强调和提醒用户的话" />
        </div>
        <!-- 慢病选择开始 -->
        <div class="SheetTitle">慢病选择</div>
        <div class="addChronicBtn">
          <a-button @click="openChronicDiseaseModal" type="dashed" style="width: 30%;">
            <a-icon type="plus" /> 选择添加随访慢病
          </a-button>
          <a-modal v-model="ChronicDiseaseVisible" title="选择随访慢病" @ok="handleChronicDiseaseOK" width="600px">
            <a-row>
              <a-col :span="24" >
                <a-checkbox-group v-model="CheckedChronicDisease">
                  <a-checkbox :value="item.chronicDisease.name" v-for="item in ChronicDiseaseData" :key="item.id" class="checkbox">
                    {{ item.chronicDisease.name }}
                  </a-checkbox>
                </a-checkbox-group>
              </a-col>
            </a-row>
          </a-modal>
        </div>
        <span v-for="item in ChooseList" :key="item"><a-tag color="blue">{{ item }}</a-tag></span>
        <!-- 指标选择开始 -->
        <div class="SheetTitle">指标选择</div>
        <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false">
          <span slot="checked" slot-scope="text, record">
            <a-checkbox v-model="record.isChecked"/>
          </span>
          <span slot="TableInput" slot-scope="text, record">
            <a-input v-if="!record.isIndex" />
            <span>{{ text }}</span>
          </span>
          <span slot="TableSelect" slot-scope="text, record">
            <a-select v-if="!record.isIndex" :options="options" style="width: 110px"/>
            <span>{{ text }}</span>
          </span>
          <span slot="remarks" slot-scope="text, record">
            <a-textarea :defaultValue="record.remarks" placeholder="请输入备注" auto-size />
          </span>
          <span slot="operation" slot-scope="text, record">
            <a @click="disabled(record.id)">禁用</a>
          </span>
        </a-table>
        <a-button class="tableAddBtn" @click="handleAddIndex">添加一行新数据</a-button>
        <!-- 指标选择结束 -->
      </div>
    </a-modal>
  </div>
</template>

<script src="https://unpkg.com/@surely-vue/table"></script>
<script>
import { STable } from '@/components'
export default {
  name: 'AddFollowUpSheet',
  components: {
    STable
  },
  data () {
    return {
      userInfo: {
        age: ''
      },
      FollowUpSheetVisible: false,
      textareaValue: '',
      ChronicDiseaseData: [],
      ChronicDiseaseVisible: false,
      ChooseList: [],
      CheckedChronicDisease: [],
      columns: [
      {
        title: '是否必填',
        dataIndex: 'isChecked',
        width: '10%',
        align: 'center',
        scopedSlots: { customRender: 'checked' }
      },
      {
        title: '名称',
        dataIndex: 'IndexName',
        align: 'center',
        scopedSlots: { customRender: 'TableInput' }
      },
      {
        title: '值类型',
        dataIndex: 'type',
        align: 'center',
        scopedSlots: { customRender: 'TableSelect' }
      },
      {
        title: '单位',
        dataIndex: 'Unit',
        align: 'center',
        width: '12%',
        scopedSlots: { customRender: 'TableInput' }
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        align: 'center',
        scopedSlots: { customRender: 'remarks' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: '10%',
        scopedSlots: {
          customRender: 'operation'
        }
      }
      ],
      dataSource: [
      {
        key: '0',
        isChecked: false,
        IndexName: '舒张压',
        type: '数值',
        Unit: 'mmHg',
        remarks: '这个是舒张压',
        isIndex: true
      },
      {
        key: '1',
        isChecked: true,
        IndexName: '收缩压',
        type: '数值',
        Unit: 'mmHg',
        remarks: '',
        isIndex: true
      }
      ],
      editableData: {},
      options: [
      {
        value: '数值',
        label: '数值'
      },
      {
        value: '主观文本',
        label: '主观文本'
      },
      {
        value: '图文报告',
        label: '图文报告'
      },
      {
        value: '选项',
        label: '选项'
      }
      ]
    }
  },
  methods: {
    // 打开创建随访单弹窗
    openFollowUpSheet (ChronicDiseaseData = []) {
      this.ChronicDiseaseData = ChronicDiseaseData
      // this.ChronicDiseaseData = ChronicDiseaseData.map(item => {
      //   return { ...item, isCheckedChronicDisease: false }
      // })
      this.FollowUpSheetVisible = true
      this.userInfo = this.ChronicDiseaseData[0].customer.baseInfo
      var year = this.userInfo.idNo.slice(6, 10)
      var nowDate = new Date()
      this.userInfo.age = nowDate.getFullYear() - year

      console.log('this.userInfo', this.userInfo)
      this.dataSource = []
      this.ChooseList = []
    },
    handlePreview () {
      console.log('开始预览了')
    },
    handleSend () {
      console.log('发送成功')
    },
    openChronicDiseaseModal () {
        this.ChronicDiseaseVisible = true
        console.log('随访数据', this.ChronicDiseaseData)
    },
    handleChronicDiseaseOK () {
      console.log(this.CheckedChronicDisease)
      this.ChronicDiseaseVisible = false
      this.ChooseList = this.CheckedChronicDisease
    },
    onDelete (key) {
      this.dataSource.value = this.dataSource.value.filter(item => item.key !== key)
    },
    handleAddIndex () {
      const newData = {
        isIndex: false
      }
      this.dataSource.push(newData)
    },
    disabled (key) {

    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-modal-title{
  font-weight: bold;
  font-size: 26px;
  text-align: center;
  letter-spacing: 10px;
}
/deep/.ant-modal-header{
  padding: 26px 20px
}
/deep/.ant-modal-close-x{
  width: 75px;
  height: 75px;
  line-height: 75px;
}
.Tbody{
  width: 1000px;
  margin: 10px auto;
  padding: 30px;
  margin-top: 0;
  padding-top: 0;
}
.SheetTitle{
  font-size: 18px;
  font-weight: bold;
  margin: 18px 0;
  border-bottom: 6px solid #419FFF;
  height: 38px;
  padding: 10px;
  width: 100px;
}
.BasicInformation{
  border: 1px solid #ccc;
  padding: 15px 30px;
  span{
    display: inline-block;
    width: 280px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
}
.indexButton:active{
  background: #666;
}
.addChronicBtn{
  display:flex;
  justify-content:center;
  margin: 20px auto;

}
.tableAddBtn{
  width: 940px;
}
.checkbox{
  display: inline-block;
  width: 266px;
  height: 30px;
  margin-left: 8px;
}
</style>
