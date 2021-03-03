<template>
  <v-bottom-sheet v-model="show">
    <v-sheet class="text-center" height="200px">
      <v-toolbar dense color="error" dark>
        <v-spacer /><v-toolbar-title>
          {{ errorTitle }}
        </v-toolbar-title>
        <v-spacer /><icons name="close" @clicked="show = false" />
      </v-toolbar>
      <slot name="message">
        <div v-if="errorMessage">
          {{ errorMessage }}
        </div>
        <div v-if="errorError" v-html="errorError">
          {{ errorError }}
        </div>
      </slot>
    </v-sheet>
  </v-bottom-sheet>
</template>
<script>
import maps from "@/js/storemaps";
import icons from "@/components/icons";

export default {
  components: {
    icons,
  },
  methods: {
    format(error) {
      if (!error) return "";
      return ["name", "message", "status", "fileName", "lineNumber"]
        .map((f) => {
          return error[f] ? `<div>${f}:${error[f]}</div>` : null;
        })
        .filter((f) => f)
        .join("");
    },
    ...maps.mutations,
  },
  computed: {
    show: {
      get() {
        return this.showError;
      },
      set(value) {
        this.setShowError(value);
      },
    },
    errorTitle() {
      return (this.showMessage && this.showMessage.title) || "Error";
    },
    errorMessage() {
      return (
        (this.showMessage && this.showMessage.message) ||
        "There was an unknown error"
      );
    },
    errorError() {
      return this.showMessage && this.format(this.showMessage.error);
    },
    ...maps.state,
  },
};
</script>
