<template>
  <router-view></router-view>
</template>

<script setup>
import {addMenuOptions, removeAllMenuOptions, removeAllMenuOptionsThen} from "../../../plugins/menuOptions.js";
import {ListOutline} from "@vicons/ionicons5";
import {ArticleOutlined} from "@vicons/material"

removeAllMenuOptions()

removeAllMenuOptionsThen('left', () => {
  addMenuOptions('left', 'modules.forbidden-forest.index', '最新文章', ListOutline)
  addMenuOptions('left', 'modules.forbidden-forest.my', '您的博客', ArticleOutlined)
})

</script>