<template>
  <div>
    <v-card tile>
      <v-toolbar flat dark color="secondary" dense>
        <icons name="appsscript" />
        <v-toolbar-title class="ml-2"
          >Create Script from
          <repo-chip :repoName="repoName" :ownerPic="ownerPic"/>
          <repo-info-chip
            :repoName="repoName"
            :pic="pic"
            :infoName="infoName"
            :infoChildrenCount="infoChildrenCount"
            :infoChildrenName="infoChildrenName"
            :iconType="iconType"
        /></v-toolbar-title>
        <v-spacer></v-spacer>
        <icons name="github" />
        <icons class="mt-2" name="close" @clicked="flipPullDialog" />
      </v-toolbar>
      <v-card-title>
        Does the license for
        <span class="mx-2">
          <repo-chip
            :repoName="repoName"
            :ownerPic="ownerPic"
            :infoName="infoName"
        /></span>
        permit this usage ?
        <span class="caption ml-2">
          (Visit <a :href="folder" target="_blank">{{ folderLabel }}</a
          >)</span
        >
      </v-card-title>

      <v-card-text>
        <v-switch
          v-model="modelPermit"
          label="I confirm its license permits my use case"
        ></v-switch>
      </v-card-text>
    </v-card>
    <v-divider></v-divider>

    <v-card flat>
      <v-card-title
        >THIS IS STILL UNDER DEVELOPMENT - check back later</v-card-title
      >
      <v-card-text>
        <icons name="github" /><repo-chip
          :repoName="repoName"
          :ownerPic="ownerPic"
        />
        <repo-info-chip
          :repoName="repoName"
          :pic="pic"
          :infoName="infoName"
          :infoChildrenCount="infoChildrenCount"
          :infoChildrenName="infoChildrenName"
          :iconType="iconType"
        />
        <v-card-title>
          Select the files to clone to your project
        </v-card-title>
        <repo-tree v-if="repoUrl" :url="repoUrl" :folder="folder" />

        <span v-else> No Repo location url available from github</span>
      </v-card-text>
      <v-overlay :value="!modelPermit" absolute> </v-overlay>
      <v-card-text>
        <v-form>
          <v-switch
            v-model="modelContainerBound"
            label="Will this be a container bound project ?"
          ></v-switch>
          <picker v-if="modelContainerBound" @picked="picked" />
          <v-card-text v-if="!!pob && modelContainerBound">
            <div class="subtitle-1 pb-2">
              The project will be created in this container
            </div>
            <icons :url="pickedIconUrl" />
            <span class="mx-2">
              <a :href="pickedUrl" target="_blank">{{ pickedName }}</a>
            </span>
            <icons
              v-if="canClip"
              name="copy"
              :tip="clipping ? 'id copied' : 'click to copy id'"
              @clicked="clipText()"
            />
            <icons v-else name="id" />
            <span>{{ pickedId }}</span>
          </v-card-text>
          <v-divider class="mb-4"></v-divider>

          <v-text-field
            v-model="modelProjectName"
            label="Apps Script project name"
            required
            :value="repoName"
          ></v-text-field>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import maps from "@/js/storemaps";
import icons from "@/components/icons";
import repoinfochip from "@/components/repoinfochip";
import repochip from "@/components/repochip";
import picker from "@/components/picker";
import repotree from "@/components/repotree";
export default {
  components: {
    icons,
    "repo-info-chip": repoinfochip,
    "repo-chip": repochip,
    picker,
    "repo-tree": repotree,
  },
  props: {
    repoUrl: String,
    repoName: String,
    pic: String,
    infoName: String,
    infoChildrenCount: Number,
    infoChildrenName: String,
    iconType: String,
    ownerPic: String,
    folder: String,
    folderLabel: String,
  },
  methods: {
    picked(value) {
      this.pob = value;
    },
    clipText() {
      this.clipping = false;
      return navigator.clipboard
        .writeText(this.pickedId)
        .then(() => (this.clipping = true));
    },
    ...maps.mutations,
    ...maps.actions,
  },

  computed: {
    canClip() {
      return navigator.clipboard && navigator.clipboard.writeText;
    },
    pickedId() {
      return this.pob && this.pob.id;
    },
    pickedName() {
      return this.pob && this.pob.name;
    },
    pickedUrl() {
      return this.pob && this.pob.url;
    },
    pickedIconUrl() {
      return this.pob && this.pob.iconUrl;
    },
    modelProjectName: {
      get() {
        return this.projectName || this.repoName;
      },
      set(value) {
        this.projectName = value;
      },
    },
    ...maps.state,
  },
  data: () => {
    return {
      projectName: null,
      modelContainerBound: false,
      modelPermit: true,
      pob: null,
      clipping: false,
    };
  },
};
</script>
