<template>
  <v-treeview
    v-if="filteredItems"
    v-model="tree"
    :open="initiallyOpen"
    :items="filteredItems"
    activatable
    open-on-click
    selectable
    return-object
  >
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="item.type === 'tree'">
        {{ open ? "mdi-folder-open" : "mdi-folder" }}
      </v-icon>
      <icons v-else :name="getFileIcon(item)" :tip="getFileTip(item)" />
      {{ item.path }} {{ item.skip }}
    </template>
    <template v-slot:label="{ item }">
      <v-btn icon :href="item.url" target="_blank"><icons name="open"/></v-btn>
    </template>
  </v-treeview>
</template>
<script>
// get the default branch
import { decorator, cacheInit } from "@/js/cache";
import icons from "@/components/icons";

// tree is a github tree response - and the tree children may contain further trees
// it goes { tree: {... tree:[]}}
const dealTree = (projectPath, treeBranch, result = {}, trackPath = "") => {
  const treeChildren = (treeBranch && treeBranch.tree) || [];
  // treeChildren is the children retrieved from git hub - the can be other trees or just items
  console.log("ptr", projectPath, trackPath, result);
  const accept = trackPath.startsWith(projectPath);
  return Promise.all(
    treeChildren.map((t) => {
      t.trackPath = trackPath;
      let head = accept ? t : result;
      
      if (accept) {
        console.log("accepting", head);
        if (!result.children) result.children = [];
        result.children.push(t);
        console.log(result.children);
      }
      if (t.type === "tree") {
        return getTreeBranch(t).then((tc) => {
          dealTree(projectPath, tc, head, trackPath + t.path + "/");
        });
      }
    })
  ).then(()=> result);
  
};
const getExtension = ({ path }) => path.replace(/..*\.(.*)/, "$1");
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
  },
  components: {
    icons,
  },
  watch: {
    folder() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.populateTree().then(() => {
        this.tree = [];
        const pruned = this.treeData.children;
        this.filteredItems = this.filterItems(pruned);
        console.log("init", this.filteredItems, this.treeData, this.tree);
        console.log("fi", this.folder, this.infoName);
        // TODO - somehow we can get back dups from github-tree
        // dont know why, but for now, we'll just drop them

        this.filteredItems = this.filteredItems.filter((c, i, a) => {
          const ndx = a.findIndex((f) => f.id === c.id);
          if (ndx !== i) {
            console.log("dropping gittree dup", c, i, ndx, a[ndx]);
          }
          return ndx === i;
        });
      });
    },

    filterItems(children) {
      // walk the tree filtering by clonable types
      if (children) {
        children.forEach((c) => {
          c.id = c.url;
          if (c.children && c.children.length) {
            c.skip = true;
            this.filterItems(c.children);
          }
          const fd = this.getFileDef(c);
          c.skip = fd.skipDefault;
          if (!c.skip) this.tree.push(c);
        });
      }
      return children;
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
    async populateTree() {
      if (this.url) {
        // this will pick up the latest github token
        cacheInit(this.$store);
        console.log(this.url, this.folder, this.projectPath);
        this.repoData = await getBranch(this.url);
        this.treeRoot = await getTreeRoot(this.repoData);
        this.treeData = await dealTree(this.projectPath, this.treeRoot);
      } else {
        this.repoData = null;
        this.treeRoot = null;
        this.treeData - [];
      }
    },
    getExtension(ob) {
      return getExtension(ob);
    },
  },
  data: () => ({
    treeData: [],
    filteredItems: null,
    repoData: null,
    initiallyOpen: ["public"],
    unknown: {
      name: "alert",
      tip: "Apps Script can't use this file - will be renamed as HTML",
      type: "HTML",
      skipDefault: true,
    },
    files: {
      html: {
        name: "html",
        type: "HTML",
        tip: "Files for HTMLSERVICE",
      },
      gs: {
        name: "appsscript",
        type: "SERVER_JS",
        tip: "Server side script",
      },
      json: {
        name: "json",
        type: "JSON",
        tip: "manifest file",
      },
      js: {
        name: "appsscript",
        type: "SERVER_JS",
        tip: "Server side script - will be renamed as .gs",
      },
      ts: {
        name: "typescript",
        type: "HTML",
        tip:
          "Warning: Needs clasp/webpack to convert - will be renamed as .ts.html",
        skipDefault: true,
      },
    },
    tree: [],
  }),
};
</script>
