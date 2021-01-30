<template>
  <v-container>
    <div id="tidy-tree" style="width:100%;" v-resize="resize"></div>
    <div v-if="root">
      <div v-if="sv" id="node-info" style="position:absolute">
        <v-card :color="colors.info" dark>
          <v-toolbar color="secondary">
            <v-chip label v-if="repoName" color="accent">
              <v-avatar small v-if="ownerPic"><img :src="ownerPic"/></v-avatar>
              <icons v-else name="repos" />
              <span class="caption ml-2">{{ repoName }}</span>
            </v-chip>
            <v-spacer v-if="repoName"></v-spacer>
            <div :class="`caption${repoName ? ' pl-2' : ''}`">
              <v-avatar small v-if="pic"><img :src="pic"/></v-avatar>
              <icons v-else :name="iconType" />
              <span class="ml-1">{{ infoName }}</span>
              <span class="ml-1" v-if="infoChildrenCount"
                >({{ infoChildrenCount
                }}<span class="ml-1">{{ infoChildrenName }})</span></span
              >
            </div>
          </v-toolbar>
          <v-card-text>
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
            <library-card
              :fields="entry"
              v-else-if="isLibrary"
              :listColor="colors.info"
            />
            <advanced-service-card
              :fields="entry"
              v-else-if="isAdvancedService"
              :listColor="colors.info"
            />
            <data-studio-card
              :fields="entry"
              v-else-if="isDataStudio"
              :listColor="colors.info"
            />
            <oauth-scope-card
              :fields="entry"
              v-else-if="isOauthScope"
              :listColor="colors.info"
            />
            <runtime-version-card
              :fields="entry"
              v-else-if="isRuntimeVersion"
              :listColor="colors.info"
            />
            <time-zone-card
              :fields="entry"
              v-else-if="isTimeZone"
              :listColor="colors.info"
            />
            <webapp-card
              :fields="entry"
              v-else-if="isWebapp"
              :listColor="colors.info"
            />
            <add-on-card
              :fields="entry"
              v-else-if="isAddOn"
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
import librarycard from "@/components/librarycard";
import datastudiocard from "@/components/datastudiocard";
import oauthscopecard from "@/components/oauthscopecard";
import advancedservicecard from "@/components/advancedservicecard";
import manifestparentcard from "@/components/manifestparentcard";
import runtimeversioncard from "@/components/runtimeversioncard";
import timezonecard from "@/components/timezonecard";
import webappcard from "@/components/webappcard";
import addoncard from "@/components/addoncard";
import delay from "delay";
import * as d3 from "d3";

export default {
  components: {
    icons,
    "advanced-service-card": advancedservicecard,
    "owner-card": ownercard,
    "repo-card": repocard,
    "file-card": filecard,
    "manifest-parent-card": manifestparentcard,
    "library-card": librarycard,
    "data-studio-card": datastudiocard,
    "oauth-scope-card": oauthscopecard,
    "runtime-version-card": runtimeversioncard,
    "time-zone-card": timezonecard,
    "webapp-card": webappcard,
    "add-on-card": addoncard,
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

    this.g = this.svg.append("g").attr("font-size", 8);

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
        const adjustLeft = Math.max(
          10,
          Math.min(svgDim.width - width, left - width / 3 - 10)
        );

        s.style("left", left + "px")
          .transition()
          .duration(200)
          .style("left", adjustLeft + "px")
          .style("top", top + 24 + "px");
      });
    },
    rebuild() {
      const svg = this.svg;
      const g = this.g;
      const root = this.root;
      // this is slow - there are thousands of nodes ... how to improve it?
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

        // the purpose of these delays is to get some of the dom updated at least
        // as the whole thing looks like it's not doing anything
        delay(1)
          .then(() => {
            node.selectAll("text").remove();

            node
              .append("text")
              .on("mouseover", this.handleMouseOver)
              .on("mouseout", this.handleMouseOut)
              .attr("dy", "0.31em")
              .attr("x", (d) => (d.children ? -6 : 6))
              .attr("text-anchor", (d) => (d.children ? "end" : "start"))
              .text((d) => d.data.name);

            return delay(1);
          })
          .then(() => {
            node
              .selectAll("text")
              .clone(true)
              .lower()
              .attr("stroke", "white");
            // signal it's all over
            this.setMaking(false);
          });
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
    ownerPic() {
      return this.infoData && this.infoData.ownerPic;
    },
    pic() {
      return this.isOwner && this.fields.avatar_url;
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
    isLibrary() {
      return this.manifestType === "libraries";
    },
    isDataStudio() {
      return this.manifestType === "dataStudio";
    },
    isAdvancedService() {
      return this.manifestType === "advancedServices";
    },
    isOauthScope() {
      return this.manifestType === "oauthScopes";
    },
    isRuntimeVersion() {
      return this.manifestType === "runtimeVersion";
    },
    isTimeZone() {
      return this.manifestType === "timeZone";
    },
    isWebapp() {
      return this.manifestType === "webapp";
    },
    isAddOn() {
      return this.manifestType === "addOns";
    },
    manifest() {
      return (
        this.infoData &&
        this.infoData.manifest &&
        this.infoData.manifest.manifest
      );
    },
    entry() {
      if (!this.isManifestEntry || !this.infoData.entry) return null;
      let e = this.infoData.entry;
      // normalize as some entries are not objects
      if (typeof e !== "object") {
        e = {
          value: e,
        };
      }
      return {
        name: this.infoData.name,
        ...e,
      };
    },
    isManifestEntry() {
      return this.infoData && this.infoData.manifestType;
    },
    manifestType() {
      return this.isManifestEntry && this.infoData.manifestType;
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
