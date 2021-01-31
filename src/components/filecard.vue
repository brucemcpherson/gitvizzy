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
      <v-list-item v-if="fields.claspHtmlUrl">
        <v-list-item-icon>
          <icons name="clasp" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ fields.repoFullName }}</v-list-item-title>
          <v-list-item-subtitle>
            <a :href="fields.claspHtmlUrl" target="_blank">{{ claspLabel }}</a>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="fields.scriptId">
        <v-list-item-icon>
          <icons
            v-if="canClip"
            name="copy"
            :tip="clipping ? 'id copied' : 'click to copy id'"
            @clicked="clipText(fields.scriptId)"
          />
          <icons v-else name="id" />
        </v-list-item-icon>
        <v-list-item-content>
          <span>{{ fields.scriptId }}</span>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="scriptUrl">
        <v-list-item-icon>
          <icons
            v-if="canClip"
            name="copy"
            :tip="
              clipping
                ? 'script Url copied (may not be public)'
                : 'copy script url (may not be public)'
            "
            @clicked="clipText(scriptUrl)"
          />
          <icons v-else name="id" />
        </v-list-item-icon>
        <v-list-item-content
          ><span>
            <a :href="scriptUrl" target="_blank">
              Apps Script IDE
            </a></span
          >
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
  data: () => {
    return {
      clipping: false,
    };
  },
  methods: {
    clipText(value) {
      this.clipping = false;
      return navigator.clipboard
        .writeText(value)
        .then(() => (this.clipping = true));
    },
  },
  computed: {
    canClip() {
      return navigator.clipboard && navigator.clipboard.writeText;
    },
    claspLabel() {
      return this.fields.claspHtmlUrl
        ? `clasp: ${this.fields.path.replace("appsscript.json", ".clasp.json")}`
        : null;
    },
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
      return "manifest: " + this.fields.path;
    },

    folderLabel() {
      return "project: " + this.path;
    },
    scriptUrl() {
      return this.fields.scriptId
        ? `https://script.google.com/home/projects/${this.fields.scriptId}/edit`
        : null;
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
