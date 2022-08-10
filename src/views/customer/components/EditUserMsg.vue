<template>
  <div>
    <a-modal
      :title="'编辑['+name+']的信息'"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="1200"
    >
      <a-tabs default-active-key="1" :tab-position="tabPosition">
        <a-tab-pane key="1" tab="基础信息更新">
          <a-form-model :model="userData" :label-col="labelCol" :wrapper-col="wrapperCol">
            <!-- <a-row>
              <a-col :span="24">
                <div class="editTitle">
                  姓名：{{ userData.nickname }}
                </div>
              </a-col>
            </a-row> -->
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="教育背景">
                  <a-select v-model="userData.baseInfo.eduBG">
                    <a-select-option v-for="(item,index) in eduBgEnum" :key="index" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="民族">
                  <a-select v-model="userData.baseInfo.ethnicGroups" show-search>
                    <a-select-option v-for="(item,index) in nationData" :key="index" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="血型">
                  <a-select v-model="userData.baseInfo.aboBloodType">
                    <a-select-option v-for="(item,index) in aboBloodTypeArr" :key="index" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="Rh血型">
                  <a-select v-model="userData.baseInfo.rhBloodType">
                    <a-select-option v-for="(item,index) in rhBloodTypeArr" :key="index" :value="item">
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="紧急联系人">
                  <a-input v-model="userData.baseInfo.contactName" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="联系人电话">
                  <a-input v-model="userData.baseInfo.contactNumber" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="20" :pull="2">
                <a-form-model-item label="住址">
                  <Address ref="address" @changes="getAddress($event)"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="详细地址">
                  <a-input v-model="userData.baseInfo.homeAddress"></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" tab="手机号码更新">
          手机号码编辑
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>
<script>
import Address from '@/components/CheckAddress/CheckAddress.vue'
import { editGroupCustomer } from '@/api/customer'
import { nation } from '../nation'
export default {
    components: {
      Address
    },
    data () {
      return {
        name: null,
        groupId: null,
        customerId: null,
        visible: false,
        userData: {
            nickname: null,
            baseInfo: {
                eduBG: null,
                ethnicGroups: null,
                aboBloodType: null,
                rhBloodType: null,
                contactName: null,
                contactNumber: null,
                homeAddress: null,
                province: null,
                city: null,
                area: null,
                street: null
            }
        },
        tabPosition: 'left',
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        eduBgEnum: [
          '研究生及以上',
          '本科',
          '高中',
          '初中',
          '小学',
          '其他'
        ],
        aboBloodTypeArr: [
          'A型', 'B型', 'O型', 'AB型', '不详'
        ],
        rhBloodTypeArr: [
          'Rh阴型', 'Rh阳型', '不详'
        ],
        nationData: nation()
      }
    },
    methods: {
      openModel () {
        this.visible = true
      },
      getUserData (groupId, data) {
        this.groupId = groupId
        const arrData = data.member
        this.customerId = arrData.id
        this.name = arrData.baseInfo.name
        this.userData.nickname = arrData.nickname
        this.userData.baseInfo.eduBG = arrData.baseInfo.eduBG
        this.userData.baseInfo.ethnicGroups = arrData.baseInfo.ethnicGroups
        this.userData.baseInfo.aboBloodType = arrData.baseInfo.aboBloodType
        this.userData.baseInfo.rhBloodType = arrData.baseInfo.rhBloodType
        this.userData.baseInfo.contactName = arrData.baseInfo.contactName
        this.userData.baseInfo.contactNumber = arrData.baseInfo.contactNumber
        this.userData.baseInfo.homeAddress = arrData.baseInfo.homeAddress
        this.userData.baseInfo.province = arrData.baseInfo.province
        this.userData.baseInfo.city = arrData.baseInfo.city
        this.userData.baseInfo.area = arrData.baseInfo.area
        this.userData.baseInfo.street = arrData.baseInfo.street
        const arrAddress = { province: arrData.baseInfo.province, city: arrData.baseInfo.city, area: arrData.baseInfo.area, street: arrData.baseInfo.street }
        // 不用nextTick会报初始化错误
        this.$nextTick(() => {
            this.$refs.address.setAddress(arrAddress)
        })
        // this.$refs.address.setAddress(arrAddress)
        console.log(groupId, '子组件', data)
      },
      callback (val) {
        console.log(val)
      },
      handleOk () {
        const groupId = this.groupId
        const customerId = this.customerId
        const data = this.userData
        editGroupCustomer(groupId, customerId, data).then(res => {
            if (res.status === 200) {
            //   this.$message.info(res.message)
              this.$message.info('修改成功')
            //   console.log('修改成功', res)
              this.visible = false
            }
        })
        console.log(groupId, customerId, '点击确定', data)
      },
      handleCancel () {
        this.visible = false
      },
      getAddress (value) {
        const arrData = this.userData.baseInfo
        arrData.province = value.pro
        arrData.city = value.city
        arrData.area = value.area
        arrData.street = value.street
        console.log('地址', value)
      }
    }
}
</script>

<style>
</style>
