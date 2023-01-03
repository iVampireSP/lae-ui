<template>
  <div
    class="modal fade"
    id="quickCharge"
    tabindex="-1"
    aria-labelledby="quickChargeModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="quickChargeModalLabel">快速充值</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <input
            type="radio"
            name="payment"
            id="wechat"
            value="wechat"
            v-model="balance.payment"
            checked
          />
          <label for="wechat">
            &nbsp; <i class="bi bi-wechat"></i> 微信支付</label
          >
          <div class="d-inline" style="margin-left: 5%"></div>
          <input
            type="radio"
            name="payment"
            id="alipay"
            value="alipay"
            v-model="balance.payment"
          />
          <label for="alipay">
            &nbsp; <i class="bi bi-alipay"></i> 支付宝</label
          >

          <form class="form-floating mt-2">
            <input
              type="number"
              class="form-control"
              id="balanceFloatingInputValue"
              :placeholder="balance.amount"
              v-model="balance.amount"
            />
            <label for="balanceFloatingInputValue">输入金额 (元)</label>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            关闭
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="charge()">
            充值
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../api/http'

  const balance = ref({
    payment: 'wechat',
    amount: 10,
  })

  function charge() {
    http.post('/balances', balance.value).then((res) => {
        let winRef = window.open("url","_blank");
        winRef.location = res.data.url;
    })
  }
</script>
