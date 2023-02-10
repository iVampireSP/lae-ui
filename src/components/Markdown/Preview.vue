<template>
  <div class="preview">
    <VMdPreview :mode="mode" :text="text"/>
  </div>
</template>

<script setup>
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
// import '@kangc/v-md-editor/lib/theme/style/github.css'
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

VMdPreview.use(githubTheme, {
  Prism,
});

defineProps({
  text: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    default: 'preview',
  },
})

</script>

<style scoped>

.preview .v-md-editor-preview .github-markdown-body {
  padding: 0 !important;
}

.preview .github-markdown-body p {
  padding: 0 !important;
  margin-bottom: 0 !important;
}
</style>
