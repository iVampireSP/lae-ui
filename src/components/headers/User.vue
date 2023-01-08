<template>
  <NAvatar :size="large" round src=""></NAvatar>
</template>

<script setup>
import {NAvatar} from "naive-ui";
import {computed} from "vue";
import conf from "../../config/api.js";

const avatar = computed(() => {
  return conf.avatar + user.value.email_md5 + '?s=256';
})


</script>


<style scoped>

</style>