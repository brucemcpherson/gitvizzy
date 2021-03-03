<template>

  <v-treeview
    v-if="items"
    v-model="tm"
    :items="items"
    selectable
    return-object
    :open.sync="openIds"
  >
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="item.type === 'tree'">
        {{ open ? "mdi-folder-open" : "mdi-folder" }}
      </v-icon>
      <icons v-else :name="getFileIcon(item)" :tip="getFileTip(item)" />
    </template>
    <template v-slot:label="{ item }">
      {{ item.path }}
      <v-btn icon :href="getFileLink(item)" target="_blank"
        ><icons name="open"
      /></v-btn>
    </template>
  </v-treeview>
</template>
<script>
// get the default branch
import { decorator, cacheInit } from "@/js/cache";
import icons from "@/components/icons";
import maps from "@/js/storemaps";

const getExtension = ({ path }) =>
  path.replace(/..*(\..*)/, "$1").replace(/^\./, "");
const getTreeBranch = async (node) => decorator(node.url);
const getTreeRoot = (branch) => getTreeBranch(branch.commit.commit.tree);

const getBranch = async (repoUrl) => {
  // first get the complete repo
  const repo = await decorator(repoUrl);

  // now get that default branch
  const { default_branch, branches_url } = repo;
  const branch = await decorator(
    branches_url.replace("{/branch}", "/" + default_branch)
  );
  return branch;
};
export default {
  props: {
    url: String,
    folder: String,
    infoName: String,
    projectPath: String,
    projectKey: String
  },
  components: {
    icons,
  },
  watch: {
    projectKey: {
      immediate: true,
      handler() {
        this.init();
      },
    },
  },
  computed: {
    tm: {
      get() {
        return this.treeModel;
      },
      set(value) {
        this.setTreeModel(value);
      },
    },
    ...maps.state,
  },
  methods: {
    init() {
      this.setSpinning(true)
      this.populateTree()
        .then(({ pruned, model }) => {
          if (pruned) {
            this.items = pruned.children;
            // If you don't postpone this then we hit a problem
            // the model sets back to empty sometimes
            /// doing it on nexttick appears to avoid it but I dont know why
            // thats all folks
            this.$nextTick(() => {
              this.tm = model;
              this.openIds = [{ id: this.url }];
            });
          } else {
            this.tm = [];
            this.items = [];
            this.openIds = [];
          }
        })
        .catch((error)=> {
          this.setShowError({
            message:'',
            title: 'Failed to decipher tree from github repo',
            error
          })
        })
        .finally(() => (this.setSpinning (false)));
    },
    // tree is a github tree response - and the tree children may contain further trees
    // it goes { tree: {... tree:[]}}
    pruneTree(model, treeBranch, pruned = {}, trackPath = "") {
      // a github tree is noted by the presence of a tree property value
      const treeChildren = (treeBranch && treeBranch.tree) || [];

      // we'll start accepting items only from the project head path onwards
      const accept =
        !this.projectPath ||
        this.projectPath === "/" ||
        trackPath.startsWith(this.projectPath);
      const digFurther =
        accept || this.projectPath.slice(0, trackPath.length) === trackPath;

      // dig further into the tree - it's going to be async
      return digFurther
        ? Promise.all(
            treeChildren.map((t) => {
              const fileDef = this.fixSkip(t);
              // enhance it with extra props
              t.skip = fileDef.skip;
              t.id = t.url;
              t.trackPath = trackPath;
              // if we're including foldernames

              let folderName = trackPath;
              if (this.projectPath && this.projectPath !== "/")
                folderName = folderName.slice(this.projectPath.length);
              if (folderName) folderName += "/";
              t.gasName = (folderName + fileDef.renamer(t.path)).replace(
                /\/+/g,
                "/"
              );
              t.gasType = fileDef.type;

              if (accept) {
                // this is a good one so add it to the pruned children
                if (!pruned.children) pruned.children = [];

                pruned.children.push(t);
                if (!t.skip) model.push(t);
              }
              // if this is itself a tree then we need to recurse
              if (t.type === "tree")
                return getTreeBranch(t).then((tc) => {
                  return this.pruneTree(
                    model,
                    tc,
                    accept ? t : pruned,
                    trackPath + t.path + "/",
                    model
                  );
                });
            })
          )
        : Promise.resolve(null);
    },
    fixSkip(item) {
      const fd = this.getFileDef(item);
      return {
        skip:
          fd.skipDefault ||
          item.path.slice(0, 1) === "." ||
          (fd.name === "json" && item.path !== "appsscript.json"),
        ...fd,
      };
    },

    getFileLink(item) {
      
      const base = this.folder.replace(this.projectPath, "").replace(/\/+$/g,'');
      const flink= (`${base}` +`/${item.trackPath}/${item.path}`.replace(/\/+/g,'/')).replace(/\/+$/g,'');
    
      return flink

    },
    getFileIcon(item) {
      const ic = this.getFileDef(item).name;

      return ic;
    },
    getFileTip(item) {
      const ic = this.getFileDef(item).tip;

      return ic;
    },
    getFileDef(item) {
      const df = this.files[getExtension(item)] || this.unknown;
      return df;
    },
    populateTree() {
      if (!this.url) {
        this.repoData = null;
        this.treeRoot = null;
        return Promise.resolve(null);
      } else {
        // this will pick up the latest github token
        cacheInit(this.$store);
        let pruned = {
          children: [
            {
              id: this.url,
              path: this.projectPath,
              trackPath: "",
              url: this.url,
            },
          ],
        };
        return getBranch(this.url)
          .then((r) => {
            this.repoData = r;
            return getTreeRoot(r);
          })
          .then((r) => {
            this.treeRoot = r;
            const model = [];
            return this.pruneTree(
              model,
              this.treeRoot,
              pruned.children[0]
            ).then(() => ({ pruned, model }));
          });
      }
    },
    getExtension(ob) {
      return getExtension(ob);
    },
    ...maps.mutations,
  },
  data: () => ({
    repoData: null,
    openIds: [],
    items: null,
    unknown: {
      name: "alert",
      tip: "Apps Script can't use this file - will be renamed as HTML",
      type: "HTML",
      skipDefault: true,
      renamer: (path) => path,
      extension: ".html"
    },
    files: {
      html: {
        name: "html",
        type: "HTML",
        tip: "Files for HTMLSERVICE",
        renamer: (path) => path.replace(/\.html$/,""),
        extension: ".html"
      },
      gs: {
        name: "appsscript",
        type: "SERVER_JS",
        tip: "Server side script",
        renamer: (path) => path.replace(/\.gs$/,""),
        extension: ".gs"
      },
      json: {
        name: "json",
        type: "JSON",
        tip: "manifest file",
        renamer: (path) => path.replace(/\.json$/,""),
        extension: ".json"
      },
      js: {
        name: "appsscript",
        type: "SERVER_JS",
        tip: "Server side script - will be renamed as .gs",
        renamer: (path) => path.replace(/\.js$/, ""),
        extension: ".gs"
      },
      ts: {
        name: "typescript",
        type: "HTML",
        tip:
          "Warning: Needs clasp/webpack to convert - will be renamed as .ts.html",
        skipDefault: true,
        renamer: (path) => path,
        extension: ".html"
      },
    },
  }),
};
</script>
