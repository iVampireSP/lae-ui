<template>
  <NAvatar :size="large" round src=""></NAvatar>
</template>

<script setup>
import {NAvatar} from "naive-ui";
import {computed} from "vue";

import config from "../../config/api.js";
import userStore from "../../plugins/stores/user.js";


const avatar = computed(() => {
  return config.avatar + userStore.state.user.email_md5 + '?s=50';
})


</script>


<style scoped>

</style>