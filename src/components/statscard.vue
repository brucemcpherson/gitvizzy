<template>
  <v-card>
    <v-card-title>Vizzy stats</v-card-title>
    <v-card v-for="item in items" :key="item">
      <v-card-title>Owners</v-card-title>
      <v-card-text>{{ item.count }}</v-card-text>
    </v-card>
  </v-card>
</template>
<script>
import { getStats } from "@/js/d3prep";
export default {
  computed: {
    getStats() {
      return getStats;
    },
    items() {
      return (
        this.getStats &&
        Object.keys(this.getStats).map((f) => {
          return {
            name: f,
            count: f.count,
          };
        })
      );
    },
  },
};
</script>
