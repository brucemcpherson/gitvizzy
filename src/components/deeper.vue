<template>
  <span>
    <span class="mr-2">
      <icons :disabled="!shallower" name="shallower" tip="shrink tree visualization" @clicked="$emit('shallower')"/>
    </span>
    <icons :disabled="!deeper" name="deeper" tip="expand tree visualiation" @clicked="$emit('deeper')"/>
  </span>
</template>
<script>
import icons from "@/components/icons";
export default {
  components: {
    icons,
  },
  props: {
    shallower: Boolean,
    deeper: Boolean
  }
};
</script>
