<template>
  <v-container>
    <div id="tidy-tree" style="width:100%;" v-resize="resize"></div>
    <div v-if="root">
      <div v-if="sv" id="node-info" style="position:absolute">
        <v-card :color="colors.info" dark>
          <div
            class="font-weight-bold caption text-center pt-4 pl-2 pr-2"
            v-if="repoName"
          >
            <v-chip color="secondary" label>
              <icons name="repos" />
              <span class="caption ml-1">{{ repoName }}</span>
            </v-chip>
          </div>

          <v-card-text>
            <icons :name="iconType" />
            <span class="ml-1">{{ infoName }}</span>
            <span class="ml-1" v-if="infoChildrenCount"
              >({{ infoChildrenCount
              }}<span class="ml-1">{{ infoChildrenName }})</span></span
            >

            <owner-card
              :fields="fields"
              v-if="isOwner"
              :listColor="colors.info"
            />
            <repo-card
              :fields="fields"
              v-else-if="isRepo"
              :listColor="colors.info"
            />
            <file-card
              :fields="fields"
              v-else-if="isFile"
              :listColor="colors.info"
              :manifest="manifest"
            />
            <manifest-parent-card
              :fields="fields"
              v-else-if="isManifestParent"
              :listColor="colors.info"
              :manifest="manifestParent"
            />
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import maps from "@/js/storemaps";
import icons from "@/components/icons";
import ownercard from "@/components/ownercard";
import repocard from "@/components/repocard";
import filecard from "@/components/filecard";
import manifestparentcard from "@/components/manifestparentcard";
import * as d3 from "d3";

export default {
  components: {
    icons,
    "owner-card": ownercard,
    "repo-card": repocard,
    "file-card": filecard,
    "manifest-parent-card": manifestparentcard,
  },
  name: "d3chart",
  watch: {
    root() {
      this.rebuild();
    },
  },

  mounted() {
    this.resize();
    this.makeSvg();

    this.g = this.svg
      .append("g")
      .attr("font-size", 8);

    this.link = this.g
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#BDBDBD")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.0);

    this.node = this.g
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3);
  },
  methods: {
    resize() {
      const sel = d3.select("#tidy-tree");
      const b = sel.node().getBoundingClientRect();
      this.setWidth(b.width);
    },
    handleMouseOut() {
      // nothing to do here that works
    },
    handleMouseOver(e, n) {
      // these are the dimensions of the svg area
      this.setInfoMoused(true);
      const svgDim = this.svg.node().getBoundingClientRect();
      const left = e.clientX - svgDim.x;
      const top = e.clientY - svgDim.y;

      this.setInfoData(n.data);
      this.$nextTick(() => {
        const s = d3.select("#node-info");
        const n = s.node();
        const { width } = n.getBoundingClientRect();
        // want to position it so its all on the screen slight left and down
        // it must be at least width from the right border and >0
        s.style("left", left + "px")
          .transition()
          .duration(200)
          .style(
            "left",
            Math.max(
              10,
              Math.min(svgDim.width - width, left - width / 3 - 10)
            ) + "px"
          )
          .style("top", top + 24 + "px");
      });
    },
    rebuild() {
      const svg = this.svg;
      const g = this.g;
      const root = this.root;

      if (root && svg) {
        let x0 = Infinity;
        let x1 = -Infinity;

        // sizes the viz
        root.each((d) => {
          if (d.x > x1) x1 = d.x;
          if (d.x < x0) x0 = d.x;
        });

        svg.attr("viewBox", [0, 0, this.width, x1 - x0 + root.dx * 2]);
        g.attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

        this.link
          .selectAll("path")
          .data(root.links())
          .join("path")
          .attr(
            "d",
            d3
              .linkHorizontal()
              .x((d) => d.y)
              .y((d) => d.x)
          );

        const node = this.node
          .selectAll("g")
          .data(root.descendants())
          .join("g")
          .attr("transform", (d) => `translate(${d.y},${d.x})`);

        node
          .append("circle")
          .attr("fill", (d) => (d.children ? "#555" : "#999"))
          .attr("r", 2.5);

        node.selectAll("text").remove();

        node
          .append("text")
          .on("mouseover", this.handleMouseOver)
          .on("mouseout", this.handleMouseOut)
          .attr("dy", "0.31em")
          .attr("x", (d) => (d.children ? -6 : 6))
          .attr("text-anchor", (d) => (d.children  ? "end" : "start"))
          .text((d) => d.data.name)
          .clone(true)
          .lower()
          .attr("stroke", "white");
      } else {
        this.setInfoData(null);
      }

      d3.select("#node-info")
        .style("left", "0px")
        .style("top", "0px")
        .style("min-width", "160px");
    },
    makeSvg() {
      const sel = d3.select("#tidy-tree");
      this.svg = sel.append("svg");
    },
    ...maps.mutations,
  },
  computed: {
    sv() {
      return this.vizInfo && this.infoData && this.infoMoused;
    },
    infoChildrenName() {
      if (this.isFile) {
        return this.infoChildrenCount && "entries";
      }
      const n =
        (this.infoData && this.infoData.childrenType) ||
        (this.infoChildrenCount && this.infoData.children[0].type);

      return n;
    },
    infoChildrenCount() {
      // if we're not showing detail, the children will be suppressed, but we still have the count
      return (
        this.infoData &&
        this.infoData.children &&
        (this.infoData.children.length || this.infoData.childrenCount)
      );
    },
    infoName() {
      if (this.isRepo) {
        return this.fields.name;
      } else if (this.isOwner) {
        return this.fields.name;
      } else if (this.isFile) {
        return this.infoData.name;
      } else if (this.isManifestParent) {
        return this.type;
      } else if (this.isManifestEntry) {
        return this.infoData && this.infoData.name;
      } else if (this.isRoot) {
        return "root";
      } else {
        return null;
      }
    },
    repoName() {
      return this.infoData && this.infoData.repoName;
    },
    iconType() {
      return this.isManifestEntry ? this.infoData.manifestType : this.type;
    },
    type() {
      return this.infoData && this.infoData.type;
    },
    isRoot() {
      return this.type === "root";
    },
    isRepo() {
      return this.type === "repos";
    },
    isOwner() {
      return this.type === "owners";
    },
    isFile() {
      return this.type === "files";
    },
    isManifestParent() {
      return this.infoChildrenName === "entries";
    },
    manifestParent() {
      return this.isManifestParent && this.infoData && this.infoData.target;
    },
    manifest() {
      return (
        this.infoData &&
        this.infoData.manifest &&
        this.infoData.manifest.manifest
      );
    },
    isManifestEntry() {
      return this.infoData && this.infoData.manifestType;
    },
    fields() {
      if (this.isRepo) return this.infoData.repo && this.infoData.repo.fields;
      if (this.isOwner)
        return this.infoData.owner && this.infoData.owner.fields;

      if (this.isFile) return this.infoData.file && this.infoData.file.fields;
      return null;
    },
    ...maps.state,
  },

  data: () => ({
    svg: null,
    g: null,
    path: null,
    node: null,
  }),
};
</script>
