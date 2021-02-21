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
import maps from "@/js/storemaps";
import icons from "@/components/icons";
export default {
  components: {
    icons,
  },
  computed: {
    ...maps.state,
  },
  mounted() {
    if (!this.googleToken) this.pickerStuff(this.$store);
  },
  methods: {
    createPicker() {
      if (!this.picker) {
        // eslint-disable-next-line no-undef
        this.picker = new google.picker.PickerBuilder()
          // eslint-disable-next-line no-undef
          .addView(google.picker.ViewId.DOCS)
          .setOAuthToken(this.googleToken)
          .setDeveloperKey(this.pickerKey)
          .setCallback(this.pickerCallback)
          .setTitle("Select the document that will contain this script")
          .build();
      }
      this.picker.setVisible(true);
    },
    pickerCallback(data) {
      var url = "nothing";
      // eslint-disable-next-line no-undef
      const g = google.picker;

      if (data[g.Response.ACTION] == g.Action.PICKED) {
        // eslint-disable-next-line no-undef
        var doc = data[g.Response.DOCUMENTS][0];
        // eslint-disable-next-line no-undef
        url = doc[g.Document.URL];
      }
      this.message = "You picked: " + url;
      this.$emit("picked", {
        name: doc[g.Document.NAME],
        id: doc[g.Document.ID],
        url: doc[g.Document.URL],
        iconUrl: doc[g.Document.ICON_URL],
      });
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
