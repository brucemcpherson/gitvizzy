<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-chip label v-on="on" color="secondary">
        <v-avatar small v-if="pic"><img :src="pic"/></v-avatar>
        <icons v-else :name="iconType" />
        <span class="ml-1">{{ infoName }}</span>
        <span class="ml-1" v-if="infoChildrenCount"
          >({{ infoChildrenCount
          }}<span class="ml-1">{{ infoChildrenName }})</span></span
        >
      </v-chip>
    </template>
    <span
      ><icons name="iconType" />{{ iconType }} -
      {{ infoName || repoName }}</span
    >
  </v-tooltip>
</template>
<script>
import icons from "@/components/icons";

export default {
  props: {
    repoName: String,
    pic: String,
    infoName: String,
    infoChildrenCount: Number,
    infoChildrenName: String,
    iconType: String,
  },
  components: {
    icons,
  },
};
</script>
