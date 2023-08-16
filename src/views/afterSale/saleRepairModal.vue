<template>
  <div>
    <a-modal
      :width="1200"
      :visible="repairVisible"
      @cancel="closeRepairModals"
      :maskClosable="current===0?false:true"
      :footer="null"
      v-if="repairVisible"
    >
      <span>订单号: {{ repairData.id }}</span>
      <div class="form">
        <a-steps :current="current" v-if="current<7">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <a-steps :current="1" v-if="current===7">
          <a-step title="订单已作废" />
        </a-steps>
        <!-- 客户信息 -->
        <div class="customDes" v-if="current>-1">
          <div class="big_title">客户信息
            <div v-if="current===0" style="float:right;">
              <span @click="startClick" v-if="!editCustomer"><a-icon type="edit"/>修改信息</span>
              <a-button v-if="editCustomer" @click="saveCustomer" type="primary">保存</a-button>
            </div>
          </div>
          <a-descriptions bordered size="small">
            <a-descriptions-item label="客户名">
              <span v-if="!editCustomer">{{ repairData.customerInfo.customerName }}</span>
              <a-input placeholder="请输入客户姓名" v-if="editCustomer" v-model="editForm.customerName"/>
            </a-descriptions-item>
            <a-descriptions-item label="联系方式">
              <span v-if="!editCustomer">{{ repairData.customerInfo.customerPhone }}</span>
              <a-input placeholder="请输入联系方式" v-if="editCustomer && repairData.processes.length === 0" v-model="editForm.customerPhone"/>
              <span v-if="editCustomer && repairData.processes.length !== 0">{{ repairData.customerInfo.customerPhone }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="购买日期">
              <span v-if="!editCustomer">{{ repairData.customerInfo.purchaseDate | getDay }}</span>
              <a-date-picker v-if="editCustomer" v-model="editForm.purchaseDate"/>
            </a-descriptions-item>
            <a-descriptions-item label="品牌">
              <span v-if="!editCustomer">{{ repairData.customerInfo.brand }}</span>
              <a-select style="width: 100%;" v-if="editCustomer" placeholder="请选择产品品牌" v-model="editForm.brand" @change="changeBrand">
                <a-select-option v-for="(item) in brandArrs" :key="item.name">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-descriptions-item>
            <a-descriptions-item label="型号">
              <span v-if="!editCustomer">{{ repairData.customerInfo.productModel }}</span>
              <a-select style="width: 100%;" :disabled="!editForm.brand" v-if="editCustomer" placeholder="请选择产品型号" v-model="editForm.productModel">
                <a-select-option v-for="(item) in modelArr" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-descriptions-item>
            <a-descriptions-item label="条形码编号">
              <span v-if="!editCustomer">{{ repairData.customerInfo.productNo || '---' }}</span>
              <a-input placeholder="请输入编号" v-if="editCustomer" v-model="editForm.productNo"/>
            </a-descriptions-item>
            <a-descriptions-item label="收货地址">
              <span v-if="!editCustomer">{{ repairData.customerInfo.receiveAddress }}</span>
              <a-textarea placeholder="请输入收货地址" v-if="editCustomer" v-model="editForm.receiveAddress"/>
            </a-descriptions-item>
            <a-descriptions-item label="上门地址">
              <span v-if="!editCustomer">{{ repairData.customerInfo.isSameAddress? repairData.customerInfo.receiveAddress:repairData.customerInfo.serviceAddress }}</span>
              <a-textarea placeholder="请输入上门地址" v-if="editCustomer" v-model="editForm.serviceAddress"/>
            </a-descriptions-item>
            <a-descriptions-item label="图片/视频">
              <div v-for="(file,index) in repairData.customerInfo.uploadImage" :key="index">
                <a :href="file.url" target="_blank">资料{{ index+1 }}</a>
              </div>
              <a-upload
                v-if="editCustomer"
                name="file"
                multiple
                :action="'https://dev.hms.yootane.com/api/files/upload/file?watermark=yootane-'"
                @change="value => handleChangeUpload(value)"
              >
                <a-button><a-icon type="upload" />上传文件</a-button>
              </a-upload>
            </a-descriptions-item>
            <a-descriptions-item label="问题分类">
              {{ repairData.customerInfo.problemCategory }}
            </a-descriptions-item>
            <a-descriptions-item label="问题描述" :span="2">
              {{ repairData.customerInfo.problemExplain || '---' }}
            </a-descriptions-item>
            <a-descriptions-item label="备注">
              <span v-if="!editCustomer">{{ repairData.customerInfo.remark }}</span>
              <a-textarea placeholder="请输入用户备注" v-if="editCustomer" v-model="editForm.remark"/>
            </a-descriptions-item>
            <a-descriptions-item v-if="repairData.monthlyStatement !== null" label="月结单">
              <span style="font-size: 20px;font-weight: bold">{{ repairData.monthlyStatement | filterBoolean }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="是否保修期内">
              <span style="font-size: 20px;font-weight: bold">{{ repairData.processes[repairData.processes.length-1]?.isOverWarranty | filterBoolean }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <!-- 共用数据 -->
        <div v-if="repairData.processes.length>0">
          <div class="big_title" v-if="repairData.processes.length===1">历史评估</div>
          <div v-for="(item4,index4) in repairData.processes" :key="item4.id">
            <div class="big_title" v-if="repairData.processes.length>1">第{{ index4+1 }}次评估：</div>
            <div class="processList">
              <!-- 问题汇总 -->
              <a-descriptions class="questionDes" :column="8" bordered size="small" >
                <a-descriptions-item label="问题汇总" :span="8">
                  <div v-for="(item5,index5) in item4.problems" :key="index5">
                    <div>问题{{ index5+1 }}：{{ item5.problemJudge.firstPro }} -> {{ item5.problemJudge.secondPro }}</div>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item label="问题解释" :span="8">
                  {{ item4.problemExplain }}
                </a-descriptions-item>
                <a-descriptions-item label="技术支持" :span="8">
                  {{ item4.technicalSupport }}
                </a-descriptions-item>
                <!-- <a-descriptions-item label="是否月结单" :span="2">
                  {{ repairData.monthlyStatement | filterBoolean }}
                </a-descriptions-item> -->
                <!-- <a-descriptions-item label="是否保修期" :span="2">
                  {{ item4.isOverWarranty | filterBoolean }}
                </a-descriptions-item> -->
                <a-descriptions-item label="是否上门" :span="2">
                  {{ item4.needVisit | filterBoolean }}
                </a-descriptions-item>
                <a-descriptions-item label="是否寄件" :span="2">
                  {{ item4.needPieceSend | filterBoolean }}
                </a-descriptions-item>
                <a-descriptions-item label="折扣" :span="2">
                  {{ item4.discount?item4.discount+'折':'无' }}
                </a-descriptions-item>
                <a-descriptions-item label="支付状态" :span="2">
                  <a-badge color="#2db7f5" :text="`已支付`" v-if="item4.payResult"/>
                  <a-badge color="#f50" text="未支付" v-else/>
                  <!-- {{ item4.payResult?'已支付':'未支付' }} -->
                </a-descriptions-item>
                <a-descriptions-item label="师傅报价" :span="2">
                  {{ item4.afterSaleVisit.technicalPrice }}
                </a-descriptions-item>
                <a-descriptions-item label="配件费用" :span="2">
                  {{ countPart(item4.afterSaleExpresses) }}
                </a-descriptions-item>
                <a-descriptions-item label="快递费" :span="2">
                  {{ item4.expressCost }}
                </a-descriptions-item>
                <a-descriptions-item label="总价" :span="2">
                  {{ item4.totalCost }}
                </a-descriptions-item>
                <a-descriptions-item v-if="item4.pays.length" label="支付时间" :span="4">
                  {{ item4.pays[0].payTime | getTime }}
                </a-descriptions-item>
                <a-descriptions-item label="客户应付">
                  <a-statistic :precision="2" :value="item4.monthlyStatement?'￥0':'￥'+item4.customerPay" />
                </a-descriptions-item>
              </a-descriptions>
              <!-- 寄件汇总 -->
              <div class="sendDes" v-if="item4.needPieceSend">
                <div class="small_title">寄件汇总：</div>
                <a-descriptions bordered size="small">
                  <a-descriptions-item label="寄件汇总" :span="3">
                    <a-row>
                      <a-col :span="10">配件名称</a-col>
                      <a-col :span="5">配件单价</a-col>
                      <a-col :span="4">数量</a-col>
                    </a-row>
                    <a-row v-for="(item6, index6) in item4.afterSaleExpresses" :key="index6+'Expresses'">
                      <a-col :span="10" style="color:#40a9ff;">{{ item6.pieceName }}</a-col>
                      <a-col :span="5">{{ item6.piecePrice }}元</a-col>
                      <a-col :span="4">{{ item6.pieceNum }}</a-col>
                    </a-row>
                  </a-descriptions-item>
                  <a-descriptions-item v-if="item4.pieceDeliveryNo" label="寄件单号" :span="1">
                    {{ item4.pieceDeliveryNo }}
                  </a-descriptions-item>
                  <a-descriptions-item v-if="item4.expressBrand" label="快递品牌" :span="1">
                    {{ item4.expressBrand }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>
              <!-- 上门信息 -->
              <div class="visitDes" v-if="item4.needVisit && item4.afterSaleVisit.technicalServiceNo">
                <!-- <div style="padding: 0 10px;" v-if="item4.needVisit"> -->
                <div class="small_title">
                  <span>上门信息：</span>
                  <span style="float: right;font-weight: bold;color: rgba(0, 0, 0, 0.85);margin-right: 10px">
                    <span v-if="!editVisitIndex && index4+1 === repairData.processes.length && current===4" @click="openEditVisit"><a-icon type="edit"/>修改上门信息</span>
                    <!-- <a-button v-if="editVisitIndex && index4+1 === repairData.processes.length && current===4" @click="saveVisitInfo" type="primary">保存</a-button> -->
                  </span>
                </div>
                <!-- 修改前 -->
                <a-descriptions v-if="!editVisitIndex && index4+1 < repairData.processes.length && current===4" bordered size="small">
                  <a-descriptions-item label="师傅平台">
                    {{ item4.afterSaleVisit.technicalPlatform }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅单号">
                    {{ item4.afterSaleVisit.technicalServiceNo }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅成本">
                    {{ item4.afterSaleVisit.technicalCost || '---' }} 元
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅名称">
                    {{ item4.afterSaleVisit.technicalName || '---' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅手机号">
                    {{ item4.afterSaleVisit.technicalPhone || '---' }}
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
                <a-descriptions v-if="!editVisitIndex && index4+1 === repairData.processes.length && current===4" bordered size="small">
                  <a-descriptions-item label="师傅平台">
                    <!-- <a-input placeholder="请输入师傅平台" v-model="editVisitForm.technicalPlatform"/> -->
                    {{ editVisitForm.technicalPlatform }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅单号">
                    {{ editVisitForm.technicalServiceNo }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅成本">
                    {{ editVisitForm.technicalCost }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅名称">
                    {{ editVisitForm.technicalName }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅手机号">
                    {{ editVisitForm.technicalPhone }}
                  </a-descriptions-item>
                  <a-descriptions-item label="上门时间">
                    <!-- <a-input placeholder="请输入师傅平台" v-model="editVisitForm.visitTime"/> -->
                    {{ editVisitForm.visitTime | getTime }}
                  </a-descriptions-item>
                  <a-descriptions-item label="技术人员">
                    <span v-for="technician in editVisitForm.technicianList" :key="technician">
                      {{ technician }}
                    </span>
                  </a-descriptions-item>
                  <a-descriptions-item label="技术电话">
                    <span v-for="item in editVisitForm.technicianPhoneList" :key="item">
                      {{ item }}&nbsp;
                    </span>
                  </a-descriptions-item>
                </a-descriptions>

                <!-- 点击修改后 -->
                <a-descriptions v-if="editVisitIndex && index4+1 < repairData.processes.length && current===4" bordered size="small">
                  <a-descriptions-item label="师傅平台">
                    {{ item4.afterSaleVisit.technicalPlatform }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅单号">
                    {{ item4.afterSaleVisit.technicalServiceNo }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅成本">
                    {{ item4.afterSaleVisit.technicalCost || '---' }} 元
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅名称">
                    {{ item4.afterSaleVisit.technicalName || '---' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅手机号">
                    {{ item4.afterSaleVisit.technicalPhone || '---' }}
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
                <!-- </a-descriptions> -->
                <a-form-model
                  ref="editVisitForm"
                  :model="editVisitForm"
                  :rules="sendRules"
                >
                  <a-descriptions v-if="editVisitIndex && index4+1 === repairData.processes.length && current===4" bordered size="small">
                    <a-descriptions-item>
                      <template v-slot:label>
                        师傅平台 <span style="color: red">(必填)</span>
                      </template>
                      <a-form-model-item prop="technicalPlatform">
                        <a-input class="visit_input" placeholder="请输入师傅平台" v-model="editVisitForm.technicalPlatform"/>
                      </a-form-model-item>
                    </a-descriptions-item>
                    <a-descriptions-item>
                      <template v-slot:label>
                        师傅单号 <span style="color: red">(必填)</span>
                      </template>
                      <a-form-model-item prop="technicalServiceNo">
                        <a-input placeholder="请输入师傅单号" v-model="editVisitForm.technicalServiceNo"/>
                      </a-form-model-item>
                    </a-descriptions-item>
                    <a-descriptions-item label="师傅成本">
                      <a-form-model-item prop="technicalCost">
                        <a-input placeholder="请输入师傅成本" v-model="editVisitForm.technicalCost"/>
                      </a-form-model-item>
                    </a-descriptions-item>
                    <a-descriptions-item label="师傅名称">
                      <a-form-model-item prop="technicalName">
                        <a-input placeholder="请输入师傅名称" v-model="editVisitForm.technicalName"/>
                      </a-form-model-item>
                    </a-descriptions-item>
                    <a-descriptions-item label="师傅手机号">
                      <a-form-model-item prop="technicalPhone">
                        <a-input placeholder="请输入师傅手机号" v-model="editVisitForm.technicalPhone"/>
                      </a-form-model-item>
                    </a-descriptions-item>
                    <a-descriptions-item label="上门时间">
                      <a-form-model-item prop="visitTime">
                        <a-date-picker
                          show-time
                          v-model="editVisitForm.visitTime"
                          type="date"
                          placeholder="请选择上门时间"
                          style="width: 100%;"
                        />
                      </a-form-model-item>
                    </a-descriptions-item>
                    <a-descriptions-item label="技术人员(必填)">
                      <a-form-model-item prop="technicianList">
                        <a-select mode="multiple" style="width: 80%" placeholder="请输入技术人员" @change="checkTechnology2" v-model="editVisitForm.technicianList">
                          <a-select-option v-for="technology in technologyArr" :key="technology.nickname">
                            {{ technology.nickname }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-descriptions-item>
                    <a-descriptions-item label="技术电话">
                      <span v-for="item in editVisitForm.technicianPhoneList" :key="item">
                        {{ item }}&nbsp;
                      </span>
                    </a-descriptions-item>
                  </a-descriptions>
                  <div style="text-align: center; margin: 12px 0">
                    <a-button v-if="editVisitIndex && index4+1 === repairData.processes.length && current===4" @click="saveVisitInfo" type="primary">保存</a-button>
                  </div>
                </a-form-model>

                <!-- 不在寄件和上门状态的显示 -->
                <a-descriptions v-if="current!==3 && current!==4" bordered size="small">
                  <a-descriptions-item label="师傅平台">
                    {{ item4.afterSaleVisit.technicalPlatform }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅单号">
                    {{ item4.afterSaleVisit.technicalServiceNo }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅成本">
                    {{ item4.afterSaleVisit.technicalCost || '---' }} 元
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅名称">
                    {{ item4.afterSaleVisit.technicalName || '---' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="师傅手机号">
                    {{ item4.afterSaleVisit.technicalPhone || '---' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="上门时间">
                    {{ item4.afterSaleVisit.visitTime | getTime }}
                  </a-descriptions-item>
                  <a-descriptions-item label="技术人员">
                    <span v-for="technician in item4.afterSaleVisit.technicianList" :key="technician">
                      {{ technician }}
                    </span>
                  </a-descriptions-item>
                  <a-descriptions-item label="技术电话">
                    <span v-for="technicianPhone in item4.afterSaleVisit.technicianPhoneList" :key="technicianPhone">
                      {{ technicianPhone }}
                    </span>
                  </a-descriptions-item>
                </a-descriptions>
              </div>
              <!-- 原因 -->
              <div class="reasonDes" v-if="item4.againEstimateReason!==null || item4.unresolvedReason!==null">
                <div class="small_title">原因：</div>
                <a-descriptions :column="1" bordered size="small">
                  <a-descriptions-item v-if="item4.againEstimateName" label="再评估人员">
                    <span style="color:#40a9ff;font-size: 20px;">
                      {{ item4.againEstimateName }}
                    </span>
                  </a-descriptions-item>
                  <a-descriptions-item v-if="item4.againEstimateReason" label="再评估原因">
                    {{ item4.againEstimateReason }}
                  </a-descriptions-item>
                  <a-descriptions-item v-if="item4.unresolvedName" label="未解决判断人员">
                    <span style="color:#40a9ff;font-size: 20px;">
                      {{ item4.unresolvedName }}
                    </span>
                  </a-descriptions-item>
                  <a-descriptions-item v-if="item4.unresolvedReason" label="未解决原因">
                    {{ item4.unresolvedReason }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>
            </div>
          </div>
        </div>
        <!-- 待评估 -->
        <div class="form_estimate" v-if="current === 0">
          <div class="form_estimateData" >
            <!-- 问题选择 -->
            <div class="form_estimateData_checkquestion">
              <div style="font-size: 24px;color: rgba(0, 0, 0, 0.85);"><span style="color: #f5222d;">* </span>问题判断（必选）：</div>
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
              <!-- <a-select :disabled="!thirdArr.length" @change="checkThird" v-model="checkH" style="width: 200px">
                <a-select-option v-for="item in thirdArr" :key="item.name">
                  {{ item.name }}
                </a-select-option>
              </a-select> -->
              <a-button style="line-height: 30px;margin-left: 10px;" :disabled="!checkB" @click="addQuestion" type="primary">添加</a-button>
              <div style="padding: 0 10px;">
                <div v-show="revealMethod" style="font-size: 20px;color: rgba(0, 0, 0, 0.85);">解决方案：</div>
                <div style="margin-left: 10px;">{{ revealMethod }}</div>
              </div>
            </div>
            <!-- 问题汇总 -->
            <div v-if="gatherArr.length" class="questDes">
              <span style="font-size: 24px;color: rgba(0, 0, 0, 0.85);">问题汇总：</span>
              <a-descriptions style="margin: 10px;" v-for="item in gatherArr" :key="item.index" bordered size="small">
                <a-descriptions-item label="问题详情" :span="3">
                  {{ item.problemJudge.firstPro }} ->{{ item.problemJudge.secondPro }}
                  <span @click="delGather(item)">
                    --- <a-icon style="color: red;" type="close-circle" />
                  </span>
                </a-descriptions-item>
                <a-descriptions-item label="解决方案" :span="3">
                  {{ item.solution }}
                </a-descriptions-item>
                <a-descriptions-item label="定位方法">
                  {{ item.definitionMethod }}
                </a-descriptions-item>
              </a-descriptions>
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
                    <a-form-model-item style="font-size: 24px;" label="问题解释（必填）" prop="problemePxplain">
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
            <div v-if="transferData===null">
              月结单：
              <span>
                <a-radio-group v-model="statementIndex" name="radioGroup">
                  <a-radio @click.native.prevent="onStatement(true)" :value="true">是</a-radio>
                  <a-radio @click.native.prevent="onStatement(false)" :value="false">否</a-radio>
                </a-radio-group>
              </span>
              <span style="color: red;">（慎重选择）</span>
            </div>
            <!-- 是否在保修期 -->
            <div style="line-height: 40px;">
              <span style="color: #f5222d;">* </span>保修期：
              <a-radio-group @change="onGuarantee" name="radioGroup">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
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
                <a-select show-search style="width: 350px" v-model="checkD">
                  <a-select-option v-for="item in partData" :key="item.name">
                    {{ item.belongPart + ' / ' + item.name }}
                  </a-select-option>
                </a-select>
                <!-- <a-select @change="checkFirstPart" style="width: 200px" v-model="checkC">
                  <a-select-option v-for="item in partData" :key="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
                <a-select :disabled="!secondPart.length" style="width: 200px" v-model="checkD">
                  <a-select-option v-for="item in secondPart" :key="item.pieceName">
                    {{ item.pieceName }}
                  </a-select-option>
                </a-select> -->
                <span> 数量：</span>
                <a-input-number :disabled="!checkD" v-model="checkE" id="inputNumber" :min="1"/>
                <a-button style="line-height: 30px;" :disabled="!checkE" @click="addPart" type="primary">添加</a-button>
              </div>
            </div>
            <!-- 评估信息汇总 -->
            <div class="proDes">
              <a-descriptions style="margin-top: 10px;" bordered size="small">
                <a-descriptions-item v-if="partArr.length" label="配件信息汇总" :span="3">
                  <a-row>
                    <a-col :span="8">配件名称</a-col>
                    <a-col :span="5">配件单价</a-col>
                    <a-col :span="4">数量</a-col>
                    <a-col :span="4">配件库存</a-col>
                  </a-row>
                  <a-row v-for="item in partArr" :key="item.index">
                    <a-col :span="8" style="font-weight:bold;">{{ item.pieceName }}</a-col>
                    <a-col :span="5">{{ item.piecePrice }}元</a-col>
                    <a-col :span="4">{{ item.pieceNum }}</a-col>
                    <a-col :span="4">{{ item.pieceStock }}</a-col>
                    <span>
                      <a-icon @click="delPart(item)" type="close-circle" />
                    </span>
                  </a-row>
                </a-descriptions-item>
                <a-descriptions-item v-if="partArr.length" label="快递费用" :span="1">
                  <span v-if="!mailingCostIndex">
                    <a-input-number :min="0" v-model="mailingCost"></a-input-number>
                    <a-button style="line-height: 29px;" @click="okMailing" type="primary">确认</a-button>
                  </span>
                  <span v-if="mailingCostIndex">
                    ￥{{ mailingCost }}
                  </span>
                </a-descriptions-item>
                <a-descriptions-item v-if="partArr.length" label="配件总价" :span="1">
                  ￥{{ countPart(partArr) }}
                </a-descriptions-item>
                <a-descriptions-item v-if="visitIndex" label="师傅价格" :span="1">
                  ￥{{ checkG }}
                </a-descriptions-item>
                <a-descriptions-item label="订单总价" :span="1">
                  ￥{{ totalCost }}
                </a-descriptions-item>
                <a-descriptions-item v-if="totalCost" label="优惠折扣" :span="1">
                  <div>
                    输入折扣：<a-input-number style="width: 60px;" :min="1" :max="10" v-model="discount"></a-input-number> 折 (需要则填写)
                  </div>
                  <div v-show="discount">
                    <span style="color: #f5222d;">* </span>折扣理由：<a-input v-model="discountData" style="width: 300px;"></a-input>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item label="客户实际应付" :span="1">
                  <a-statistic :precision="2" :value="parseInt(priceSum * 100) / 100" />
                </a-descriptions-item>
              </a-descriptions>
            </div>
            <div style="margin: 50px 10px;">
              <a-popconfirm title="确定作废订单吗？" @confirm="cancelOrder" v-if="MyInfo.roleName==='After_salesDirector'">
                <a-button type="danger" ghost>订单作废</a-button>
              </a-popconfirm>
              <a-popconfirm title="确定评估？" @confirm="checkOk">
                <a-button type="primary" style="float:right;">评估</a-button>
              </a-popconfirm>
            </div>
          </div>
        </div>
        <!-- 已评估 -->
        <div class="form_estimateOk" v-if="current===1">
          <!-- 问题汇总 -->
          <div style="text-align: center;margin-top: 20px;">
            <div v-if="repairData.monthlyStatement===null" style="line-height: 40px;">
              <div style="font-size: 24px;">等待月结判断</div>
              <span style="color: #f5222d;">* </span>月结单：
              <a-radio-group @change="onMonthlyStatement" name="radioGroup">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
              <span style="color: red;">（慎重选择）</span>
              <div>
                <a-popconfirm style="margin: 0 20px;" title="确定判断月结？" @confirm="changeMonthlyStatement">
                  <a-button>判断月结</a-button>
                </a-popconfirm>
              </div>
            </div>
            <div v-else style="font-size: 24px;">等待客户支付</div>
            <div style="margin-top: 20px">
              <!-- <a-popconfirm style="margin: 0 20px;" title="确定再评估？" @confirm="changepProcesses"> -->
              <a-popconfirm style="margin: 0 20px;" title="确定再评估？" @confirm="openModal('1')">
                <a-button type="primary">再评估</a-button>
              </a-popconfirm>
              <span v-if="repairData.monthlyStatement!==null" style="margin: 0 20px;">
                <a-popconfirm v-if="repairData.processes[repairData.processes.length-1].customerPay === 0" title="确定进行0元支付？" @confirm="changeZeroPay">
                  <a-button type="primary">0元支付</a-button>
                </a-popconfirm>
                <a-button v-else @click="getPayCode">生成支付二维码</a-button>
              </span>
            </div>
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
            <!-- 确认 -->
            <div>
              <a-row style="text-align: center;">
                <a-col>
                  <a-popconfirm title="确定提交信息？" @confirm="onPaySubmit">
                    <a-button style="margin: 0 20px;" type="primary">确认</a-button>
                  </a-popconfirm>
                  <a-popconfirm title="确定重置信息？" @confirm="resetPayForm">
                    <a-button style="margin: 0 20px;">重置</a-button>
                  </a-popconfirm>
                </a-col>
              </a-row>
            </div>
          </a-form-model>
        </div>
        <!-- 已寄件待确认收货 -->
        <div style="display: flex;" v-if="current===3">
          <a-popconfirm title="确定已收件吗？" @confirm="receiveSubmit">
            <a-button style="margin: 20px auto;" type="primary">确认收货</a-button>
          </a-popconfirm>
        </div>
        <!-- 已收件待派工 -->
        <div class="form_send" v-if="current===4">
          <div class="form_pay_title">填单</div>
          <a-form-model
            ref="sendForm"
            style="padding: 10px;"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :model="sendForm"
            :rules="sendRules"
          >
            <!-- 上门信息 -->
            <div v-if="repairData.processes[repairData.processes.length-1].needVisit">
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="师傅平台" prop="technicalPlatform">
                    <a-input placeholder="请输入平台" v-model="sendForm.technicalPlatform"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="师傅单号" prop="technicalServiceNo">
                    <a-input placeholder="请输入师傅单号" v-model="sendForm.technicalServiceNo"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="师傅名称" prop="technicalName">
                    <a-input placeholder="请输入师傅名称" v-model="sendForm.technicalName"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="师傅手机" prop="technicalPhone">
                    <a-input placeholder="请输入师傅手机" v-model="sendForm.technicalPhone"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="师傅成本" prop="technicalCost">
                    <a-input-number placeholder="请输入师傅成本" style="width: 100%;" v-model="sendForm.technicalCost" id="inputNumber" :min="0"/>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="上门时间" prop="visitTime">
                    <a-date-picker
                      show-time
                      v-model="sendForm.visitTime"
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
                    <a-select mode="multiple" placeholder="请输入技术人员" @change="checkTechnology" v-model="sendForm.technicianList">
                      <a-select-option v-for="technology in technologyArr" :key="technology.nickname">
                        {{ technology.nickname }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col v-if="sendForm.technicianPhoneList.length" :span="12">
                  <a-form-model-item label="技术电话" prop="technicianPhoneList">
                    <span v-for="item in sendForm.technicianPhoneList" :key="item">
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
                  <a-popconfirm title="确定提交信息？" @confirm="onSendSubmit">
                    <a-button style="margin: 0 20px;" type="primary">提交</a-button>
                  </a-popconfirm>
                  <a-popconfirm title="确定保存信息？" @confirm="saveEditVisit">
                    <a-button style="margin: 0 20px;" type="primary">保存</a-button>
                  </a-popconfirm>
                  <a-popconfirm title="确定重置信息？" @confirm="resetSendForm">
                    <a-button style="margin: 0 20px;">重置</a-button>
                  </a-popconfirm>
                </a-col>
              </a-row>
            </div>
          </a-form-model>
        </div>
        <!-- 待上门 -->
        <div class="form_come" v-if="current===5">
          <div style="margin-top: 20px;text-align: center;">
            <a-popconfirm title="确定售后问题解决？" @confirm="repairSucceeded">
              <a-button style="margin-right:20px;" type="primary">问题解决</a-button>
            </a-popconfirm>
            <!-- <a-popconfirm title="确定售后问题没有解决？" @confirm="repairFailed"> -->
            <a-popconfirm title="确定售后问题没有解决？" @confirm="openModal('2')">
              <a-button>问题未解决</a-button>
            </a-popconfirm>
          </div>
        </div>
        <!-- 已解决 -->
        <div class="form_solve" v-if="current===6">
          <div style="font-size: 24px;text-align: center;">
            已解决
          </div>
        </div>
      </div>
    </a-modal>
    <saleRepairModalEstimate
      :estimateVisible="estimateVisible"
      @closeEstimate="closeEstimate"
      :transferData="repairData"
      :modalIndex="modalIndex"
    />
    <a-modal
      v-if="payCodeVisible"
      title="支付二维码"
      :visible="payCodeVisible"
      :footer="null"
      @cancel="closePayCode"
      width="800px"
    >
      <div class="topCode">
        <img class="" style="width:140px;" src="http://hms-web.oss-cn-shenzhen.aliyuncs.com/image/wx/WePayLogo.png" mode="aspectFit" />
        <div>支付金额：<span style="color: orange;font-size:26px;">{{ payNum }}</span>元</div>
      </div>
      <div style="display:flex;" v-if="codePayResult">
        <div class="qrcode">
          <div ref="qrcode" id="qrcode"></div>
          <div style="margin-top:5px;">使用微信扫码付款</div>
        </div>
        <p style="margin-top:20px;">支付链接：{{ codeURL }}</p>
      </div>
      <div v-else-if="codePayResult===false" class="codePayResult">该订单已支付，请刷新页面！</div>
    </a-modal>
  </div>
</template>

<script>
import { addProcess as apiAddProcess, updateStatus as apiUpdateStatus, updateProcess as apiUpdateProcess, getGuide as apiGetGuide, getParts as apiGetParts, updateCustomerInfo, paymentCode, getIp, processPay, getSaleRepair } from '@/api/afterSale'
import { getUserInfo as apiGetUserInfo } from '@/api/login'
import { getUserList as apiGetUserList } from '@/api/manage'
import saleRepairModalEstimate from './saleRepairModalAgainEstimate.vue'
import moment from 'moment'
import { brandData } from './saleRepairData'
import md5 from '../../utils/md5'
import QRCode from 'qrcodejs2'

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
    },
    transferData: {
      type: Boolean,
      default: null
    }
  },
  components: {
    saleRepairModalEstimate
  },
  filters: {
    filterBoolean (value) {
      if (value === '' || value === undefined) {
        return '--'
      }
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
        { title: '待评估' },
        { title: '已评估' },
        { title: '已支付' },
        { title: '已寄件' },
        { title: '已收件' },
        { title: '待上门' },
        { title: '已解决' }
      ],
      question: [],
      secondArr: [], // 二级问题
      // thirdArr: [], // 三级问题
      revealMethod: '', // 解决方案展示
      definitionMethod: '', // 问题定位
      extraForm: {
        problemePxplain: null, // 问题解释
        technicalSupport: null // 技术支持
      },
      checkA: null, // 选择的一级问题
      checkB: null, // 选择的二级问题
      checkC: null, // 选择的一级配件
      checkD: null, // 选择的二级配件
      checkE: null, // 选择配件的数量
      checkF: null, // 选择的师傅
      checkG: null, // 师傅价格
      // checkH: null,
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
      part: [],
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
      // 已支付校验规则
      payRules: {
        pieceDeliveryNo: [
          { required: true, message: '请输入寄件单号', trigger: 'blur' }
        ],
        expressBrand: [
          { required: true, message: '请输入快递品牌', trigger: 'blur' }
        ]
      },
      payForm: {
        pieceDeliveryNo: null, // 寄件单号
        expressBrand: null // 快递品牌
      },
      // 已寄件规则
      sendRules: {
        technicalPlatform: [
          { required: true, message: '请输入平台', trigger: 'blur' }
        ],
        technicalServiceNo: [
          { required: true, message: '请输入师傅单号', trigger: 'blur' }
        ]
        // technicianList: [
        //   { required: true, message: '请选择技术人员', trigger: 'blur' }
        // ]
      },
      sendForm: {
        technicalPlatform: null, // 师傅平台
        technicalServiceNo: null, // 师傅单号
        technicalName: null, // 师傅名字
        technicalCost: null, // 师傅成本
        technicalPhone: null, // 师傅手机号
        visitTime: null, // 上门时间
        technicianList: [], // 技术人员
        technicalPrice: '',
        technician: null,
        technicianPhoneList: [] // 技术人员电话组
      },
      technologyArr: [],
      monthlyStatementIndex: null,
      estimateVisible: false,
      modalIndex: '',
      editCustomer: false,
      editForm: {
        uploadImage: []
      },
      // 品牌库
      brandArrs: brandData,
      // 产品库
      modelArr: [],
      editVisitIndex: false,
      editVisitForm: {
        technicalPlatform: null, // 师傅平台
        technicalServiceNo: null, // 师傅单号
        technicalName: null, // 师傅名字
        technicalCost: null, // 师傅成本
        technicalPhone: null, // 师傅手机号
        visitTime: null, // 上门时间
        technicianList: [], // 技术人员
        // technicianPhone: null, // 技术人员电话
        technicianPhoneList: [] // 技术人员电话组
      },
      MyInfo: {},
      payCodeVisible: false,
      codeURL: '',
      payNum: 0,
      codePayResult: null,
      repairId: null
    }
  },
  methods: {
    receiveSubmit () {
      const id = this.repairData.id
      var changeStatus = {
        status: 'RECEIVED'
      }
      if (this.repairData.processes[this.repairData.processes.length - 1].needVisit === false) {
        changeStatus = { status: 'WAIT_VISIT' }
      }
      // 改变状态
      apiUpdateStatus(id, changeStatus).then(res => {
        if (res.status === 200) {
          this.$message.success('提交成功')
          // console.log('状态改变成功')
          this.closeRepairModals()
          this.$parent.getAfterSaleData()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    async getSaleRepair (repairId) {
      const res = await getSaleRepair(repairId)
      if (res.status === 200) {
        this.repairData = res.data
        this.$message.success('刷新成功')
      }
      console.log(res)
    },
    getPayCode () {
      this.payCodeVisible = true
      this.unifiedOrder()
    },
    nonceStr () {
      const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var n = ''
      for (var i = 0; i < 32; i++) {
        n += t.charAt(Math.floor(Math.random() * 32))
      }
      return n
    },
    sign () {
      const stringA = `appid=wxc849c3cfa10ea1d2&body=test&device_info=1000&mch_id=1635883921&nonce_str=${this.nonceStr()}`
      const stringSignTemp = stringA + '&key=yt191017yt191017yt191017yt191017'
      return md5(stringSignTemp)
    },
    async unifiedOrder () {
      const processId = Math.max.apply(Math, this.repairData.processes.map(item => { return item.id }))
      const payProcesses = this.repairData.processes.filter(item => { return item.id === processId })
      const payNum = payProcesses[0].customerPay
      this.payNum = payNum
      const myDate = new Date()
      const myYear = myDate.getFullYear()
      const myMonth = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1
      const myToday = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
      const outTradeNo = 'SH' + myYear + myMonth + myToday + this.repairData.id + processId
      const ip = await getIp()
      const payLoad = {
        appid: 'wx60c0211b98af5b12',
        mchId: '1635883921',
        nonceStr: this.nonceStr(), // 32位随机字符串
        sign: this.sign(), // 签名
        signType: 'MD5',
        body: '智能马桶售后中心',
        outTradeNo: outTradeNo,
        totalFee: payNum * 1000 / 10,
        spbillCreateIp: ip,
        notifyUrl: 'https://hms.yootane.com/api/pay/notify/order', // 结果通知的回调地址
        tradeType: 'NATIVE',
        productId: this.repairData.id
      }
      paymentCode(payLoad).then(res => {
        if (res.resultCode === 'SUCCESS') {
          if (payProcesses[0].pays.length === 0) {
            // 创建支付pay
            const requestBody = {
              submitType: 'PAY',
              outTradeNo: outTradeNo,
              // "transactionId": "string",
              initTime: new Date(), // 付款发起时间
              payTime: '',
              payStatus: 'PROCESSING',
              totalAmount: payProcesses[0].totalCost, // 总金额
              actualAmount: payProcesses[0].customerPay, // 客户实际支付
              customerId: null,
              payMethod: 'WECHAT_PAY',
              tradeType: 'NATIVE_PAY',
              notifyUrl: 'https://hms.yootane.com/api/pay/notify/order'
            }
            this.processPay(processId, requestBody, this.repairData.id)
          }
          this.codePayResult = true
          this.codeURL = res.codeURL
          // 创建QRCode实例
          var that = this
          setTimeout(() => {
            var qrcode = new QRCode(that.$refs.qrcode, {
                text: res.codeURL, // 需要转换为二维码的内容
                width: 140,
                height: 140,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            })
            console.log(qrcode)
          }, 0)
          // console.log(qrcode)
        }
      }, error => {
        // 请求失败时执行的代码
        console.log(error)
        this.codePayResult = false
        console.log('订单已支付')
        this.$message.warning('订单已支付,请刷新页面')
      })
    },
    async processPay (processId, requestBody, repairId) {
      const res = await processPay(processId, requestBody)
      if (res.status === 200) {
        this.getSaleRepair(repairId)
      }
    },
    closePayCode () {
      this.payCodeVisible = false
      const qrcode = document.getElementById('qrcode')
      if (qrcode) {
        qrcode.innerHTML = ''
      }
    },
    async getMe () {
      const res = await apiGetUserInfo()
      this.MyInfo = res.data
      console.log('this.MyInfo', this.MyInfo)
    },
    cancelOrder () {
      const id = this.repairData.id
      const payLoad = {}
      payLoad.status = 'CANCEL'
      // 改变状态
      apiUpdateStatus(id, payLoad).then(res => {
        if (res.status === 200) {
          this.$message.success('订单作废成功')
          // console.log('状态改变成功')
          this.closeRepairModals()
          this.$parent.getAfterSaleData()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleChangeUpload (data) {
    // console.log('上传文件', data)
      if (data.file.status === 'done') {
        console.log('this.editForm.uploadImage', this.editForm, data.file.response.data)
        this.editForm.uploadImage.push(data.file.response.data)
      } else if (data.file.status === 'error') {

      } else if (data.file.status === 'removed') {
        // const testArr = data.fileList.map(item => {
        //   return item.response.data
        // })
        // this.editForm.uploadImage = testArr
        this.editForm.uploadImage = this.editForm.uploadImage.filter(item => {
          return item.fileName !== data.file.name
        })
        console.log('this.editForm.uploadImage', this.editForm.uploadImage)
      }
    },
    changeBrand () {
      this.editForm.productModel = undefined
    },
    startClick () {
      this.editForm = this.repairData.customerInfo
      if (this.editForm.uploadImage === null) {
        this.editForm.uploadImage = []
      }
      this.editCustomer = true
      // console.log('开始编辑', this.brandArrs)
    },
    // 保存用户信息
    async saveCustomer () {
      const payLoad = {}
      payLoad.customerPhone = this.editForm.customerPhone
      payLoad.customerName = this.editForm.customerName
      // payLoad.customerPhone = this.editForm.customerPhone
      payLoad.productModel = this.editForm.productModel
      payLoad.productNo = this.editForm.productNo
      payLoad.brand = this.editForm.brand
      payLoad.purchaseDate = this.editForm.purchaseDate
      // payLoad.problemCategory = this.editForm.problemCategory
      // payLoad.problemExplain = this.editForm.problemExplain
      payLoad.uploadImage = this.editForm.uploadImage
      payLoad.receiveAddress = this.editForm.receiveAddress
      payLoad.isSameAddress = this.editForm.isSameAddress
      payLoad.serviceAddress = this.editForm.serviceAddress
      payLoad.remark = this.editForm.remark
      // payLoad.afterSaleType = this.editForm.afterSaleType
      console.log('保存用户信息', payLoad)
      const id = this.repairData.id
      const res = await updateCustomerInfo(id, payLoad)
      if (res.status === 200) {
        this.$message.success('更改成功')
        this.editCustomer = false
      }
    },
    closeRepairModals () {
      this.editCustomer = false
    //   Object.assign(this.$data, this.$options.data())
      if (this.current === 0) {
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
        // this.statementIndex = null
        this.secondArr = []
        // this.thirdArr = []
        this.gatherArr = []
        this.partArr = []
        this.mailingCost = 0
        this.discount = null
        this.visitIndex = null
        this.deliveryIndex = null
        this.extraForm.problemePxplain = null
        this.extraForm.technicalSupport = null
      }
      // 再评估刷新
      // if (this.current === 1 || this.current === 4) {
      //   this.$parent.getAfterSaleData()
      // }
      // 寄件信息刷新
      if (this.current === 2) {
        this.$refs.payForm.resetFields()
      }
      // 上门信息刷新
      if (this.current === 4) {
        this.$refs.sendForm.resetFields()
      }
      this.editVisitIndex = false
      this.$emit('closeRepairModal')
    },
    // 选择一级问题
    checkFirst (data) {
      // console.log('选择的', data)
      this.checkB = null
      // this.checkH = null
      this.revealMethod = null
      this.definitionMethod = null
      this.secondArr = []
      // this.thirdArr = []
      this.question.filter((item) => {
        if (item.name === data) {
          this.secondArr = item.guides
        }
      })
      // console.log('solution', this.secondArr)
    },
    // 选择二级问题
    checkSecond (data) {
      // this.checkH = null
      this.checkB = data
      // console.log('选择的', data)
      // console.log('二级问题', this.secondArr)
      this.secondArr.filter((item) => {
        if (item.name === data) {
          this.revealMethod = item.solution
          this.definitionMethod = item.locationWay
          this.checkId = item.id
          // this.thirdArr = item.guides
          // this.revealMethod = item.solution
          // this.definitionMethod = item.definitionMethod
        }
      })
      // console.log('选择解决方法', this.checkB)
    },
    // 选择三级问题
    // checkThird (data) {
    //   console.log(data)
    //   this.checkH = data
    //   this.thirdArr.filter((item) => {
    //     if (item.name === data) {
    //       this.revealMethod = item.solution
    //       this.definitionMethod = item.locationWay
    //       this.checkId = item.id
    //     }
    //   })
    // },
    // 添加问题
    addQuestion () {
      const gatherAdd = {
        problemJudge: {
          firstPro: this.checkA,
          secondPro: this.checkB,
          // thirdPro: this.checkH,
          checkId: this.checkId
        },
        solution: this.revealMethod,
        definitionMethod: this.definitionMethod
      }
      this.gatherArr.push(gatherAdd)
      this.checkA = null
      this.checkB = null
      // this.checkH = null
      this.checkId = null
      this.revealMethod = null
      this.definitionMethod = null
      this.secondArr = []
      // this.thirdArr = []
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
            pieceStock: item.stock, // 库存
            pieceId: item.id, // id
            pieceNumber: item.serialNumber // 编码
          }
          this.secondPart.push(addData)
        }
      })
    },
    // 添加配件
    addPart () {
      const partAdd = {}
      this.partData.filter(item => {
        if (item.name === this.checkD) {
          partAdd.pieceName = item.name
          partAdd.piecePrice = item.price
          partAdd.pieceCost = item.cost
          partAdd.pieceStock = item.stock
          partAdd.pieceNum = this.checkE
          partAdd.pieceId = item.id
          partAdd.pieceNumber = item.serialNumber
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
      if (!this.guaranteeIndex) { // 不在保修期内
        // this.priceSum += this.checkG
        this.priceSum += this.mailingCost
        this.partArr.map(item => {
          this.priceSum += item.piecePrice * item.pieceNum
          this.totalCost += item.piecePrice * item.pieceNum
        })
        if (this.discount) {
          // console.log('??')
          this.priceSum = this.priceSum * this.discount * 0.1 + this.checkG
        } else {
          this.priceSum = this.priceSum + this.checkG
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
      // console.log('apiData', apiData)
      this.$refs.extraForm.validate(valid => {
        // 判断月结单
        // let isStatement = true
        // if (this.statementIndex === null) {
        //   isStatement = false
        //   this.$message.error('请选择月结单')
        // }
        // 判断保质期
        // guaranteeIndex
        let isGuarantee = true
        if (this.guaranteeIndex === null) {
          isGuarantee = false
          this.$message.error('请选择保修期')
        }
        // 判断上门
        let isVisit = true
        if (this.visitIndex === null) {
          isVisit = false
          this.$message.error('请选择是否上门')
        } else {
          if (this.visitIndex === true) {
            if (this.checkG === null) {
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
            return
          }
        }
        // if (valid && this.gatherArr.length !== 0 && validIndex && isVisit && isDelivery && isGuarantee && isStatement) {
        if (valid && this.gatherArr.length !== 0 && validIndex && isVisit && isDelivery && isGuarantee) {
          // console.log('校验ok')
           // 评估
          apiAddProcess(id, apiData).then(res => {
            if (res.status === 200) {
              this.$message.success('评估成功')
              const changeStatus = {
                status: 'EVALUATED',
                customerService: this.MyInfo.userInfo?.name || this.MyInfo.nickname
              }
              if (this.statementIndex === true) {
                changeStatus.status = 'PAID'
              }
              if (this.statementIndex) {
                changeStatus.monthlyStatement = this.statementIndex // 月结单
              } else {
                changeStatus.monthlyStatement = null // 月结单
              }
              // 改变状态
              apiUpdateStatus(id, changeStatus).then(res => {
                if (res.status === 200) {
                  // this.$message.success('评估成功')
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
          this.$message.error('请填入完整信息')
          // console.log('校验失败')
        }
      })
    },
    // 是否月结
    onStatement (data) {
      // console.log(data)
      if (data === this.statementIndex) {
        this.statementIndex = null
      } else {
        this.statementIndex = data
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
        // this.priceSum += this.checkG // 师傅
        this.totalCost += this.checkG // 师傅
        this.priceSum += this.mailingCost // 快递
        this.totalCost += this.mailingCost // 快递
      }
      if (this.discount) {
        // console.log('??')
        this.priceSum = this.priceSum * this.discount * 0.1 + this.checkG
      } else {
        this.priceSum = this.priceSum + this.checkG
      }
    },
    getParentSaleData () {
      this.$parent.getAfterSaleData()
    },
    repairSucceeded () {
      const id = this.repairData.id
      const processId = this.repairData.processes[this.repairData.processes.length - 1].id
      const apiData = { feedbackTime: new Date() }
      const changeStatus = { status: 'SOLVED' }
      apiUpdateStatus(id, changeStatus).then(res => {
        if (res.status === 200) {
          this.$message.success('问题已解决')
          apiUpdateProcess(id, processId, apiData).then(res => {
            if (res.status === 200) {
              console.log('增加解决时间')
              this.closeRepairModals()
              this.$parent.getAfterSaleData()
            }
          })
        } else {
          this.$message.error(res.message)
        }
      })
      // this.closeRepairModals()
      // console.log('成功')
    },
    repairFailed () {
      const id = this.repairData.id
      const changeStatus = { status: 'WAIT_EVALUATE' }
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
    // 已支付->已寄件
    onPaySubmit () {
      const id = this.repairData.id
      const processId = this.repairData.processes[this.repairData.processes.length - 1].id
      this.$refs.payForm.validate(valid => {
        if (valid) {
          const testData = JSON.parse(JSON.stringify(this.payForm))
          const apiData = {
            pieceDeliveryNo: testData.pieceDeliveryNo,
            expressBrand: testData.expressBrand,
            afterSaleVisit: testData,
            sendTime: new Date()
          }
          delete apiData.afterSaleVisit.pieceDeliveryNo
          delete apiData.afterSaleVisit.expressBrand
          apiUpdateProcess(id, processId, apiData).then(res => {
            if (res.status === 200) {
              // 获取登陆账户 - 内勤
              apiGetUserInfo().then(res => {
                if (res.status === 200) {
                  let changeStatus = {}
                  changeStatus = {
                    status: 'SEND',
                    managerName: res.data.userInfo.name
                  }
                  // if (this.repairData.processes[this.repairData.processes.length - 1].needVisit === false) {
                  //   changeStatus = { status: 'WAIT_VISIT' }
                  // } else if (this.repairData.processes[this.repairData.processes.length - 1].needVisit === true) {
                  //   changeStatus = {
                  //     status: 'SEND',
                  //     managerName: res.data.userInfo.name
                  //   }
                  // }
                  if (this.payForm.pieceDeliveryNo !== null) {
                    changeStatus.send = 'EXECUTED'
                  }
                  // if (this.payForm.technicalName !== null) {
                  //   changeStatus.visit = 'EXECUTED'
                  // }
                  // 改变状态
                  apiUpdateStatus(id, changeStatus).then(res => {
                    if (res.status === 200) {
                      this.$message.success('提交成功')
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
    onSendSubmit () {
      const id = this.repairData.id
      const processId = this.repairData.processes[this.repairData.processes.length - 1].id
      this.$refs.sendForm.validate(vaild => {
        if (vaild) {
          const apiData = {
            afterSaleVisit: JSON.parse(JSON.stringify(this.sendForm))
          }
          // console.log(apiData)
          apiUpdateProcess(id, processId, apiData).then(res => {
            if (res.status === 200) {
              // 获取登陆账户 - 内勤
              apiGetUserInfo().then(res => {
                if (res.status === 200) {
                  const changeStatus = {
                    status: 'WAIT_VISIT',
                    managerName: res.data.userInfo.name
                  }
                  // if (this.payForm.pieceDeliveryNo !== null) {
                  //   changeStatus.send = 'EXECUTED'
                  // }
                  if (this.sendForm.technicalName !== null) {
                    changeStatus.visit = 'EXECUTED'
                  }
                  // 改变状态
                  apiUpdateStatus(id, changeStatus).then(res => {
                    if (res.status === 200) {
                      this.$message.success('提交成功')
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
          this.$message.info('必填项未填写')
        }
      })
    },
    resetPayForm () {
      // console.log('重置已支付表单', this.payForm)
      this.$refs.payForm.resetFields()
      // this.payForm.technicianList = undefined
      // this.payForm.technicianPhoneList = []
      // console.log('重置后', this.payForm)
    },
    resetSendForm () {
      // this.payForm.technicianList = []
      // this.payForm.technicianPhoneList = []
      this.$refs.sendForm.resetFields()
    },
    // 月结选择
    onMonthlyStatement (e) {
      if (e.target.value) {
        this.monthlyStatementIndex = true
      } else {
        this.monthlyStatementIndex = false
      }
    },
    // 判断月结
    changeMonthlyStatement () {
      if (this.monthlyStatementIndex !== null) {
        const id = this.repairData.id
        const changeStatus = { monthlyStatement: this.monthlyStatementIndex }
        if (this.monthlyStatementIndex === true) {
          changeStatus.status = 'PAID'
        }
        // console.log(id, changeStatus)
        apiUpdateStatus(id, changeStatus).then(res => {
          if (res.status === 200) {
            this.$message.success('判断月结成功')
            // console.log('状态改变成功')
            this.closeRepairModals()
            this.$parent.getAfterSaleData()
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.error('请选择是否月结')
      }
    },
    openModal (data) {
      this.modalIndex = data
      this.estimateVisible = true
    },
    // 再评估
    changepProcesses () {
      const id = this.repairData.id
      const processId = this.repairData.processes[this.repairData.processes.length - 1].id
      const changeInvalid = { isInvalid: false }
      // console.log(changePay, id, processId)
      // 改变流程里的状态
      apiUpdateProcess(id, processId, changeInvalid).then(res => {
        if (res.status === 200) {
          // this.$message.success('状态改变成功')
          const changeStatus = { status: 'WAIT_EVALUATE' }
          // 改变大状态
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
    },
    // 0元支付
    changeZeroPay () {
      // 改变状态
      const arr = this.repairData.processes[this.repairData.processes.length - 1]
      const id = this.repairData.id
      const processId = arr.id
      const changePay = { payResult: true }

      // 改变流程里的支付状态
      apiUpdateProcess(id, processId, changePay).then(res => {
        if (res.status === 200) {
          let changeStatus = {}
          // 判断是否需要寄件
          if (arr.needPieceSend === false && arr.needVisit === false) {
            // 不需寄件 不需上门
            changeStatus = { status: 'WAIT_VISIT' }
          } else if (arr.needPieceSend === false && arr.needVisit === true) {
            // 不需寄件 需上门
            changeStatus = { status: 'SEND' }
          } else if (arr.needPieceSend === true) {
            // 需寄件
            changeStatus = { status: 'PAID' }
          }
          // 改变大状态
          apiUpdateStatus(id, changeStatus).then(res => {
            if (res.status === 200) {
              this.$message.success('成功')
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

      // 获取登陆账户 - 内勤
      // apiGetUserInfo().then(res => {
      //   if (res.status === 200) {
      //     changeStatus = {
      //       status: 'PAID',
      //       managerName: res.data.userInfo.name
      //     }
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
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
      this.sendForm.technicianPhoneList = testData
      // console.log(this.payForm.technicianPhoneList)
    },
    checkTechnology2 (e) {
      const testData = []
      for (let i = 0; i < e.length; i++) {
        for (let j = 0; j < this.technologyArr.length; j++) {
          if (e[i] === this.technologyArr[j].nickname) {
            testData.push(this.technologyArr[j].telephone)
          }
        }
      }
      this.editVisitForm.technicianPhoneList = testData
    },
    closeEstimate () {
      this.estimateVisible = false
    },
    saveEditVisit () {
      const id = this.repairData.id
      const processId = this.repairData.processes[this.repairData.processes.length - 1].id
      const apiData = {
        afterSaleVisit: JSON.parse(JSON.stringify(this.sendForm))
      }
      // console.log(apiData)
      apiUpdateProcess(id, processId, apiData).then(res => {
        if (res.status === 200) {
          this.$message.success('保存成功')
          // this.closeRepairModals()
          this.$parent.getAfterSaleData()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    openEditVisit () {
      // console.log('修改')
      this.editVisitIndex = true
    },
    saveVisitInfo () {
      // console.log('保存', this.editVisitForm)
      this.$refs.editVisitForm[0].validate(valid => {
        if (valid) {
          const id = this.repairData.id
          const processId = this.repairData.processes[this.repairData.processes.length - 1].id
          const apiData = {
            afterSaleVisit: JSON.parse(JSON.stringify(this.editVisitForm))
          }
          // console.log(apiData)
          apiUpdateProcess(id, processId, apiData).then(res => {
            if (res.status === 200) {
              this.$message.success('保存成功')
              // this.closeRepairModals()
              this.$parent.getAfterSaleData()
              this.$forceUpdate()
            } else {
              this.$message.error(res.message)
            }
          })
          this.editVisitIndex = false
        } else {
          this.$message.info('必填项未填写')
        }
      })
    }
  },
  created () {
  },
  mounted () {
    this.getMe()
    // console.log('this.repairData.customerInfo', this.repairData.customerInfo)
    this.editForm = this.repairData.customerInfo
    this.editCustomer = false
    // 配件库
    const pages = { page: 0, size: 1 }
    apiGetParts(pages).then(res => {
      if (res.status === 200) {
        // this.$message.success('配件查询成功')
        pages.size = res.data.totalElements
        apiGetParts(pages).then(res => {
          if (res.status === 200) {
            const partTest = res.data.content
            this.part = partTest
            let aPart = []
            // 存储一级配件类名
            partTest.filter(item => {
              aPart.push(item.belongPart)
            })
            aPart = Array.from(new Set(aPart))
            this.technicalData = aPart.filter(data => {
              return data === '师傅上门报价'
            })
            this.partData = partTest.filter(data => {
              return data.belongPart !== '师傅上门报价'
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
              return item.roleName === 'After_salesTechnology'
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
          // this.priceSum += this.checkG // 师傅
        }
        if (this.discount) {
          this.priceSum = this.priceSum * this.discount * 0.1 + this.checkG
        } else {
          this.priceSum = this.priceSum + this.checkG
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
        // this.priceSum += this.checkG // 师傅
        this.priceSum += this.mailingCost // 快递
        if (this.discount) {
          this.priceSum = this.priceSum * this.discount * 0.1 + this.checkG
        } else {
          this.priceSum = this.priceSum + this.checkG
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
        // if (this.discount) {
        //   this.priceSum = this.priceSum * this.discount * 0.1
        if (this.discount) {
          this.priceSum = this.priceSum * this.discount * 0.1 + this.checkG
        } else {
          this.priceSum = this.priceSum + this.checkG
        }
      }
    },
    // 监听折扣
    discount () {
      this.discountData = null
      this.priceSum = 0
      this.totalCost = 0
      this.priceSum += this.mailingCost // 快递
      this.totalCost += this.mailingCost // 快递
      // this.priceSum += this.checkG // 师傅
      this.totalCost += this.checkG // 师傅
      this.partArr.map(item => {
        this.priceSum += item.piecePrice * item.pieceNum
        this.totalCost += item.piecePrice * item.pieceNum
      }) // 配件
      if (this.discount) {
        this.priceSum = this.priceSum * this.discount * 0.1 + this.checkG
      } else {
        this.priceSum = this.priceSum + this.checkG
      }
      if (this.guaranteeIndex) {
        this.priceSum = 0
      }
    },
    repairVisible (newData, oldData) {
      if (newData) {
        const sendForm = this.repairData.processes[this.repairData.processes.length - 1].afterSaleVisit
        this.sendForm.technicalPlatform = sendForm.technicalPlatform
        this.sendForm.technicalServiceNo = sendForm.technicalServiceNo
        this.sendForm.technicalName = sendForm.technicalName
        this.sendForm.technicalCost = sendForm.technicalCost
        this.sendForm.technicalPhone = sendForm.technicalPhone
        this.sendForm.visitTime = sendForm.visitTime
        if (sendForm.technicianPhoneList) {
          this.sendForm.technicianPhoneList = sendForm.technicianPhoneList
        }
        this.sendForm.technicalPrice = sendForm.technicalPrice
      }
    },
    'editForm.brand' (newData, oldData) {
      console.log(newData, oldData)
    //   console.log('brandArrs', this.brandArrs)
      // this.editForm.productModel = undefined
      this.brandArrs.filter(item => {
        if (item.name === newData) {
          this.modelArr = item.modelArr
        }
      })
    //   console.log('this.modelArr', this.modelArr)
    }
  }
}
</script>
<style lang="less" scoped>
.form{
  margin: 20px 40px;
}
.form_estimateData_checkquestion {
  line-height: 30px;
  margin: 20px 0px;
}
.form_pay_title {
  font-size: 24px;
  /* margin-left: 40px; */
}
.userLabel{
  float: right;
}
.big_title {
  font-size: 18px;
  line-height: 40px;
  margin-top: 12px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
}
.ant-descriptions-title {
  margin-bottom: 0px !important
}
.processList:hover{
  border: 1px solid #40a9ffa1;
  box-shadow: 1px 1px 10px #55c7db81,
  -1px -1px 6px #7ee7faa4;
}
.customDes{
  margin-top: 30px;
}
/deep/.customDes .ant-descriptions-item-label {
  width: 140px;
}
/deep/.proDes .ant-descriptions-item-label {
  width: 120px;
}
/deep/.questDes .ant-descriptions-item-label {
  width: 120px;
}

/deep/.reasonDes .ant-descriptions-item-label {
  width: 140px;
}
/deep/.sendDes .ant-descriptions-item-label {
  width: 140px;
}
/deep/.questionDes .ant-descriptions-item-label {
  width: 140px;
}

/deep/.visitDes .ant-descriptions-item-label {
  width: 140px;
}

.small_title {
  font-size: 17px;
  line-height: 24px;
  margin: 6px 0;
}

/deep/.visitDes .ant-form-item-control {
  margin-top: 24px;
}
.qrcode{
  width: 160px;
  border: 1px solid #adadad;
  padding: 10px;
  text-align: center;
  margin: 20px 30px;
}
.topCode{
  display: flex;
  justify-content: space-between;
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 20px;
  margin: 0px 30px;
}
.codePayResult{
  margin: 20px 30px;
  font-size: 20px;
}
</style>
