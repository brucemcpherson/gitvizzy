<template>
  <v-container>
    <v-overlay :value="making">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div id="tidy-tree" style="width:100%;" v-resize="resize"></div>
    <div v-if="root">
      <div v-if="sv" ref="node-info" style="position:absolute">
        <v-card :color="colors.info" dark>
          <v-toolbar color="secondary">
            <repo-chip :repoName="repoName" :ownerPic="ownerPic" />
            <v-spacer v-if="repoName"></v-spacer>
            <repo-info-chip
              :repoName="repoName"
              :pic="pic"
              :infoName="infoName"
              :infoChildrenCount="infoChildrenCount"
              :infoChildrenName="infoChildrenName"
              :iconType="iconType"
            />
            <v-spacer></v-spacer>
            <icons
              v-if="pinned"
              name="unpin"
              @clicked="pinner()"
              :tip="`unpin ${infoName}`"
            />
            <icons
              v-else
              name="pin"
              @clicked="pinner()"
              :tip="`pin ${infoName}`"
            />
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
              :repoName="repoName"
              :repoUrl="repoUrl"
              :pic="pic"
              :infoName="infoName"
              :infoChildrenCount="infoChildrenCount"
              :infoChildrenName="infoChildrenName"
              :iconType="iconType"
              :ownerPic="ownerPic"
              @pin="pinner(true)"
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
            <div v-else-if="isRoot">Viewing by {{ viewType }}</div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import maps from "@/js/storemaps";

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
import repochip from "@/components/repochip";
import repoinfochip from "@/components/repoinfochip";
import icons from "@/components/icons";
import { delayAnimation } from "@/js/fiddly";

import * as d3 from "d3";

export default {
  components: {
    "repo-chip": repochip,
    "repo-info-chip": repoinfochip,
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
    icons,
  },
  name: "d3chart",
  watch: {
    root: {
      immediate: true,
      handler(val) {
        console.log('handling', val)
        if(val) {
          this.initSvg();
          this.rebuild();
        }
      }
    },
    
  },
  methods: {
    initSvg() {
      if(!this.g) {
        this.makeSvg();

        this.g = this.svg.append("g").attr("font-size", 10);

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
      }
    },
    pinner(force) {
      this.setPinned(this.pinned && !force ? null : this.infoData);
    },
    getPal() {
      const sel = d3.select("#tidy-tree");
      if (sel.node()) {
        return sel.node().getBoundingClientRect();
      }
    },
    getPalWidth() {
      const pal = this.getPal();
      return pal && pal.width;
    },
    resize() {
      const width = this.getPalWidth();
      if (width) this.setWidth(width);
    },
    handleMouseOut(d3This) {
      // nothing to do here that works
      // d3This is the 'this
      const dt = d3.select(d3This);

      // emphasise the node hovered
      dt.style("fill", this.colors.vizText)
        .style("font-weight", "normal")
        .style("font-size", "1em");
    },
    handleMouseClick(d3This, e, n) {
      if (!this.svg && !this.svg.node()) return null;
      // first step is to unpin
      if (this.pinned) this.pinner()
      // then move to the new place
      this.handleMouseOver(d3This, e, n)
      // then repin
      this.pinner()
    },
    handleMouseOver(d3This, e, n) {
      if (!this.svg && !this.svg.node()) return null;

      // mouseover does nothing if pinned
      if (this.pinned) return null;
      const ecx = e.clientX;

      const svgDim = this.svg.node().getBoundingClientRect();

      // this is what will be displayed in the info data
      this.setInfoData(n.data);
      this.setInfoMoused(true);

      // d3This is the 'this
      const dt = d3.select(d3This);

      // emphasise the node hovered
      //const textLength = dt.node().getComputedTextLength();
      //const textAnchor = dt.attr("text-anchor");
      dt.style("fill", this.colors.vizTextHovered)
        .style("font-weight", "bold")
        .style("font-size", "1.5em");

      // let that settle so we can get the dimensions
      // if you do it now then the info fiv wont have been settled
      this.$nextTick(() => {
        // these are the dimensions of the svg area

        const tn = this.$refs["node-info"];
        const s = d3.select(tn);
        const top = e.clientY - svgDim.y;

        if (tn) {
  
          const { width } = tn.getBoundingClientRect();
          s.transition()
            .duration(300)
            .style("left", Math.max(10, ecx - width + 32) + "px")
            .style("top", (top + 20) + "px");
        }
      });
    },
    async rebuild() {
      const svg = this.svg;
      const g = this.g;
      const root = this.root;
      // this is slow - there are thousands of nodes ... how to improve it?
      // see if canvas would be a better option
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

        let node = null;

        await delayAnimation(0, () => {
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

          node = this.node
            .selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", (d) => `translate(${d.y},${d.x})`);
        });

        await delayAnimation(0, () => {
          node
            .append("circle")
            .attr("fill", (d) => {
              return d.children || d.data.childrenCount
                ? this.colors.dotChildren
                : this.colors.dotNoChildren;
            })
            .attr("r", 2);
        });

        // the purpose of these delays is to get some of the dom updated at least
        // as the whole thing looks like it's not doing anything
        const self = this;
        await delayAnimation(0, () => {
          node.selectAll("text").remove();
          node
            .append("text")
            .on("mouseover", function(e, n) {
              self.handleMouseOver(this, e, n);
            })
            .on("mouseout", function(e, n) {
              self.handleMouseOut(this, e, n);
            })
            .on("click",function(e, n) {
              self.handleMouseClick(this, e, n);
            })
            .style("fill", this.colors.vizText)
            .attr("dy", "0.31em")
            .attr("x", (d) => (d.children ? -6 : 6))
            .attr("text-anchor", (d) => (d.children ? "end" : "start"))
            .text((d) => d.data.name);
        });

        await delayAnimation(0, () => {
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
        return (this.infoChildrenCount && "entries") || null;
      }
      const n =
        (this.infoData && this.infoData.childrenType) ||
        (this.infoChildrenCount && this.infoData.children[0].type);

      return n || null;
    },
    infoChildrenCount() {
      // if we're not showing detail, the children will be suppressed, but we still have the count
      return (
        (this.infoData &&
          this.infoData.children &&
          (this.infoData.children.length || this.infoData.childrenCount)) ||
        null
      );
    },
    ownerPic() {
      return (this.infoData && this.infoData.ownerPic) || null;
    },
    pic() {
      return (this.isOwner && this.fields.avatar_url) || null;
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
    repoUrl() {
      return this.infoData && this.infoData.repoUrl;
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
      return this.infoChildrenName === "entries" && !this.isRoot;
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
