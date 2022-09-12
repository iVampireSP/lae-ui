<template>
  <div>
    <div v-show="chargeSuccess" class="alert alert-success" role="alert">
      非常感谢，请在新打开的窗口进行支付。
    </div>
    <h3>添加到余额</h3>
    <div>
      <!-- 金额 -->
      <div class="form-group">
        <label for="amount">金额(元)</label>
        <input
          type="number"
          class="form-control"
          id="amount"
          placeholder="请输入金额"
          v-model="charge.amount"
        />

        <span>≈ {{ charge.amount * dropsRate }} Drops</span>
      </div>

      <div class="mt-3">
        <span>选择支付方式</span>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            v-model="charge.payment"
            value="alipay"
            id="paymentAlipay"
          />
          <label class="form-check-label" for="paymentAlipay"> 支付宝 </label>
        </div>
      </div>

      <div class="mt-3">
        <!-- button -->
        <button class="btn btn-primary" @click="doCharge()">充值</button>
      </div>

      <div>请注意: 由于计费方式的特殊性，我们不支持退款，请合理充值。</div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../../api/http'
  import store from '../../plugins/store'

  const dropsRate = ref(store.state.user.drops_rate)

  const chargeSuccess = ref(false)

  const charge = ref({
    amount: 10,
    payment: 'alipay',
  })

  function doCharge() {
    http
      .post('/balances', charge.value)
      .then((res) => {
        if (res.data.pay_url) {
          window.open(res.data.pay_url)
        }
        chargeSuccess.value = true
      })
      .catch((err) => {
        alert('金额输入错误，它应该为整数。')
      })
  }
</script>