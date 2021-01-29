<template>
  <div>
    <v-list :color="listColor" dense>
      <v-list-item>
        <v-list-item-icon>
          <icons name="github" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ fields.repoFullName }}</v-list-item-title>
          <v-list-item-subtitle>
            <a :href="folder" target="_blank">{{ folderLabel }}</a>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <icons name="file" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ fields.repoFullName }}</v-list-item-title>
          <v-list-item-subtitle>
            <a :href="fields.html_url" target="_blank">{{ fileLabel }}</a>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <json-viewer :value="manifest"></json-viewer>
  </div>
</template>
<script>
import icons from "@/components/icons";
export default {
  components: {
    icons,
  },
  props: {
    fields: Object,
    listColor: String,
    manifest: Object,
  },
  computed: {
    path() {
      return this.masterName || "/";
    },
    masterName() {
      return `${this.fields.path}`.replace(this.fields.name, "");
    },
    folder() {
      return `https://github.com/${this.fields.repoFullName}/tree/master/${this.masterName}`;
    },

    fileLabel() {
      return "manifest:" + this.fields.path;
    },

    folderLabel() {
      return "project:" + this.path;
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
