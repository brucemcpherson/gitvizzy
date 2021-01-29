<template>
  <div class="mt-1">
    <json-viewer :value="manifest" :expand-depth="2"></json-viewer>
  </div>
</template>
<script>
export default {
  props: {
    manifest: Array,
  },
};
</script>
<style scoped>
a:link {
  color: #f5f5f5;
}

a:visited {
  color: #f5f5f5;
}

a:active {
  color: #f5f5f5;
}
a:link {
  color: #f5f5f5;
}
</style>
