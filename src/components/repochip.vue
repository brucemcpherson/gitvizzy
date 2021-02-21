<template>
  <v-tooltip bottom v-if="ownerPic">
    <template v-slot:activator="{ on }">
      <v-chip label v-on="on" color="accent">
        <v-avatar small v-if="ownerPic"><img :src="ownerPic"/></v-avatar>
        <icons v-else name="repos" />
        <span class="caption ml-2">{{ repoName }}</span>
      </v-chip>
    </template>
    <span><icons name="github" /> repo {{ repoName }}</span>
  </v-tooltip>
</template>
<script>
import icons from "@/components/icons";

export default {
  props: {
    repoName: String,
    ownerPic: String
  },
  components: {
    icons,
  },
};
</script>
