<template>
  <v-card flat>
    <v-card-text>
      <span class="mx-2"><icons name="drive"/></span>
      <span class="ml-2"
        >Since this will be a container bound project, you need to pick an
        appropriate Drive file to contain this project</span
      >
    </v-card-text>
    <v-card-actions>
      <v-btn @click="createPicker" class="ml-4" color="primary">pick</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
/* global google */
import maps from "@/js/storemaps";
import icons from "@/components/icons";

export default {
  components: {
    icons,
  },
  computed: {
    ...maps.state,
    ...maps.getters,
  },
  methods: {
    createPicker() {
      if (!this.picker) {

        this.picker = new google.picker.PickerBuilder()

          .addView(
            new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS)
          )
          .addView(new google.picker.DocsView(google.picker.ViewId.DOCUMENTS))
          .addView(
            new google.picker.DocsView(google.picker.ViewId.PRESENTATIONS)
          )
          .addView(new google.picker.DocsView(google.picker.ViewId.FORMS))
          .addView(google.picker.ViewId.RECENTLY_PICKED)

          .setOAuthToken(this.googleToken)
          .setDeveloperKey(this.pickerKey)
          .setAppId(this.appId)
          .setCallback(this.pickerCallback)
          .setOrigin(window.location.protocol + "//" + window.location.host)
          .setTitle("Select the document that will contain this script")

          .build();
      }
      this.picker.setVisible(true);
    },
    pickerCallback(data) {
      let url = "nothing";
      let doc = null;

      const g = google.picker;

      if (data[g.Response.ACTION] == g.Action.PICKED) {
        doc = data[g.Response.DOCUMENTS][0];

        url = doc[g.Document.URL];
      }
      this.message = "You picked: " + url;
      this.$emit(
        "picked",
        doc
          ? {
              name: doc[g.Document.NAME],
              id: doc[g.Document.ID],
              url: doc[g.Document.URL],
              iconUrl: doc[g.Document.ICON_URL],
            }
          : null
      );
    },
    ...maps.actions,
  },
  data: () => {
    return {
      message: null,
      picker: null,
    };
  },
};
</script>
