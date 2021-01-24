<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="flipSidebar"></v-app-bar-nav-icon>
      <v-app-bar-title>Vizzy</v-app-bar-title>
      <v-progress-circular
        indeterminate
        v-if="making"
        :color="colors.spinner"
        class="ml-2"
      ></v-progress-circular>
      <v-chip v-if="cacheAge" color="accent" class="ml-2">
        data from {{ cacheAge }} hrs ago
      </v-chip>

      <v-spacer></v-spacer>
      <icons name="refresh" @clicked="updateRoot" tip="refresh viz" />
      <icons
        :name="vizInfoIcon"
        @clicked="setVizInfo(!vizInfo)"
        :tip="vizInfoTip"
      />
      <icons :name="filterIcon" @clicked="flipFilterPlus" :tip="filterTip" />
      <icons :name="detailIcon" @clicked="flipShowDetail" :tip="detailTip" />
    </v-app-bar>

    <v-navigation-drawer
      app
      floating
      v-model="sidebarMenu"
      :width="$vuetify.breakpoint.mdAndUp ? 512 : 256"
    >
      <v-list dense color="primary" dark>
        <v-list-item>
          <v-list-item-action>
            <icons name="close-left" @clicked="flipSidebar" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <h3 class="font-weight-thin">Filter Menu</h3>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-card-title>
        <icons name="small-tree" />
        <span class="ml-2">Filters</span>
      </v-card-title>

      <v-card-text>
        <owner-filter />
        <v-divider></v-divider>
        <repo-filter />
      </v-card-text>
      <v-card-title>
        <icons @clicked="flipShowDetail" name="big-tree" />
        <span class="ml-2">Manifest filters</span>
      </v-card-title>
      <v-card-text>
        <library-filter />
        <advanced-service-filter />
        <oauth-scope-filter />
        <add-on-filter />
        <runtime-version-filter />
        <webapp-filter />
        <data-studio-filter />
        <time-zone-filter />
      </v-card-text>
    </v-navigation-drawer>
    <v-main>
      <d3-chart />
    </v-main>
  </v-app>
</template>

<script>
import d3chart from "@/components/d3chart";
import ownerfilter from "@/components/ownerfilter";
import libraryfilter from "@/components/libraryfilter";
import oauthscopefilter from "@/components/oauthscopefilter";
import advancedservicefilter from "@/components/advancedservicefilter";
import addonfilter from "@/components/addonfilter";
import runtimeversionfilter from "@/components/runtimeversionfilter";
import repofilter from "@/components/repofilter";
import timezonefilter from "@/components/timezonefilter";
import webappfilter from "@/components/webappfilter";
import datastudiofilter from "@/components/datastudiofilter";
import icons from "@/components/icons";

import maps from "@/js/storemaps";
export default {
  components: {
    "owner-filter": ownerfilter,
    "library-filter": libraryfilter,
    "oauth-scope-filter": oauthscopefilter,
    "advanced-service-filter": advancedservicefilter,
    "add-on-filter": addonfilter,
    "runtime-version-filter": runtimeversionfilter,
    "repo-filter": repofilter,
    "time-zone-filter": timezonefilter,
    "webapp-filter": webappfilter,
    "data-studio-filter": datastudiofilter,
    "d3-chart": d3chart,
    icons: icons,
  },

  computed: {
    vizInfoTip() {
      return this.vizInfo ? "disable viz tips" : "enable viz tips";
    },
    vizInfoIcon() {
      return this.vizInfo ? "viz-info-off" : "viz-info";
    },
    filterTip() {
      return this.filterPlus ? "disable filters" : "enable filters";
    },
    filterIcon() {
      return this.filterPlus ? "filter-off" : "filter-on";
    },
    detailIcon() {
      return this.showDetail ? "small-tree" : "big-tree";
    },
    detailTip() {
      return this.showDetail ? "hide manifest detail" : "show manifest detail";
    },

    cacheAge() {
      return this.cacheTimestamp
        ? `${(
            (new Date().getTime() - this.cacheTimestamp) /
            1000 /
            60 /
            60
          ).toFixed(2)}`
        : "";
    },
    ...maps.state,
  },
  methods: {
    flipSidebar() {
      this.sidebarMenu = !this.sidebarMenu;
    },
    ...maps.actions,
    ...maps.mutations,
  },
  data: () => ({
    sidebarMenu: false,
  }),
};
</script>
