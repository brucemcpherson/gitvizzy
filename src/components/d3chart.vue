<template>
  <v-container>
    <div id="tidy-tree"></div>
    <div v-if="root">
      <div v-if="showVizInfo" id="node-info" style="position:absolute">
        <v-card :color="colors.info" dark>
          <v-card-title class="font-weight-bold caption">
            <icons :name="iconType" />
            <span class="ml-1">{{ infoName }}</span>
            <span class="ml-1" v-if="infoChildrenCount"
              >({{ infoChildrenCount
              }}<span class="ml-1">{{ infoChildrenName }})</span></span
            >
          </v-card-title>
          <v-card-text :color="colors.info">
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
import * as d3 from "d3";

export default {
  components: {
    icons,
    "owner-card": ownercard,
    "repo-card": repocard,
    "file-card": filecard,
  },
  name: "d3chart",
  watch: {
    root() {
      this.rebuild();
    },
  },

  mounted() {
    this.makeSvg();

    this.g = this.svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

    this.link = this.g
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    this.node = this.g
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3);
  },
  methods: {
    handleMouseOver(e, n) {
      // these are the dimensions of the svg area
      const svgDim = this.svg.node().getBoundingClientRect();
      const left = e.clientX - svgDim.x;
      const top = e.clientY - svgDim.y;
      this.setInfoMoused(true);
      this.setInfoData(n.data);

      d3.select("#node-info")
        .style("left", left + "px")
        .style("top", top + "px")
        .style("min-width", "160px")
        .transition()
        .duration(400)
        .style("left", Math.max(left - 80, 10) + "px")
        .style("top", top + 24 + "px");
    },
    rebuild() {
      const svg = this.svg;
      const g = this.g;
      const root = this.root;

      if (root) {
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
          .attr("text-anchor", (d) => (d.children ? "end" : "start"))
          .text((d) => d.data.name)
          .clone(true)
          .lower()
          .attr("stroke", "white");
      } else {
        this.setInfoData(null);
      }
    },
    makeSvg() {
      this.setWidth(1000);
      this.svg = d3.select("#tidy-tree").append("svg");
    },
    ...maps.mutations,
    ...maps.getters,
  },
  computed: {
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
        return this.infoData.name;
      } else if (this.isRoot) {
        return "root";
      } else {
        return null;
      }
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
    isManifestEntry() {
      return this.infoData && this.infoData.manifestType;
    },
    fields() {
      if (this.isRepo) return this.infoData.repo && this.infoData.repo.fields;
      if (this.isOwner)
        return this.infoData.owner && this.infoData.owner.fields;
      if (this.isFile)
        return (
          this.infoData.manifest &&
          this.infoData.manifest.file &&
          this.infoData.manifest.file.fields
        );
      return null;
    },
    ...maps.getters,
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
