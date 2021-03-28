<template>
  <v-tooltip :disabled="tipDisabled" bottom>
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on" @mouseenter="tipping">
        <v-avatar size="24" :tile="tile" v-if="!!url" @click="emit()">
          <img :src="url" />
        </v-avatar>
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'big-tree'"
          @click="emit()"
          class="mdi-rotate-270"
          :color="colors.bigTree"
          >mdi-family-tree</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="mdi" @click="emit()">{{
          name
        }}</v-icon>
        <v-icon :disabled="disabled" v-else-if="name === 'json'" @click="emit()"
          >mdi-code-json</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'tags'" @click="emit()"
          >mdi-tag-multiple</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'excel'"
          @click="emit()"
          >mdi-microsoft-excel</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'word'" @click="emit()"
          >mdi-microsoft-word</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'windows'"
          @click="emit()"
          >mdi-microsoft-windows</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'office'"
          @click="emit()"
          >mdi-microsoft-office</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'hover'"
          @click="emit()"
          >mdi-beaker-plus</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'hover-off'"
          @click="emit()"
          >mdi-beaker-minus</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'youtube'"
          @click="emit()"
          >mdi-youtube</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'linkedin'"
          @click="emit()"
          >mdi-linkedin</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'info'" @click="emit()"
          >mdi-information</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'filter-off'"
          @click="emit()"
          >mdi-filter-off</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'open'" @click="emit()"
          >mdi-open-in-new</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'filter-on'"
          @click="emit()"
          >mdi-filter</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'timeZone'"
          @click="emit()"
          >mdi-map-clock</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'advancedServices'"
          @click="emit()"
          >mdi-layers</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'root'" @click="emit()"
          >mdi-file-tree</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'company'"
          @click="emit()"
          >mdi-office-building</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'alert'"
          @click="emit()"
          >mdi-alert-circle</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'small-tree'"
          @click="emit()"
          :color="colors.smallTree"
          >mdi-file-tree</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'location'"
          @click="emit()"
          >mdi-map-marker</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'email'"
          @click="emit()"
          >mdi-email</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'files'"
          @click="emit()"
          >mdi-briefcase</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'file'" @click="emit()"
          >mdi-file</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'dataStudio'"
          @click="emit()"
          >mdi-toy-brick</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'github'"
          @click="emit()"
          >mdi-github</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'clasp'"
          @click="emit()"
          >mdi-package-variant</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'stats'"
          @click="emit()"
          >mdi-table-eye</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'webapp'"
          @click="emit()"
          >mdi-web</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'runtimeVersion'"
          @click="emit()"
          >mdi-book</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'oauthScopes'"
          @click="emit()"
          >mdi-shield</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'access'"
          @click="emit()"
          >mdi-account-key</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'as'" @click="emit()"
          >mdi-account-convert</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'addOns'"
          @click="emit()"
          >mdi-cloud</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'close'"
          @click="emit()"
          >mdi-close</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'close-left'"
          @click="emit()"
          >mdi-chevron-left</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'owners'"
          @click="emit()"
          >mdi-account</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'viz-info'"
          @click="emit()"
          >mdi-comment</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'viz-info-off'"
          @click="emit()"
          >mdi-comment-off</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'repos'"
          @click="emit()"
          >mdi-folder</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'refresh'"
          @click="emit()"
          >mdi-refresh</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'libraries'"
          @click="emit()"
          >mdi-database</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'twitter'"
          @click="emit()"
          >mdi-twitter</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'maps'" @click="emit()"
          >mdi-google-maps</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'bio'" @click="emit()"
          >mdi-bio</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'shallower'"
          @click="emit()"
          >mdi-page-previous</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'deeper'"
          @click="emit()"
          >mdi-page-next</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'phone'"
          @click="emit()"
          >mdi-phone</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'fees'" @click="emit()"
          >mdi-cash-multiple</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'support'"
          @click="emit()"
          >mdi-lifebuoy</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'text'" @click="emit()"
          >mdi-text</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'hireable'"
          @click="emit()"
          >mdi-currency-usd</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'hireable-off'"
          @click="emit()"
          >mdi-currency-usd-off</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'followers'"
          @click="emit()"
          >mdi-account-group</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'version'"
          @click="emit()"
          >mdi-counter</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'pin'" @click="emit()"
          >mdi-pin</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'unpin'"
          @click="emit()"
          >mdi-pin-off</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'symbol'"
          @click="emit()"
          >mdi-feather</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'blog'" @click="emit()"
          >mdi-blogger</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'copy'" @click="emit()"
          >mdi-content-copy</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'id'" @click="emit()"
          >mdi-identifier</v-icon
        >
        <v-icon :disabled="disabled" v-else-if="name === 'auth'" @click="emit()"
          >mdi-lock-plus</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'login'"
          @click="emit()"
          >mdi-login</v-icon
        >
        <v-avatar
          size="24"
          :tile="tile"
          v-else-if="name === 'appsscript'"
          @click="emit()"
        >
          <img src="../assets/appsscript.png" />
        </v-avatar>
        <v-avatar size="24" tile v-else-if="name === 'drive'" @click="emit()">
          <img src="../assets/GoogleDrive_2020.png" />
        </v-avatar>
        <v-avatar size="24" tile v-else-if="name === 'sheets'" @click="emit()">
          <img src="../assets/Sheets_2020.png" />
        </v-avatar>
        <v-avatar size="24" tile v-else-if="name === 'docs'" @click="emit()">
          <img src="../assets/Docs_2020.png" />
        </v-avatar>
        <v-avatar
          size="24"
          tile
          v-else-if="name === 'calendar'"
          @click="emit()"
        >
          <img src="../assets/GoogleCalendar_2020.png" />
        </v-avatar>
        <v-avatar size="24" tile v-else-if="name === 'gmail'" @click="emit()">
          <img src="../assets/Gmail_2020.png" />
        </v-avatar>
        <v-avatar size="24" tile v-else-if="name === 'gcp'" @click="emit()">
          <img src="../assets/gcp.png" />
        </v-avatar>
        <v-avatar size="24" tile v-else-if="name === 'slides'" @click="emit()">
          <img src="../assets/Slides_2020.png" />
        </v-avatar>
        <v-icon :disabled="disabled" v-else-if="name === 'html'" @click="emit()"
          >mdi-language-html5</v-icon
        >
        <v-icon
          :disabled="disabled"
          v-else-if="name === 'scrviz'"
          @click="emit()"
          >mdi-semantic-web</v-icon
        >
        <v-icon :disabled="disabled" v-else @click="emit()">mdi-help"</v-icon>
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
    tile() {
      return !this.avatar;
    },
    ...maps.state,
  },
  methods: {
    emit() {
      this.$emit("clicked", this.name);
    },
    tipping() {
      if (this.unmouse) this.setInfoMoused(false);
    },
    ...maps.mutations,
  },
  props: {
    name: String,
    tip: String,
    unmouse: Boolean,
    url: String,
    avatar: Boolean,
    mdi: Boolean,
    disabled: Boolean,
  },
};
</script>
