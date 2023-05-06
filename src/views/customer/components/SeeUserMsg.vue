<template>
  <div>
    <a-modal
      :title="'个人信息【'+ seeData.name +'】'"
      :visible="seeVisible"
      @cancel="closeSeeModal"
      v-if="seeVisible"
      :width="900"
    >
      <template slot="footer">
        <a-button @click="closeSeeModal">取消</a-button>
      </template>
      <div>
        <a-row >
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >姓名：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.name }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >民族：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.ethnicGroups }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >证件类型：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.idType }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >证件号码：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.idNo }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >性别：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.gender }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >出生日期：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.birthDate | filterBirth }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >年龄：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.birthDate | filterAge }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >手机号：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.phoneNumber }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >教育背景：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.eduBG }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >血型：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.aboBloodType }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >Rh血型：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.rhBloodType }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >紧急联系人：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.contactName }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >联系人电话：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.contactNumber }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >住址：</span>
              </a-col>
              <a-col :span="16">
                <span class="info_index">{{ seeData.province + seeData.city + seeData.area + seeData.street }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >详细住址：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.homeAddress }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >单位：</span>
              </a-col>
              <a-col :span="16">
                <span class="info_index">{{ seeData.company }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >社区：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.community }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <a-collapse style="margin:10px 28px;">
        <a-collapse-panel header="用户健康史">
          <div v-if="showHistory">
            <a-row style="height: 30px;">
              <a-col :span="3" class="info_title">
                <span >药物过敏史：</span>
              </a-col>
              <a-col :span="20">
                <a-tag class="info_index" v-for="(item,index) in healthHistoryData.drugAllergyHistory" :key="index">{{ item }}</a-tag>
              </a-col>
            </a-row>
            <a-row style="height: 30px;">
              <a-col :span="3" class="info_title">
                <span >暴露史：</span>
              </a-col>
              <a-col :span="20">
                <span class="info_index" v-for="(item,index) in healthHistoryData.exposureHistory" :key="index">【{{ item.species }}】{{ item.specificName }}、</span>
              </a-col>
            </a-row>
            <a-row style="height: 30px;">
              <a-col :span="3" class="info_title">
                <span >疾病史：</span>
              </a-col>
              <a-col :span="20">
                <span class="info_index" v-for="(item,index) in healthHistoryData.pastHistory.diseaseHistory" :key="index">
                  【{{ item.name }}
                  {{ item.time | moment('YYYY年MM月') }}
                  {{ item.specificName }}】
                </span>
              </a-col>
            </a-row>
            <a-row style="height: 30px;">
              <a-col :span="3" class="info_title">
                <span >手术史：</span>
              </a-col>
              <a-col :span="20">
                <span class="info_index" v-for="(item,index) in healthHistoryData.pastHistory.operationHistory" :key="index">
                  <a-tag>{{ item.name }}</a-tag>{{ item.time | moment('YYYY年MM月') }}
                </span>
              </a-col>
            </a-row>
            <a-row style="height: 30px;">
              <a-col :span="3" class="info_title">
                <span >外伤史：</span>
              </a-col>
              <a-col :span="20">
                <span class="info_index" v-for="(item,index) in healthHistoryData.pastHistory.traumaHistory" :key="index">
                  <a-tag>{{ item.name }}</a-tag>{{ item.time | moment('YYYY年MM月') }}
                </span>
              </a-col>
            </a-row>
            <a-row style="height: 30px;">
              <a-col :span="3" class="info_title">
                <span >输血史：</span>
              </a-col>
              <a-col :span="20">
                <span class="info_index" v-for="(item,index) in healthHistoryData.pastHistory.bloodTransfusionHistory" :key="index">
                  【{{ item.name }}-{{ item.rh }}-{{ item.time | moment('YYYY年MM月') }}】
                </span>
              </a-col>
            </a-row>
            <a-row style="height: 30px;">
              <a-col :span="3" class="info_title">
                <span >家族史：</span>
              </a-col>
              <a-col :span="20">
                <span class="info_index" v-for="(item,index) in healthHistoryData.familyHistory" :key="index">
                  {{ item.relation }} <a-tag color="blue" v-for="(item2,index2) in item.content" :key="index2">{{ item2 }}</a-tag>、
                </span>
              </a-col>
            </a-row>
            <a-row style="height: 30px;">
              <a-col :span="3" class="info_title">
                <span >遗传病史：</span>
              </a-col>
              <a-col :span="20">
                <span class="info_index" v-for="(item,index) in healthHistoryData.geneticHistory" :key="index">
                  <a-tag color="blue">{{ item }}</a-tag>
                </span>
              </a-col>
            </a-row>
            <a-row style="height: 30px;">
              <a-col :span="3" class="info_title">
                <span >残疾情况：</span>
              </a-col>
              <a-col :span="20">
                <span class="info_index" v-for="(item,index) in healthHistoryData.disability" :key="index"><a-tag>{{ item }}</a-tag></span>
                <a-tag v-if="healthHistoryData.otherDisability">{{ healthHistoryData.otherDisability }}</a-tag>
              </a-col>
            </a-row>
            <a-row style="height: 30px;">
              <a-col :span="4" class="info_title">
                <span >医疗支付方式：</span>
              </a-col>
              <a-col :span="20">
                <span class="info_index" v-for="(item,index) in healthHistoryData.paymentMethod" :key="index">{{ item }}、</span>
                <span>{{ healthHistoryData.otherPayMethod }}</span>
              </a-col>
            </a-row>
          </div>
          <div v-else>暂无健康史，你可以前往编辑页添加健康史</div>
        </a-collapse-panel>
      </a-collapse>
    </a-modal>
  </div>
</template>
<script>
import { getHealthHistory } from '@/api/customer'
export default {
    props: {
      seeVisible: {
          type: Boolean,
          default: false
      },
      seeData: {
          type: Object,
          default: function () {
          return {}
          }
      },
      customerId: {
        type: Number,
        default: null
      }
    },
    filters: {
    filterBirth: function (value) {
        const data = new Date(value)
        const year = data.getFullYear()
        const month = data.getMonth() + 1
        const day = data.getDay()
    //   console.log(year + '年' + month + '月' + day + '日')
        return year + '年' + month + '月' + day + '日'
    },
    filterAge: function (value) {
        const userYear = new Date(value).getFullYear()
        const userMonth = new Date(value).getMonth() + 1
        const userDay = new Date(value).getDay()
        const nowDate = new Date()
        const nowMonth = nowDate.getMonth() + 1
        const nowDay = nowDate.getDate
        let age = nowDate.getFullYear() - userYear
        if (nowMonth < userMonth || (userMonth === nowMonth && nowDay < userDay)) {
        return age--
        } else {
        return age
        }
    }
    },
    data () {
    return {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
        healthHistoryData: {
          drugAllergyHistory: []
        },
        showHistory: false
    }
    },
    methods: {
      closeSeeModal () {
          this.$emit('closeSeeModal')
      },
      async init () {
        const res = await getHealthHistory(this.customerId)
        if (res.status === 200) {
          this.showHistory = true
          this.healthHistoryData = res.data
        }
      }
    },
    created () {
    },
    mounted () {
      this.init()
      console.log('this.customerId', this.customerId)
    }
}
</script>
<style scoped>
.info{
height: 30px;
font-size: 16px;
}
.info_title{
text-align: right;
color: #666;
opacity:0.6;
}
</style>
