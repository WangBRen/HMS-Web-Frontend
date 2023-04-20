<template>
  <div>
    <a-modal
      :width="1000"
      :visible="repairVisible"
      @cancel="closeRepairModals"
      :maskClosable="false"
      :footer="null"
      v-if="repairVisible"
    >
      <div class="form">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <!-- 客户信息 -->
        <div v-if="current>-1">
          <div style="font-size: 24px;color: rgba(0, 0, 0, 0.85);">客户信息</div>
          <a-descriptions bordered size="small">
            <a-descriptions-item label="客户名">
              {{ repairData.customerInfo.customerName }}
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">
              {{ repairData.customerInfo.customerPhone }}
            </a-descriptions-item>
            <a-descriptions-item label="购买日期">
              {{ repairData.customerInfo.purchaseDate | getDay }}
            </a-descriptions-item>
            <a-descriptions-item label="品牌">
              {{ repairData.customerInfo.brand }}
            </a-descriptions-item>
            <a-descriptions-item label="型号">
              {{ repairData.customerInfo.productModel }}
            </a-descriptions-item>
            <a-descriptions-item label="编号">
              {{ repairData.customerInfo.productNo || '---' }}
            </a-descriptions-item>
            <a-descriptions-item label="问题分类" :span="3">
              {{ repairData.customerInfo.problemCategory }}
            </a-descriptions-item>
            <a-descriptions-item label="问题描述" :span="3">
              {{ repairData.customerInfo.problemExplain || '---' }}
            </a-descriptions-item>
            <a-descriptions-item label="收货地址">
              {{ repairData.customerInfo.receiveAddress }}
            </a-descriptions-item>
            <a-descriptions-item label="上门地址">
              {{ repairData.customerInfo.isSameAddress? repairData.customerInfo.receiveAddress:repairData.customerInfo.serviceAddress }}
            </a-descriptions-item>
            <a-descriptions-item label="图片/视频">
              <div v-for="(file,index) in repairData.customerInfo.uploadImage" :key="index">
                <a :href="file.url" target="_blank">资料{{ index+1 }}</a>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <!-- 共用数据 -->
        <div>
          <div class="big_title">历史评估</div>
          <div style="" v-for="(item4,index4) in repairData.processes" :key="item4.id">
            <div style="font-size: 20px;color: rgba(0, 0, 0, 0.85);">第{{ index4+1 }}次评估：</div>
            <!-- 问题汇总 -->
            <a-descriptions style="padding: 0 10px;" :column="10" bordered size="small">
              <a-descriptions-item label="问题汇总" :span="10">
                <div v-for="(item5,index5) in item4.problems" :key="index5">
                  <div>问题{{ index5+1 }}：{{ item5.problemJudge.firstPro }} -> {{ item5.problemJudge.secondPro }}</div>
                </div>
              </a-descriptions-item>
              <a-descriptions-item label="问题解释" :span="10">
                {{ item4.problemExplain }}
              </a-descriptions-item>
              <a-descriptions-item label="技术支持" :span="10">
                {{ item4.technicalSupport }}
              </a-descriptions-item>
              <a-descriptions-item label="是否月结单" :span="2">
                {{ item4.monthlyStatement | filterBoolean }}
              </a-descriptions-item>
              <a-descriptions-item label="是否保修期" :span="2">
                {{ item4.isOverWarranty | filterBoolean }}
              </a-descriptions-item>
              <a-descriptions-item label="是否寄件" :span="2">
                {{ item4.needPieceSend | filterBoolean }}
              </a-descriptions-item>
              <a-descriptions-item label="是否上门" :span="2">
                {{ item4.needVisit | filterBoolean }}
              </a-descriptions-item>
              <a-descriptions-item label="是否支付" :span="2">
                {{ item4.payResult | filterBoolean }}
              </a-descriptions-item>
              <a-descriptions-item label="快递费" :span="2">
                {{ item4.expressCost }}
              </a-descriptions-item>
              <a-descriptions-item label="师傅报价" :span="2">
                {{ item4.afterSaleVisit.technicalPrice }}
              </a-descriptions-item>
              <a-descriptions-item label="配件费用" :span="2">
                {{ countPart(item4.afterSaleExpresses) }}
              </a-descriptions-item>
              <a-descriptions-item label="折扣" :span="2">
                {{ item4.discount }}折
              </a-descriptions-item>
              <a-descriptions-item label="总价" :span="2">
                {{ item4.totalCost }}
              </a-descriptions-item>
              <a-descriptions-item label="客户实际支付" :span="10">
                {{ item4.customerPay }}
              </a-descriptions-item>
              <a-descriptions-item v-if="item4.pays.length" label="支付时间" :span="4">
                {{ item4.pays[0].payTime | getTime }}
              </a-descriptions-item>
            </a-descriptions>
            <!-- 寄件汇总 -->
            <div v-if="item4.needPieceSend" style="padding: 0 10px;">
              <div style="font-size: 20px;">寄件汇总：</div>
              <a-descriptions bordered size="small">
                <a-descriptions-item label="寄件汇总" :span="3">
                  <div v-for="(item6, index6) in item4.afterSaleExpresses" :key="index6+'Expresses'">
                    <div>寄件名：{{ item6.pieceName }}&nbsp;&nbsp;数量：{{ item6.pieceNum }}&nbsp;&nbsp;寄件报价：{{ item6.piecePrice }} 元</div>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item v-if="item4.pieceDeliveryNo" label="寄件单号" :span="1">
                  {{ item4.pieceDeliveryNo }}
                </a-descriptions-item>
                <a-descriptions-item v-if="item4.pieceDeliveryNo" label="快递品牌" :span="1">
                  {{ item4.expressBrand }}
                </a-descriptions-item>
              </a-descriptions>
            </div>
            <!-- 上门信息 -->
            <div style="padding: 0 10px;" v-if="item4.needVisit && item4.afterSaleVisit.technicalName">
              <!-- <div style="padding: 0 10px;" v-if="item4.needVisit"> -->
              <div style="font-size: 20px;">上门信息：</div>
              <a-descriptions bordered size="small">
                <a-descriptions-item label="师傅平台">
                  {{ item4.afterSaleVisit.technicalPlatform }}
                </a-descriptions-item>
                <a-descriptions-item label="师傅单号">
                  {{ item4.afterSaleVisit.technicalServiceNo }}
                </a-descriptions-item>
                <a-descriptions-item label="师傅成本">
                  {{ item4.afterSaleVisit.technicalCost }} 元
                </a-descriptions-item>
                <a-descriptions-item label="师傅名称">
                  {{ item4.afterSaleVisit.technicalName }}
                </a-descriptions-item>
                <a-descriptions-item label="师傅手机号">
                  {{ item4.afterSaleVisit.technicalPhone }}
                </a-descriptions-item>
                <a-descriptions-item label="上门时间">
                  {{ item4.afterSaleVisit.visitTime | getTime }}
                </a-descriptions-item>
                <a-descriptions-item label="技术人员">
                  <span v-for="technician in item4.afterSaleVisit.technicianList" :key="technician">
                    {{ technician }}
                  </span>
                  <!-- {{ item4.afterSaleVisit.technician }} -->
                </a-descriptions-item>
                <a-descriptions-item label="技术电话">
                  <span v-for="technicianPhone in item4.afterSaleVisit.technicianPhoneList" :key="technicianPhone">
                    {{ technicianPhone }}
                  </span>
                  <!-- {{ item4.afterSaleVisit.technicianPhone }} -->
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </div>
        </div>
        <!-- 待评估 -->
        <div class="form_estimate" v-if="current === 0">
          <div class="form_estimateData" >
            <!-- 问题选择 -->
            <div class="form_estimateData_checkquestion">
              <div style="font-size: 24px;color: rgba(0, 0, 0, 0.85);"><span style="color: #f5222d;">* </span>问题判断：</div>
              <a-select @change="checkFirst" style="width: 200px" v-model="checkA">
                <a-select-option v-for="item in question" :key="item.name">
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <a-select :disabled="!secondArr.length" @change="checkSecond" v-model="checkB" style="width: 200px">
                <a-select-option v-for="item in secondArr" :key="item.name">
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <a-select :disabled="!thirdArr.length" @change="checkThird" v-model="checkH" style="width: 200px">
                <a-select-option v-for="item in thirdArr" :key="item.name">
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <a-button style="line-height: 30px;" :disabled="!checkH" @click="addQuestion">添加</a-button>
              <div style="padding: 0 10px;">
                <div v-show="revealMethod" style="font-size: 20px;color: rgba(0, 0, 0, 0.85);">解决方案：</div>
                <div style="margin-left: 10px;">{{ revealMethod }}</div>
              </div>
            </div>
            <!-- 问题汇总 -->
            <div>
              <span style="font-size: 24px;color: rgba(0, 0, 0, 0.85);">问题汇总：</span>
              <a-row style="margin: 10px;" v-for="item in gatherArr" :key="item.index">
                <a-col>
                  <span>问题详情：{{ item.problemJudge.firstPro }} ->{{ item.problemJudge.secondPro }} ->{{ item.problemJudge.thirdPro }}</span>
                  <span @click="delGather(item)">
                    <a-icon type="close-circle" />
                  </span>
                </a-col>
                <a-col>解决方案：{{ item.solution }}</a-col>
                <a-col>定位方法：{{ item.definitionMethod }}</a-col>
              </a-row>
            </div>
            <!-- 问题补充 -->
            <div>
              <a-form-model
                ref="extraForm"
                :rules="extraRules"
                :model="extraForm"
              >
                <a-row>
                  <a-col>
                    <a-form-model-item style="font-size: 24px;" label="问题解释" prop="problemePxplain">
                      <a-textarea v-model="extraForm.problemePxplain" :auto-size="{ minRows: 3, maxRows: 21 }" :maxLength="1000" placeholder="输入问题解释"></a-textarea>
                    <!-- <span v-if="medicineData.attention" style="position: relative;float: right;">{{ medicineData.attention.length }}/1000</span> -->
                    <!-- <span v-else style="position: relative;float: right;">0/1000</span> -->
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item style="font-size: 24px;" label="技术支持" prop="technicalSupport">
                      <a-textarea v-model="extraForm.technicalSupport" :auto-size="{ minRows: 3, maxRows: 21 }" :maxLength="1000" placeholder="输入问题解释"></a-textarea>
                    <!-- <span v-if="medicineData.attention" style="position: relative;float: right;">{{ medicineData.attention.length }}/1000</span> -->
                    <!-- <span v-else style="position: relative;float: right;">0/1000</span> -->
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>
            <!-- 选项 -->
            <!-- 是否月结单 -->
            <div>
              <span style="color: #f5222d;">* </span>月结单：
              <a-radio-group @change="onStatement" name="radioGroup">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </div>
            <!-- 是否在保修期 -->
            <div style="line-height: 40px;">
              <span style="color: #f5222d;">* </span>保修期：
              <a-radio-group @change="onGuarantee" name="radioGroup">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </div>
            <!-- 是否师傅上门 -->
            <div style="line-height: 40px;">
              <span style="color: #f5222d;">* </span>师傅上门：
              <a-radio-group @change="onVisit" name="radioGroup">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
              <span v-if="visitIndex">
                <a-select @change="checkFirstTechnical" style="width: 150px" v-model="checkF">
                  <a-select-option v-for="item in technicalData" :key="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
                <a-select @change="checkSecondTechnical" :disabled="!checkF" style="width: 150px" v-model="checkG">
                  <a-select-option v-for="item in technicalSecondData" :key="item.piecePrice">
                    {{ item.pieceName }}/{{ item.piecePrice }}
                  </a-select-option>
                </a-select>
              </span>
            </div>
            <!-- 是否配件寄送 -->
            <div style="line-height: 40px;">
              <span style="color: #f5222d;">* </span>配件寄送：
              <a-radio-group @change="onDelivery" name="radioGroup">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </div>
            <!-- 配件选择 -->
            <div v-if="deliveryIndex">
              <div>
                <span style="color: #f5222d;">* </span>
                <span>配件选择：</span>
                <a-select @change="checkFirstPart" style="width: 200px" v-model="checkC">
                  <a-select-option v-for="item in partData" :key="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
                <a-select :disabled="!secondPart.length" style="width: 200px" v-model="checkD">
                  <a-select-option v-for="item in secondPart" :key="item.pieceName">
                    {{ item.pieceName }}
                  </a-select-option>
                </a-select>
                <span> 数量：</span>
                <a-input-number :disabled="!checkD" v-model="checkE" id="inputNumber" :min="1"/>
                <a-button style="line-height: 30px;" :disabled="!checkE" @click="addPart">添加</a-button>
              </div>
            </div>
            <!-- 评估信息汇总 -->
            <div>
              <a-descriptions style="margin-top: 10px;" bordered size="small">
                <a-descriptions-item v-if="partArr.length" label="配件信息汇总" :span="3">
                  <div v-for="item in partArr" :key="item.index">
                    <span>配件名称：{{ item.pieceName }}&nbsp;</span>&nbsp;
                    <span>单个配件报价：{{ item.piecePrice }}元</span>&nbsp;
                    <span>数量：{{ item.pieceNum }}</span>&nbsp;
                    <span>配件库存：{{ item.pieceStock }}</span>&nbsp;
                    <span>
                      <a-icon @click="delPart(item)" type="close-circle" />
                    </span>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item v-if="partArr.length" label="配件价格" :span="3">
                  {{ countPart(partArr) }}
                </a-descriptions-item>
                <a-descriptions-item v-if="partArr.length" label="快递费用" :span="3">
                  <span v-if="!mailingCostIndex">
                    <a-input-number :min="0" v-model="mailingCost"></a-input-number>
                    <a-button style="line-height: 29px;" @click="okMailing">确认</a-button>
                  </span>
                  <span v-if="mailingCostIndex">
                    {{ mailingCost }}
                  </span>
                  <span></span>
                </a-descriptions-item>
                <a-descriptions-item v-if="visitIndex" label="师傅价格" :span="3">
                  {{ checkG }}
                </a-descriptions-item>
                <a-descriptions-item label="总价" :span="3">
                  {{ totalCost }}
                </a-descriptions-item>
                <a-descriptions-item label="优惠折扣" :span="3">
                  <div>
                    输入折扣：<a-input-number style="width: 60px;" :min="1" :max="10" v-model="discount" @change="onChangeDiscount"></a-input-number> 折 (需要则填写)
                  </div>
                  <div v-show="discount">
                    折扣理由：<a-input v-model="discountData" style="width: 400px;"></a-input>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item label="客户实际支付" :span="3">
                  {{ parseInt(priceSum * 100) / 100 }}
                </a-descriptions-item>
              </a-descriptions>
            </div>
            <div>
              <a-popconfirm title="确定评估？" @confirm="checkOk">
                <a-button style="text-align: center;" type="primary">评估</a-button>
              </a-popconfirm>
            </div>
          </div>
        </div>
        <!-- 已评估 -->
        <div class="form_estimateOk" v-if="current===1">
          <!-- 问题汇总 -->
          <div style="text-align: center;margin-top: 20px;">
            <div style="font-size: 24px;">等待客户支付</div>
            <a-popconfirm title="确定再评估？" @confirm="changeEdit">
              <a-button type="primary">再评估</a-button>
            </a-popconfirm>
          </div>
        </div>
        <!-- 已支付 -->
        <div class="form_pay" v-if="current===2">
          <div class="form_pay_title">填单</div>
          <a-form-model
            ref="payForm"
            style="padding: 10px;"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :model="payForm"
            :rules="payRules"
          >
            <!-- 寄件信息 -->
            <div v-if="repairData.processes[repairData.processes.length-1].needPieceSend">
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="寄件单号" prop="pieceDeliveryNo">
                    <a-input placeholder="请输入寄件单号" v-model="payForm.pieceDeliveryNo"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="快递品牌" prop="expressBrand">
                    <a-input placeholder="请输入快递品牌" v-model="payForm.expressBrand"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
            <!-- 上门信息 -->
            <div v-if="repairData.processes[repairData.processes.length-1].needVisit">
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="师傅平台" prop="technicalPlatform">
                    <a-input placeholder="请输入平台" v-model="payForm.technicalPlatform"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="师傅单号" prop="technicalServiceNo">
                    <a-input placeholder="请输入师傅单号" v-model="payForm.technicalServiceNo"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="师傅名称" prop="technicalName">
                    <a-input placeholder="请输入师傅名称" v-model="payForm.technicalName"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="师傅手机" prop="technicalPhone">
                    <a-input placeholder="请输入师傅手机" v-model="payForm.technicalPhone"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="师傅成本" prop="technicalCost">
                    <a-input-number placeholder="请输入师傅成本" style="width: 100%;" v-model="payForm.technicalCost" id="inputNumber" :min="0"/>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="上门时间" prop="visitTime">
                    <!-- <a-input v-model="payForm.visitTime"></a-input> -->
                    <a-date-picker
                      show-time
                      v-model="payForm.visitTime"
                      type="date"
                      placeholder="请选择上门时间"
                      style="width: 100%;"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="技术人员" prop="technicianList">
                    <!-- <a-input placeholder="请输入技术人员" v-model="payForm.technicianList"></a-input> -->
                    <a-select mode="multiple" placeholder="请输入技术人员" @change="checkTechnology" v-model="payForm.technicianList">
                      <a-select-option v-for="technology in technologyArr" :key="technology.nickname">
                        {{ technology.nickname }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <!-- <a-col :span="12">
                  <a-form-model-item label="技术电话" prop="technicianPhone">
                    <a-input placeholder="请输入技术电话" v-model="payForm.technicianPhone"></a-input>
                  </a-form-model-item>
                </a-col> -->
                <a-col v-if="payForm.technicianPhoneList.length" :span="12">
                  <a-form-model-item label="技术电话" prop="technicianPhoneList">
                    <span v-for="item in payForm.technicianPhoneList" :key="item">
                      {{ item }}&nbsp;
                    </span>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
            <!-- 确认 -->
            <div>
              <a-row style="text-align: center;">
                <a-col>
                  <a-popconfirm title="确定提交信息？" @confirm="onSubmit">
                    <a-button style="margin: 0 20px;" type="primary">确认</a-button>
                  </a-popconfirm>
                  <a-popconfirm title="确定重置信息？" @confirm="resetForm">
                    <a-button style="margin: 0 20px;">重置</a-button>
                  </a-popconfirm>
                </a-col>
              </a-row>
            </div>
          </a-form-model>
        </div>
        <!-- 待上门 -->
        <div class="form_come" v-if="current>2">
          <div style="margin-top: 20px;text-align: center;" v-if="current===3">
            <a-popconfirm title="确定售后问题解决？" @confirm="repairSucceeded">
              <a-button style="margin-right:20px;" type="primary">问题解决</a-button>
            </a-popconfirm>
            <a-popconfirm title="确定售后问题没有解决？" @confirm="repairFailed">
              <a-button>问题未解决</a-button>
            </a-popconfirm>
          </div>
        </div>
        <!-- 已解决 -->
        <div class="form_solve" v-if="current>3">
          <div style="font-size: 24px;text-align: center;">
            已解决
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { addProcess as apiAddProcess, updateStatus as apiUpdateStatus, updateProcess as apiUpdateProcess, getGuide as apiGetGuide, getParts as apiGetParts } from '@/api/afterSale'
import { getUserInfo as apiGetUserInfo } from '@/api/login'
import { getUserList as apiGetUserList } from '@/api/manage'
import moment from 'moment'

export default {
  props: {
    repairVisible: {
      type: Boolean,
      default: false
    },
    repairData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    current: {
      type: Number,
      default: 0
    }
  },
  filters: {
    filterBoolean (value) {
      if (value) {
        return '是'
      } else {
        return '否'
      }
    },
    getTime: function (value) {
      if (value === null) {
        return ''
      } else {
        return moment(value).format('YYYY-MM-DD HH:mm')
      }
    },
    getDay: function (value) {
      if (value === null) {
        return ''
      } else {
        return moment(value).format('YYYY-MM-DD')
      }
    }
  },
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      steps: [
        {
          title: '待评估'
        },
        {
          title: '已评估'
        },
        {
          title: '已支付'
        },
        {
          title: '待上门'
        },
        {
          title: '已解决'
        }
      ],
      question: [
        // {
        //   firstPro: '漏水',
        //   secondQuestion: [
        //     {
        //       name: '破洞',
        //       solution: '修补漏洞',
        //       definitionMethod: '外壁'
        //     }
        //   ]
        // }
      ],
      secondArr: [], // 二级问题
      thirdArr: [], // 三级问题
      revealMethod: '', // 解决方案展示
      definitionMethod: '', // 问题定位
      extraForm: {
        problemePxplain: null, // 问题解释
        technicalSupport: null // 技术支持
      },
      checkA: null,
      checkB: null,
      checkC: null,
      checkD: null,
      checkE: null,
      checkF: null,
      checkG: null,
      checkH: null,
      checkId: null,
      totalCost: 0, // 成本
      priceSum: 0, // 最终总价,客户支付
      mailingCost: 0, // 邮递费用
      mailingCostIndex: false,
      gatherArr: [], // 问题汇总
      guaranteeIndex: null, // 是否保修
      statementIndex: null, // 是否月结
      visitIndex: null,
      deliveryIndex: null,
      partArr: [], // 配件汇总
      // 配件库
      part: [
        {
          partTo: '第一类',
          partStore: [
            {
              pieceName: '零配件一',
              piecePrice: 10,
              pieceCost: 8
            }
          ]
        }
      ],
      discount: null, // 折扣
      discountData: '', // 折扣理由
      partData: [], // 去除师傅组的配件库
      technicalData: [], // 师傅组
      technicalSecondData: [], // 二级师傅组
      secondPart: [], // 二级配件库
      // 问题校验规则
      extraRules: {
        problemePxplain: [
          { required: true, message: '请输入问题解释', trigger: 'blur' }
        ]
      },
      // 支付校验规则
      payRules: {},
      payForm: {
        pieceDeliveryNo: null, // 寄件单号
        expressBrand: null, // 快递品牌
        technicalPlatform: null, // 师傅平台
        technicalServiceNo: null, // 师傅单号
        technicalName: null, // 师傅名字
        technicalCost: null, // 师傅成本
        technicalPhone: null, // 师傅手机号
        visitTime: null, // 上门时间
        technicianList: undefined, // 技术人员
        technicianPhone: null, // 技术人员电话
        technicianPhoneList: [] // 技术人员电话组
      },
      technologyArr: []
    }
  },
  methods: {
    closeRepairModals () {
    //   Object.assign(this.$data, this.$options.data())
      this.checkA = null
      this.checkB = null
      this.checkC = null
      this.checkD = null
      this.checkE = null
      this.checkF = null
      this.checkG = null
      this.revealMethod = null
      this.discountData = null
      this.guaranteeIndex = null
      this.statementIndex = null
      this.secondArr = []
      this.thirdArr = []
      this.gatherArr = []
      this.partArr = []
      this.mailingCost = 0
      this.discount = null
      this.visitIndex = null
      this.deliveryIndex = null
      this.extraForm.problemePxplain = null
      this.extraForm.technicalSupport = null
      if (this.current === 2) {
        this.$refs.payForm.resetFields()
        this.payForm.technicianList = undefined
        this.payForm.technicianPhoneList = []
      }
      this.$emit('closeRepairModal')
    },
    // 选择一级问题
    checkFirst (data) {
      // console.log('选择的', data)
      this.checkB = null
      this.checkH = null
      this.revealMethod = null
      this.definitionMethod = null
      this.secondArr = []
      this.thirdArr = []
      this.question.filter((item) => {
        if (item.name === data) {
          this.secondArr = item.children
        }
      })
      // console.log('solution', this.secondArr)
    },
    // 选择二级问题
    checkSecond (data) {
      this.checkH = null
      this.checkB = data
      // console.log('选择的', data)
      // console.log('二级问题', this.secondArr)
      this.secondArr.filter((item) => {
        if (item.name === data) {
          this.thirdArr = item.guides
          // this.revealMethod = item.solution
          // this.definitionMethod = item.definitionMethod
        }
      })
      // console.log('选择解决方法', this.checkB)
    },
    // 选择三级问题
    checkThird (data) {
      console.log(data)
      this.checkH = data
      this.thirdArr.filter((item) => {
        if (item.name === data) {
          this.revealMethod = item.solution
          this.definitionMethod = item.locationWay
          this.checkId = item.id
        }
      })
    },
    // 添加问题
    addQuestion () {
      const gatherAdd = {
        problemJudge: {
          firstPro: this.checkA,
          secondPro: this.checkB,
          thirdPro: this.checkH,
          checkId: this.checkId
        },
        solution: this.revealMethod,
        definitionMethod: this.definitionMethod
      }
      this.gatherArr.push(gatherAdd)
      this.checkA = null
      this.checkB = null
      this.checkH = null
      this.checkId = null
      this.revealMethod = null
      this.definitionMethod = null
      this.secondArr = []
      this.thirdArr = []
      // console.log(this.gatherArr)
      // console.log('checkId', this.checkId)
    },
    // 删除问题
    delGather (deldata) {
      // console.log('要删除的', deldata, '总的', this.gatherArr)
      const testData = this.gatherArr.filter(item => {
        // return item.problemJudge.thirdPro !== deldata.problemJudge.thirdPro
        return item.problemJudge.checkId !== deldata.problemJudge.checkId
      })
      this.gatherArr = testData
      // console.log('gatherArr', this.gatherArr)
    },
    // 选择一级配件
    checkFirstPart (data) {
      this.checkD = null
      this.checkE = null
      this.secondPart = []
      // console.log('选择后', this.part)
      this.part.filter(item => {
        if (item.belongPart === data) {
          const addData = {
            pieceName: item.name,
            piecePrice: item.price, // 报价
            pieceCost: item.cost, // 成本
            pieceStock: item.stock // 库存
          }
          this.secondPart.push(addData)
        }
      })
    },
    // 添加配件
    addPart () {
      // console.log(this.checkD)
      const partAdd = {}
      this.secondPart.filter(item => {
        if (item.pieceName === this.checkD) {
          partAdd.pieceName = item.pieceName
          partAdd.piecePrice = item.piecePrice
          partAdd.pieceCost = item.pieceCost
          partAdd.pieceStock = item.pieceStock
          partAdd.pieceNum = this.checkE
        }
      })
      if (this.partArr.length !== 0) {
        for (let i = 0; i < this.partArr.length; i++) {
          if (partAdd.pieceName === this.partArr[i].pieceName) {
            // console.log(partAdd, '相同', this.partArr)
            this.partArr[i].pieceNum += partAdd.pieceNum
            break
          } else if (i === this.partArr.length - 1) {
            // console.log('最后', partAdd)
            this.partArr.push(partAdd)
            break
          }
        }
      } else {
        this.partArr.push(partAdd)
      }
      // console.log('partAdd', partAdd)
      // console.log('this.partArr', this.partArr)
      this.checkC = null
      this.checkD = null
      this.checkE = null
      this.secondPart = []
    },
    // 删除配件
    delPart (deldata) {
      const testData = this.partArr.filter(item => {
        return item.pieceName !== deldata.pieceName
      })
      this.partArr = testData
      // console.log('gatherArr', this.gatherArr)
    },
    // 选择一级师傅
    checkFirstTechnical (data) {
      this.checkG = null
      this.technicalSecondData = []
      this.part.filter(item => {
        if (item.belongPart === data) {
          const addData = {
            pieceName: item.name,
            piecePrice: item.price, // 报价
            pieceCost: item.cost, // 成本
            pieceStock: item.stock // 库存
          }
          this.technicalSecondData.push(addData)
        }
      })
    },
    // 选择二级师傅
    checkSecondTechnical () {
      this.priceSum = 0
      this.totalCost = 0
      this.totalCost += this.checkG
      this.totalCost += this.mailingCost
      if (!this.guaranteeIndex) {
        this.priceSum += this.checkG
        this.priceSum += this.mailingCost
        this.partArr.map(item => {
          this.priceSum += item.piecePrice * item.pieceNum
          this.totalCost += item.piecePrice * item.pieceNum
        })
        if (this.discount) {
          // console.log('??')
          this.priceSum = this.priceSum * this.discount * 0.1
        }
      } else {
        this.partArr.map(item => {
          this.totalCost += item.piecePrice * item.pieceNum
        })
      }
    },
    checkOk () {
      const id = this.repairData.id
      const apiData = {
        problems: this.gatherArr, // 问题汇总
        problemExplain: this.extraForm.problemePxplain, // 问题解释
        technicalSupport: this.extraForm.technicalSupport, // 技术支持
        monthlyStatement: this.statementIndex, // 月结单
        isOverWarranty: this.guaranteeIndex, // 是否保修期
        needVisit: this.visitIndex, // 是否上门
        needPieceSend: this.deliveryIndex, // 是否寄件
        afterSaleExpresses: this.partArr, // 寄件汇总
        expressCost: this.mailingCost, // 快递费用
        totalCost: this.totalCost, // 总成本
        // customerPay: this.priceSum, // 客户支付
        customerPay: parseInt(this.priceSum * 100) / 100, // 客户支付
        payResult: false,
        discount: this.discount, // 折扣价格
        discountReason: this.discountData, // 折扣理由
        afterSaleVisit: {
          technicalPrice: this.checkG
        }
      }
      console.log('apiData', apiData)
      this.$refs.extraForm.validate(valid => {
        // 判断月结单
        let isStatement = true
        if (this.statementIndex === null) {
          isStatement = false
          this.$message.error('请选择月结单')
        }
        // 判断保质期
        // guaranteeIndex
        let isGuarantee = true
        if (this.guaranteeIndex === null) {
          isGuarantee = false
          this.$message.error('请选择保质期')
        }
        // 判断上门
        let isVisit = true
        if (this.visitIndex === null) {
          isVisit = false
          this.$message.error('请选择是否上门')
        } else {
          console.log(this.checkG)
          if (this.visitIndex === true) {
            if (!this.checkG) {
              isVisit = false
              this.$message.error('请选择上门信息')
            }
          }
        }
        // 判断寄件
        let isDelivery = true
        if (this.deliveryIndex === null) {
          isDelivery = false
          this.$message.error('请选择是否需要寄送配件')
        } else {
          if (this.deliveryIndex === true) {
            if (this.partArr.length === 0) {
              isDelivery = false
              this.$message.error('请选择配件')
            }
          }
        }
        // 判断折扣理由
        let validIndex = true
        if (this.discount) {
          if (!this.discountData) {
            validIndex = false
            this.$message.error('请输入折扣理由')
          }
        }
        if (valid && this.gatherArr.length !== 0 && validIndex && isVisit && isDelivery && isGuarantee && isStatement) {
          // console.log('校验ok')
           // 评估
          apiAddProcess(id, apiData).then(res => {
            if (res.status === 200) {
              this.$message.success('评估成功')
              // console.log('评估成功')
              // 获取登陆账户 - 客服
              apiGetUserInfo().then(res => {
                if (res.status === 200) {
                  // console.log(res.data.nickname)
                  const changeStatus = {
                    status: 'EVALUATED',
                    customerService: res.data.nickname
                  }
                  if (this.statementIndex === true) {
                    changeStatus.status = 'PAID'
                  }
                  // 改变状态
                  apiUpdateStatus(id, changeStatus).then(res => {
                    if (res.status === 200) {
                      this.$message.success('状态改变成功')
                      // console.log('状态改变成功')
                      this.closeRepairModals()
                      this.$parent.getAfterSaleData()
                    } else {
                      this.$message.error(res.message)
                    }
                  })
                } else {
                  this.$message.error(res.message)
                }
              })
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('请填入完整信息')
          // console.log('校验失败')
        }
      })
    },
    // 是否月结
    onStatement (e) {
      if (e.target.value) {
        this.statementIndex = true
      } else {
        this.statementIndex = false
      }
    },
    // 是否保质
    onGuarantee (e) {
      // this.guaranteeIndex = !this.guaranteeIndex
      if (e.target.value) {
        this.guaranteeIndex = true
      } else {
        this.guaranteeIndex = false
      }
    },
    // 是否上门
    onVisit (e) {
      // this.visitIndex = !this.visitIndex
      if (e.target.value) {
        this.visitIndex = true
      } else {
        this.visitIndex = false
      }
    },
    onDelivery (e) {
      this.checkC = null
      this.checkD = null
      this.checkE = null
      // this.deliveryIndex = !this.deliveryIndex
      this.partArr = []
      this.mailingCostIndex = false
      this.mailingCost = 0
      if (e.target.value) {
        this.deliveryIndex = true
      } else {
        this.deliveryIndex = false
      }
    },
    okMailing () {
      // console.log(this.priceSum, '邮递费用', this.mailingCost)
      this.priceSum = 0 // 总价0
      this.totalCost = 0
      this.mailingCostIndex = true
      if (this.guaranteeIndex) {
        // this.mailingCost = 0 // 快递0
        this.partArr.map(item => {
          this.totalCost += item.piecePrice * item.pieceNum
        }) // 配件
        this.totalCost += this.checkG // 师傅
        this.totalCost += this.mailingCost // 快递
      } else {
        this.partArr.map(item => {
          this.priceSum += item.piecePrice * item.pieceNum
          this.totalCost += item.piecePrice * item.pieceNum
        }) // 配件
        this.priceSum += this.checkG // 师傅
        this.totalCost += this.checkG // 师傅
        this.priceSum += this.mailingCost // 快递
        this.totalCost += this.mailingCost // 快递
      }
      if (this.discount) {
        // console.log('??')
        this.priceSum = this.priceSum * this.discount * 0.1
      }
    },
    repairSucceeded () {
      const id = this.repairData.id
      const changeStatus = {
        status: 'SOLVED'
      }
      apiUpdateStatus(id, changeStatus).then(res => {
        if (res.status === 200) {
          this.$message.success('状态改变成功')
          // console.log('状态改变成功')
          this.closeRepairModals()
          this.$parent.getAfterSaleData()
        } else {
          this.$message.error(res.message)
        }
      })
      // this.closeRepairModals()
      // console.log('成功')
    },
    repairFailed () {
      const id = this.repairData.id
      const changeStatus = {
        status: 'WAIT_EVALUATE'
      }
      apiUpdateStatus(id, changeStatus).then(res => {
        if (res.status === 200) {
          this.$message.success('状态改变成功')
          this.closeRepairModals()
          this.$parent.getAfterSaleData()
        } else {
          this.$message.error(res.message)
        }
      })
      // this.closeRepairModals()
      // console.log('失败')
    },
    onSubmit () {
      const id = this.repairData.id
      const processId = this.repairData.processes[this.repairData.processes.length - 1].id
      console.log(this.payForm)
      this.$refs.payForm.validate(valid => {
        if (valid) {
          const apiData = {
            pieceDeliveryNo: this.payForm.pieceDeliveryNo,
            expressBrand: this.payForm.expressBrand,
            afterSaleVisit: this.payForm
          }
          delete apiData.afterSaleVisit.pieceDeliveryNo
          delete apiData.afterSaleVisit.expressBrand
          apiUpdateProcess(id, processId, apiData).then(res => {
            if (res.status === 200) {
              // 获取登陆账户 - 内勤
              apiGetUserInfo().then(res => {
                if (res.status === 200) {
                  const changeStatus = {
                    status: 'WAIT_VISIT',
                    managerName: res.data.nickname
                  }
                  if (this.payForm.pieceDeliveryNo !== null) {
                    changeStatus.send = 'EXECUTED'
                  }
                  if (this.payForm.technicalName !== null) {
                    changeStatus.visit = 'EXECUTED'
                  }
                  // 改变状态
                  apiUpdateStatus(id, changeStatus).then(res => {
                    if (res.status === 200) {
                      this.$message.success('状态改变成功')
                      // console.log('状态改变成功')
                      this.closeRepairModals()
                      this.$parent.getAfterSaleData()
                    } else {
                      this.$message.error(res.message)
                    }
                  })
                } else {
                  this.$message.error(res.message)
                }
              })
            } else {
              this.$message.error(res.message)
            }
          })
          // console.log('校验ok', apiData)
        }
      })
    },
    resetForm () {
      // console.log('重置已支付表单', this.payForm)
      this.$refs.payForm.resetFields()
      this.payForm.technicianList = undefined
      this.payForm.technicianPhoneList = []
      // console.log('重置后', this.payForm)
    },
    changeEdit () {
      const id = this.repairData.id
      const changeStatus = {
        status: 'WAIT_EVALUATE'
      }
      apiUpdateStatus(id, changeStatus).then(res => {
        if (res.status === 200) {
          this.$message.success('状态改变成功')
          // console.log('状态改变成功')
          this.closeRepairModals()
          this.$parent.getAfterSaleData()
        } else {
          this.$message.error(res.message)
        }
      })
      // console.log('编辑')
    },
    onChangeDiscount () {
      // this.priceSum = this.priceSum * this.discount * 0.1
    },
    countPart (data) {
      let price = 0
      for (let i = 0; i < data.length; i++) {
        price += data[i].piecePrice * data[i].pieceNum
      }
      return price
    },
    // 将输入的内容与显示的内容进行匹配
    filterOption (value, option) {
      return option.componentOptions.children[0].text.indexOf(value) >= 0
    },
    checkTechnology (e) {
      // console.log(e)
      // console.log('this.technologyArr', this.technologyArr)
      const testData = []
      for (let i = 0; i < e.length; i++) {
        for (let j = 0; j < this.technologyArr.length; j++) {
          if (e[i] === this.technologyArr[j].nickname) {
            testData.push(this.technologyArr[j].telephone)
          }
        }
      }
      this.payForm.technicianPhoneList = testData
      // console.log(this.payForm.technicianPhoneList)
    }
  },
  created () {
  },
  mounted () {
    // 配件库
    const pages = { page: 0, size: 1 }
    apiGetParts(pages).then(res => {
      if (res.status === 200) {
        // this.$message.success('配件查询成功')
        // console.log('部分', res.data)
        pages.size = res.data.totalElements
        apiGetParts(pages).then(res => {
          if (res.status === 200) {
            const partTest = res.data.content
            // console.log('全部', partTest)
            this.part = partTest
            let aPart = []
            // 存储一级配件类名
            partTest.filter(item => {
              aPart.push(item.belongPart)
            })
            aPart = Array.from(new Set(aPart))
            // console.log('aPart', aPart)
            this.technicalData = aPart.filter(data => {
              return data === '师傅上门报价'
            })
            this.partData = aPart.filter(data => {
              return data !== '师傅上门报价'
            })
          }
        })
      } else {
        this.$message.error(res.message)
      }
    })
    apiGetGuide().then(res => {
      if (res.status === 200) {
        // console.log('question', this.question)
        this.question = res.data
        // console.log('res', res.data)
      }
    })
    const userPages = { page: 1, size: 1 }
    apiGetUserList(userPages).then(res => {
      if (res.status === 200) {
        userPages.size = res.data.totalElements
        apiGetUserList(userPages).then(res => {
          if (res.status === 200) {
            // console.log('所有信息', res.data.content)
            this.technologyArr = res.data.content.filter(item => {
              return item.roleName === 'After_salesDirector'
            })
            // console.log('userData', this.technologyArr)
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.error(res.message)
      }
    })
  },
  watch: {
    // 监听配件改变
    partArr: {
      handler (newData, oldData) {
        this.totalCost = 0
        this.mailingCost = 0
        this.mailingCostIndex = false
        this.partArr.map(item => {
          this.totalCost += item.piecePrice * item.pieceNum
        }) // 配件
        this.totalCost += this.checkG // 师傅
        this.totalCost += this.mailingCost // 快递
        if (this.guaranteeIndex) {
          this.priceSum = 0
        } else {
          this.priceSum = 0
          this.partArr.map(item => {
            this.priceSum += item.piecePrice * item.pieceNum
          }) // 配件
          this.priceSum += this.checkG // 师傅
        }
        if (this.discount) {
          this.priceSum = this.priceSum * this.discount * 0.1
        }
      },
      deep: true
    },
    // 监听是否保质
    guaranteeIndex () {
      // 总价 = 保质 + 师傅 + 配件 + 快递
      if (this.guaranteeIndex) {
        // this.mailingCost = 0 // 快递0
        // this.mailingCostIndex = true
        this.priceSum = 0 // 总价0
      } else {
        this.priceSum = 0
        this.partArr.map(item => {
          // this.mailingCostIndex = false
          this.priceSum += item.piecePrice * item.pieceNum
        }) // 配件
        this.priceSum += this.checkG // 师傅
        this.priceSum += this.mailingCost // 快递
        if (this.discount) {
          // console.log('??')
          this.priceSum = this.priceSum * this.discount * 0.1
        }
      }
    },
    // 监听是否上门
    visitIndex () {
      if (this.visitIndex) {
      } else {
        this.checkF = null
        this.checkG = null
        this.priceSum = 0
        this.totalCost = 0
        this.priceSum += this.mailingCost // 快递
        this.totalCost += this.mailingCost // 快递
        this.partArr.map(item => {
          this.priceSum += item.piecePrice * item.pieceNum
          this.totalCost += item.piecePrice * item.pieceNum
        }) // 配件
        if (this.discount) {
          // console.log('??')
          this.priceSum = this.priceSum * this.discount * 0.1
        }
      }
    },
    discount () {
      this.discountData = null
      this.priceSum = 0
      this.totalCost = 0
      this.priceSum += this.mailingCost // 快递
      this.totalCost += this.mailingCost // 快递
      this.priceSum += this.checkG // 师傅
      this.totalCost += this.checkG // 师傅
      this.partArr.map(item => {
        this.priceSum += item.piecePrice * item.pieceNum
        this.totalCost += item.piecePrice * item.pieceNum
      }) // 配件
      if (this.discount) {
        // console.log('??')
        this.priceSum = this.priceSum * this.discount * 0.1
      }
      if (this.guaranteeIndex) {
        this.priceSum = 0
      }
    },
    // 动态规则
    repairData (newData, oldData) {
      // console.log('repairData', newData, oldData)
      this.payRules = {}
      if (this.current === 2 && newData.processes[newData.processes.length - 1].needPieceSend) {
        this.payRules.pieceDeliveryNo = [{ required: true, message: '请输入寄件单号', trigger: 'blur' }]
        this.payRules.expressBrand = [{ required: true, message: '请输入快递品牌', trigger: 'blur' }]
      }
      if (this.current === 2 && newData.processes[newData.processes.length - 1].needVisit) {
        this.payRules.technicalPlatform = [{ required: true, message: '请输入平台', trigger: 'blur' }]
        this.payRules.technicalServiceNo = [{ required: true, message: '请输入师傅单号', trigger: 'blur' }]
        this.payRules.technicalName = [{ required: true, message: '请输入师傅名称', trigger: 'blur' }]
        this.payRules.technicalPhone = [
          { required: true, message: '请输入师傅电话', trigger: 'blur' },
          { len: 11, message: '请输入正确的电话号码' },
          { pattern: /^[1][34578][0-9]{9}$/, message: '请输入正确的电话号码' }
        ]
        this.payRules.technicalCost = [{ required: true, message: '请输入师傅成本', trigger: 'blur' }]
        this.payRules.technicianList = [{ required: true, message: '请输入师傅成本', trigger: 'blur' }]
        // this.payRules.technicianPhone = [
        //   { required: true, message: '请输入技术电话', trigger: 'blur' },
        //   { len: 11, message: '请输入正确的电话号码' },
        //   { pattern: /^[1][34578][0-9]{9}$/, message: '请输入正确的电话号码' }
        // ]
      }
    }
  }
}
</script>
<style lang="less" scoped>
.form{
  margin: 20px;
}
.form_estimateData_checkquestion {
  line-height: 30px;
  margin: 10px 0px;
}
.form_pay_title {
  font-size: 24px;
  /* margin-left: 40px; */
}
.userLabel{
  float: right;
}
.big_title {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.85);
}
.ant-descriptions-title {
  margin-bottom: 0px !important
}
// .test {
//   /deep/ .ant-descriptions-title {
//   margin-bottom: 0px !important
// }
// }
</style>
