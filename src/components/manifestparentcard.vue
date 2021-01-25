<template>
  <div class="mt-1">
    <json-viewer :value="manifest" :expand-depth="2"></json-viewer>
  </div>
</template>
<script>

export default {
  props: {
    manifest: Array,
  }
};
</script>

