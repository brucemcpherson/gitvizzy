<template>
  <v-tooltip :disabled="tipDisabled" bottom>
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <v-icon
          v-if="name === 'big-tree'"
          @click="emit()"
          class="mdi-rotate-270"
          :color="colors.bigTree"
          >mdi-family-tree</v-icon
        >
        <v-icon v-else-if="name === 'filter-off'" @click="emit()"
          >mdi-filter-off</v-icon
        >
        <v-icon v-else-if="name === 'filter-on'" @click="emit()"
          >mdi-filter</v-icon
        >
        <v-icon v-else-if="name === 'timeZone'" @click="emit()"
          >mdi-map-clock</v-icon
        >
        <v-icon v-else-if="name === 'advancedServices'" @click="emit()"
          >mdi-layers</v-icon
        >
        <v-icon v-else-if="name === 'root'" @click="emit()"
          >mdi-file-tree</v-icon
        >
        <v-icon v-else-if="name === 'company'" @click="emit()"
          >mdi-office-building</v-icon
        >
        <v-icon
          v-else-if="name === 'small-tree'"
          @click="emit()"
          :color="colors.smallTree"
          >mdi-file-tree</v-icon
        >
        <v-icon v-else-if="name === 'location'" @click="emit()"
          >mdi-map-marker</v-icon
        >
        <v-icon v-else-if="name === 'email'" @click="emit()">mdi-email</v-icon>
        <v-icon v-else-if="name === 'files'" @click="emit()"
          >mdi-briefcase</v-icon
        >
        <v-icon v-else-if="name === 'file'" @click="emit()">mdi-file</v-icon>
        <v-icon v-else-if="name === 'dataStudio'" @click="emit()"
          >mdi-toy-brick</v-icon
        >
        <v-icon v-else-if="name === 'github'" @click="emit()"
          >mdi-github</v-icon
        >
        <v-icon v-else-if="name === 'webapp'" @click="emit()">mdi-web</v-icon>
        <v-icon v-else-if="name === 'runtimeVersion'" @click="emit()"
          >mdi-book</v-icon
        >
        <v-icon v-else-if="name === 'oauthScopes'" @click="emit()"
          >mdi-shield</v-icon
        >
        <v-icon v-else-if="name === 'access'" @click="emit()"
          >mdi-account-key</v-icon
        >
        <v-icon v-else-if="name === 'as'" @click="emit()"
          >mdi-account-convert</v-icon
        >
        <v-icon v-else-if="name === 'addOns'" @click="emit()">mdi-cloud</v-icon>
        <v-icon v-else-if="name === 'close-left'" @click="emit()"
          >mdi-chevron-left</v-icon
        >
        <v-icon v-else-if="name === 'owners'" @click="emit()"
          >mdi-account</v-icon
        >
        <v-icon v-else-if="name === 'viz-info'" @click="emit()"
          >mdi-comment</v-icon
        >
        <v-icon v-else-if="name === 'viz-info-off'" @click="emit()"
          >mdi-comment-off</v-icon
        >
        <v-icon v-else-if="name === 'repos'" @click="emit()">mdi-folder</v-icon>
        <v-icon v-else-if="name === 'refresh'" @click="emit()"
          >mdi-refresh</v-icon
        >
        <v-icon v-else-if="name === 'libraries'" @click="emit()"
          >mdi-database</v-icon
        >
        <v-icon v-else-if="name === 'twitter'" @click="emit()"
          >mdi-twitter</v-icon
        >
        <v-icon v-else-if="name === 'bio'" @click="emit()"
          >mdi-text-account</v-icon
        >
        <v-icon v-else-if="name === 'fees'" @click="emit()"
          >mdi-cash-multiple</v-icon
        >
        <v-icon v-else-if="name === 'support'" @click="emit()"
          >mdi-lifebuoy</v-icon
        >
        <v-icon v-else-if="name === 'text'" @click="emit()">mdi-text</v-icon>
        <v-icon v-else-if="name === 'hireable'" @click="emit()"
          >mdi-currency-usd</v-icon
        >
        <v-icon v-else-if="name === 'hireable-off'" @click="emit()"
          >mdi-currency-usd-off</v-icon
        >
        <v-icon v-else-if="name === 'followers'" @click="emit()"
          >mdi-account-group</v-icon
        >
        <v-icon v-else-if="name === 'version'" @click="emit()"
          >mdi-counter</v-icon
        >
        <v-icon v-else-if="name === 'symbol'" @click="emit()"
          >mdi-feather</v-icon
        >
        <v-icon v-else-if="name === 'blog'" @click="emit()">mdi-web</v-icon>
        <v-icon v-else-if="name === 'copy'" @click="emit()"
          >mdi-content-copy</v-icon
        >
        <v-icon v-else-if="name === 'id'" @click="emit()"
          >mdi-identifier</v-icon
        >
      </span>
    </template>
    <span>
      {{ tip }}
    </span>
  </v-tooltip>
</template>
<script>
import maps from "@/js/storemaps";
export default {
  name: "icons",
  computed: {
    tipDisabled() {
      return !this.tip;
    },
    ...maps.state,
  },
  methods: {
    emit() {
      this.$emit("clicked", this.name);
    },
  },
  props: {
    name: String,
    tip: String,
  },
};
</script>
