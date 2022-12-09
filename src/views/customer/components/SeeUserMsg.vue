<template>
  <div>
    <a-modal
      :title="'个人信息【'+ seeData.member.baseInfo.name +'】'"
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
                <span class="info_index">{{ seeData.member.baseInfo.name }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >民族：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.member.baseInfo.ethnicGroups }}</span>
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
                <span class="info_index">{{ seeData.member.baseInfo.idType }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >证件号码：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.member.baseInfo.idNo }}</span>
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
                <span class="info_index">{{ seeData.member.baseInfo.gender }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >出生日期：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.member.baseInfo.birthDate | filterBirth }}</span>
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
                <span class="info_index">{{ seeData.member.baseInfo.birthDate | filterAge }}</span>
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
                <span class="info_index">{{ seeData.member.baseInfo.phoneNumber }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >教育背景：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.member.baseInfo.eduBG }}</span>
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
                <span class="info_index">{{ seeData.member.baseInfo.aboBloodType }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >Rh血型：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.member.baseInfo.rhBloodType }}</span>
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
                <span class="info_index">{{ seeData.member.baseInfo.contactName }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >联系人电话：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.member.baseInfo.contactNumber }}</span>
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
                <span class="info_index">{{ seeData.member.baseInfo.province + seeData.member.baseInfo.city + seeData.member.baseInfo.area + seeData.member.baseInfo.street }}</span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row class="info">
              <a-col :span="8" class="info_title">
                <span >详细住址：</span>
              </a-col>
              <a-col :span="12">
                <span class="info_index">{{ seeData.member.baseInfo.homeAddress }}</span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>
<script>
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
        wrapperCol: { span: 16 }
    }
    },
    methods: {
    closeSeeModal () {
        this.$emit('closeSeeModal')
    }
    },
    created () {
    },
    mounted () {
    //   console.log(this.seeData)
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
