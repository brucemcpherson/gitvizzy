<template>
  <v-treeview
    v-model="tree"
    :open="initiallyOpen"
    :items="filteredItems"
    activatable
    item-key="url"
    open-on-click
    selectable
  >
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="item.type === 'tree'">
        {{ open ? "mdi-folder-open" : "mdi-folder" }}
      </v-icon>
      <icons v-else :name="files[getExtension(item)]" />
      {{ item.path }}
    </template>
  </v-treeview>
</template>
<script>
// get the default branch
import { decorator } from "@/js/cache";
import icons from "@/components/icons";

// tree is a github tree response - and the tree children may contain further trees
// it goes { tree: {... tree:[]}}
const dealTree = (treeBranch, result = {}, trackPath = "") => {
  const treeChildren = (treeBranch && treeBranch.tree) || [];
  result.children = [];

  return Promise.all(
    treeChildren.map((t) => {
      result.children.push(t);
      t.trackPath = trackPath;
      if (t.type === "tree") {
        return getTreeBranch(t).then((tc) => {
          dealTree(tc, t, trackPath + t.path + "/");
        });
      }
    })
  ).then(() => {
    result.children.sort((a, b) => {
      if (a.type === b.type) {
        return a.path.toLowerCase() < b.path.toLowerCase()
          ? -1
          : a.path === b.path
          ? 0
          : 1;
      } else {
        return a.type === "blob" ? -1 : 1;
      }
    });
    return result;
  });
};
const getExtension = ({ path }) => path.replace(/.*\./, "");
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
  },
  components: {
    icons,
  },
  watch: {
    url() {
      this.populateTree();
    },
  },
  computed: {
    filteredItems() {
      // start at the path of the item
      //console.log(this.folder, this.treeData.children, this.infoName);
      return this.treeData.children;
    },
  },
  mounted() {
    this.populateTree();
  },
  methods: {
    async populateTree() {
      if (this.url) {
       
        this.repoData = await getBranch(this.url);
        this.treeRoot = await getTreeRoot(this.repoData);
        this.treeData = await dealTree(this.treeRoot);
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
    repoData: null,
    initiallyOpen: ["public"],
    files: {
      html: "html",
      gs: "appsscript",
      json: "json",
    },
    tree: [],
  }),
};
</script>
