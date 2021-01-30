<template>
  <div>
    <v-list :color="listColor" dense>
      <v-list-item>
        <v-list-item-icon>
          <v-avatar v-if="commonLogo" size="24"
            ><img :src="commonLogo"
          /></v-avatar>
          <icons v-else name="addOns" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ commonName }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="slides">
        <v-list-item-icon>
          <img width="24" v-if="slidesLogo" :src="slidesLogo" />
          <icons v-else name="addOns" />
        </v-list-item-icon>
        <v-list-item-content>
          Slides Addon
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="sheets">
        <v-list-item-icon>
          <img width="24" v-if="sheetsLogo" :src="sheetsLogo" />
          <icons v-else name="addOns" />
        </v-list-item-icon>
        <v-list-item-content>
          Sheets Addon
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="gmail">
        <v-list-item-icon>
          <img width="24" v-if="gmailLogo" :src="gmailLogo" />
          <icons v-else name="addOns" />
        </v-list-item-icon>
        <v-list-item-content>
          Gmail Addon
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="calendar">
        <v-list-item-icon>
          <img width="24" v-if="calendarLogo" :src="calendarLogo" />
          <icons v-else name="addOns" />
        </v-list-item-icon>
        <v-list-item-content>
          Calendar Addon
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="docs">
        <v-list-item-icon>
          <img width="24" v-if="docsLogo" :src="docsLogo" />
          <icons v-else name="addOns" />
        </v-list-item-icon>
        <v-list-item-content>
          Docs Addon
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="drive">
        <v-list-item-icon>
          <img width="24" v-if="driveLogo" :src="driveLogo" />
          <icons v-else name="addOns" />
        </v-list-item-icon>
        <v-list-item-content>
          Drive Addon
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
import icons from "@/components/icons";
import slidesLogo from "@/assets/Slides_2020.png";
import sheetsLogo from "@/assets/Sheets_2020.png";
import gmailLogo from "@/assets/Gmail_2020.png";
import calendarLogo from "@/assets/GoogleCalendar_2020.png";
import driveLogo from "@/assets/GoogleDrive_2020.png";
import docsLogo from "@/assets/Docs_2020.png";

export default {
  components: {
    icons,
  },
  props: {
    fields: Object,
    listColor: String,
  },
  computed: {
    common() {
      return this.fields && this.fields.common;
    },
    commonLogo() {
      return this.common && this.common.logoUrl;
    },
    commonName() {
      return this.common && this.common.name;
    },
    slides() {
      return this.fields && this.fields.slides;
    },
    slidesLogo() {
      return this.slides && slidesLogo;
    },
    sheets() {
      return this.fields && this.fields.sheets;
    },
    sheetsLogo() {
      return this.sheets && sheetsLogo;
    },
    gmail() {
      return this.fields && this.fields.gmail;
    },
    gmailLogo() {
      return this.gmail && gmailLogo;
    },
    calendar() {
      return this.fields && this.fields.calendar;
    },
    calendarLogo() {
      return this.calendar && calendarLogo;
    },
    drive() {
      return this.fields && this.fields.drive;
    },
    driveLogo() {
      return this.drive && driveLogo;
    },
    docs() {
      return this.fields && this.fields.docs;
    },
    docsLogo() {
      return this.docs && docsLogo;
    },
  },
};
</script>
<style scoped>
a:link {
  color: #f5f5f5;
}

a:visited {
  color: #f5f5f5;
}

a:active {
  color: #f5f5f5;
}
a:link {
  color: #f5f5f5;
}
</style>
