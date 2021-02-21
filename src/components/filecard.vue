<template>
  <div>
    <v-dialog
      v-model="modelPullDialog"
      transition="dialog-bottom-transition"
      scrollable
      persistent
      max-width="840"
    >
      <pull-dialog
        :repoUrl="repoUrl"
        :repoName="repoName"
        :pic="pic"
        :infoName="infoName"
        :infoChildrenCount="infoChildrenCount"
        :infoChildrenName="infoChildrenName"
        :iconType="iconType"
        :ownerPic="ownerPic"
        :folder="folder"
        :folderLabel="folderLabel"
      />
    </v-dialog>
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
              Attempt to open in apps Script IDE
            </a></span
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-card-title class="subtitle-2">Manifest content</v-card-title>

    <v-card-text>
      <json-viewer
        class="elevation-10"
        v-if="manifest"
        :value="manifest"
      ></json-viewer>
      <span v-else>Manifest is invalid or empty</span>
    </v-card-text>

    <v-card v-if="manifest" :color="listColor" flat>
      <v-card-title
        >Create Apps Script project from github</v-card-title
      >

      <v-list :color="listColor">
        <v-list-item>
          <v-list-item-icon>
            <icons v-if="isAuthorized" :url="userImage" name="owners" avatar />
            <icons v-else name="auth" />
          </v-list-item-icon>
          <v-list-item-content
            ><span v-if="isAuthorized"
              >{{ userName }} has authorized apps script access</span
            ><span v-else>
              scrviz will need to access your apps script projects
            </span></v-list-item-content
          >
          <v-list-item-action
            ><v-btn color="accent" @click="doAuth" :disabled="isAuthorized"
              >authorize</v-btn
            ></v-list-item-action
          >
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <icons name="appsscript" @clicked="flipPullDialog" />
          </v-list-item-icon>
          <v-list-item-content>
            Select repo files and configure Apps Script project
          </v-list-item-content>
          <v-list-item-action
            ><v-btn
              color="accent"
              @click="flipPullDialog"
              :disabled="showPullDialog || !isAuthorized"
              >Configure</v-btn
            ></v-list-item-action
          >
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>
<script>
import icons from "@/components/icons";
import pulldialog from "@/components/pulldialog";
import maps from "@/js/storemaps";
export default {
  components: {
    icons,
    "pull-dialog": pulldialog,
  },
  watch: {
    iconType(val) {
      if (val !== "files") {
        this.setPullDialog(false);
      }
    },
  },
  props: {
    repoUrl: String,
    fields: Object,
    listColor: String,
    manifest: Object,
    repoName: String,
    pic: String,
    infoName: String,
    infoChildrenCount: Number,
    infoChildrenName: String,
    iconType: String,
    ownerPic: String,
  },

  data: () => {
    return {
      clipping: false,
    };
  },
  methods: {
    doAuth() {
      this.pickerStuff(this.$store);
    },
    clipText(value) {
      this.clipping = false;
      return navigator.clipboard
        .writeText(value)
        .then(() => (this.clipping = true));
    },
    ...maps.mutations,
    ...maps.actions,
  },
  computed: {
    isAuthorized() {
      return !!this.googleToken && this.isLoggedIn;
    },
    modelPullDialog: {
      get() {
        return this.showPullDialog;
      },
      set(value) {
        this.setPullDialog(value);
      },
    },
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
    ...maps.state,
    ...maps.getters,
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
