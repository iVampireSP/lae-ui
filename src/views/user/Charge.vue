<template>
  <div>
    <h3>添加到余额</h3>

    <div>
      充值，已经迁移到了 <a target="_blank" :href="url"> {{ url }}</a>
      <br />
      以后充值请都在上面的网站进行。
    </div>
    <div class="mt-5">
      请注意: 由于计费方式的特殊性，我们不支持退款，请合理充值。

      <br />
      <a
        target="_blank"
        href="https://forum.laecloud.com/d/4-wo-chong-zhi-hou-jin-e-mei-you-li-ji-dao-zhang"
      >
        必看! 充值后金额没有立即到账的原因。
      </a>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import api from '../../config/api'

  const url = ref('')
  url.value = api.auth + '/balances'

  //   const chargeSuccess = ref(false)

  //   const charge = ref({
  //     amount: 10,
  //     payment: 'alipay',
  //   })

  //   function doCharge() {
  //     http
  //       .post('/balances', charge.value)
  //       .then((res) => {
  //         if (res.data.pay_url !== undefined) {
  //           let winOpen = window.open('', '_blank')

  //           winOpen.location = res.data.pay_url
  //         }

  //         chargeSuccess.value = true
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //       })
  //   }
</script>
