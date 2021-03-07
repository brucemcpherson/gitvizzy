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
        >Select the files to clone to your new apps script project</v-card-title
      >
      <v-card-text class="caption">
        Selected files unsupported by apps script files will be renamed to html.
        Folder names will be preserved.</v-card-text
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

        <span v-if="repoUrl">
          <repo-tree
            :url="repoUrl"
            :folder="folder"
            :project-path="projectPath"
            :project-key="projectKey"
          />
          <v-progress-linear
            v-if="spinning"
            indeterminate
            color="accent"
            rounded
            class="my-2"
          ></v-progress-linear>
        </span>

        <span v-else> No Repo location url available from github</span>
      </v-card-text>
      <v-overlay :value="!modelPermit" absolute> </v-overlay>
      <v-card-text v-if="isReady">
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
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-text v-else
        >You need to select an appsscript.json at a minimum to create a
        project</v-card-text
      >

      <v-card-text class="caption">
        Note: If you get a permission error it's possible the manifest
        references a library to which you don't have access.
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="mx-4 mb-2"
          :disabled="!!createDisabled"
          color="accent"
          @click="create"
          >Create</v-btn
        >

        <v-progress-linear
          v-if="creating"
          class="mx-4 mb-2"
          color="accent"
          indeterminate
          rounded
          height="8"
        ></v-progress-linear>

        <span v-else-if="scriptUrl" class="mx-4 mb-2">
          <icons
            v-if="canClip"
            name="copy"
            :tip="clipping ? 'script Url copied' : 'copy script url'"
            @clicked="clipText(scriptUrl)"
          />
          <icons v-else name="id" />

          <span class="mx-4">
            <span class="mr-2">Created project {{ modelProjectName }}</span>
            <a :href="scriptUrl" target="_blank">
              <span class="mr-2">Open in apps Script IDE</span>
            </a>
            <span v-if="modelContainerBound && pickedId">
              <icons :url="pickedIconUrl" />
              <span class="mx-2">
                <a :href="pickedUrl" target="_blank">{{ pickedName }}</a>
              </span>
            </span>
          </span>
        </span>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { decorator } from "@/js/cache";
import maps from "@/js/storemaps";
import icons from "@/components/icons";
import repoinfochip from "@/components/repoinfochip";
import repochip from "@/components/repochip";
import picker from "@/components/picker";
import repotree from "@/components/repotree";
import { createProject } from "@/js/scrapi";
const initialData = () => {
  return {
    projectName: null,
    modelContainerBound: false,
    modelPermit: true,
    pob: null,
    clipping: false,
    creating: false,
    createdProject: null,
    currentFolder: null,
  };
};
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
    projectPath: String,
  },
  watch: {
    projectKey: {
      immediate: true,
      handler() {
        Object.assign(this.$data, initialData());
      },
    },
  },
  methods: {
    create() {
      this.creating = true;
      this.createdProject = null;
      this.getContents()
        .then((contents) => {
          return createProject({
            title: this.modelProjectName,
            contents,
            parentId: this.modelContainerBound && this.pickedId,
          }).then((response) => {
            this.createdProject = response.result;
          });
        })
        .catch((response) => {
          const error =
            (response && response.result && response.result.error) || error;
          this.setShowError({
            message: "Error while writing to Apps Script API",
            title: "Failed to create project content",
            error,
          });

          console.log("project failed", response);
        })
        .finally(() => (this.creating = false));
    },
    picked(value) {
      this.pob = value;
    },

    clipText(value) {
      this.clipping = false;
      return navigator.clipboard
        .writeText(value)
        .then(() => (this.clipping = true));
    },
    getContents() {
      return Promise.all(
        this.treeModel.map((t) =>
          this.getContent(t).then((content) => ({
            ...t,
            content,
          }))
        )
      );
    },
    getContent(item) {
      return decorator(item.url).then((r) => {
        const buff = new Buffer.from(r.content, "base64");
        const text = buff.toString();
        return text;
      });
    },
    ...maps.mutations,
    ...maps.actions,
  },

  computed: {
    projectKey() {
      return this.url + this.projectPath;
    },
    created() {
      return !!this.createdProject;
    },
    scriptUrl() {
      return this.scriptId
        ? `https://script.google.com/home/projects/${this.scriptId}/edit`
        : null;
    },
    scriptTitle() {
      return this.modelProjectName;
    },
    scriptId() {
      return this.createdProject && this.createdProject.scriptId;
    },
    createDisabled() {
      return (
        !this.isReady ||
        this.creating ||
        (this.modelContainerBound && !this.pickedId)
      );
    },
    isManifestSelected() {
      return (
        this.treeModel &&
        this.treeModel.length &&
        this.treeModel.find((f) => f.path === "appsscript.json")
      );
    },
    isReady() {
      return this.isManifestSelected;
    },
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
        return this.projectName || "scrviz-" + this.repoName;
      },
      set(value) {
        this.projectName = value;
      },
    },
    ...maps.state,
  },
  data: () => initialData(),
};
</script>
