<template>
  <div>
    <h3>交易记录</h3>

    <p>
      注意:
      这里使用的了四舍五入等，以及在我们进行浮点计算时可能会有一些误差。<br />
      以下记录将会保存 1 年。
    </p>

    <div class="overflow-auto">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">类型</th>
            <th scope="col">支付方式</th>
            <th scope="col">说明</th>
            <th scope="col">入账</th>
            <th scope="col">支出</th>
            <th scope="col">余额</th>
            <th scope="col">交易时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions">
            <td>
              <span v-if="transaction.type == 'payout'" class="text-danger">
                支出
              </span>
              <span v-if="transaction.type == 'income'" class="text-success">
                收入
              </span>
            </td>

            <td>
              <span v-if="transaction.payment == 'drops'"> Drops </span>
              <span v-else-if="transaction.payment == 'alipay'"> 支付宝 </span>
              <span v-else-if="transaction.payment == 'wepay'"> 微信支付 </span>
              <span v-else-if="transaction.payment == 'balance'"> 余额 </span>
              <span v-else-if="transaction.payment == 'console'"> 控制台 </span>
              <span v-else> {{ transaction.payment }} </span>
            </td>

            <td>
              {{ transaction.description }}
            </td>

            <td class="text-success">
              {{ transaction.income }} 元
              <br />
              {{ transaction.income_drops }} Drops
            </td>

            <td class="text-danger">
              {{ transaction.outcome }} 元
              <br />
              {{ transaction.outcome_drops }} Drops
            </td>

            <td>
              {{ transaction.balance }} 元
              <br />
              {{ transaction.drops }} Drops
            </td>

            <td>
              {{ new Date(transaction.created_at).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import http from '../../api/http'
  import { ref } from 'vue'

  const transactions = ref([])

  http.get('/balances/transactions').then((res) => {
    transactions.value = res.data
  })
</script>
