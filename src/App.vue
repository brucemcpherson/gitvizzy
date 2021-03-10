<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="flipSidebar"></v-app-bar-nav-icon>
      <v-toolbar-title>View vizzy by</v-toolbar-title>
      <v-btn-toggle v-model="viewToggle" mandatory group dark>
        <v-btn v-for="vt in viewToggles" :key="vt"
          ><icons :name="vt" :tip="vt" unmouse
        /></v-btn>
      </v-btn-toggle>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-chip v-on="on" :color="dataColor" class="ml-2 mr-2">
            <span class="mr-1" v-if="leaves">{{ leaves }} nodes</span>
          </v-chip>
        </template>
        <span class="caption">data is {{ cacheAge }} hrs old</span>
      </v-tooltip>

      <icons name="refresh" @clicked="refresh" tip="refresh viz" unmouse />
      <icons
        :name="vizInfoIcon"
        @clicked="flipVizInfo()"
        :tip="vizInfoTip"
        unmouse
      />
      <icons
        :name="filterIcon"
        @clicked="flipFilterPlus"
        :tip="filterTip"
        unmouse
      />
      <icons
        :name="detailIcon"
        @clicked="flipShowDetail"
        :tip="detailTip"
        unmouse
      />


      <span class="ml-2">
        <login-chip />
      </span>
    </v-app-bar>

    <v-navigation-drawer
      app
      floating
      v-model="sidebarMenu"
      :width="$vuetify.breakpoint.mdAndUp ? 400 : 256"
    >
      <v-list dense color="primary" dark>
        <v-list-item>
          <v-list-item-action>
            <icons name="close-left" @clicked="flipSidebar" unmouse />
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
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-switch v-model="hireables" label="Hireable"></v-switch>
        </v-card-actions>
      </v-card-title>

      <v-card-text>
        <owner-filter />
        <v-divider></v-divider>
        <repo-filter />
      </v-card-text>

      <v-card-title>
        <icons @clicked="flipShowDetail" name="big-tree" />
        <span class="ml-2">Manifest filters</span>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-switch v-model="interlocked" label="Interlocked"></v-switch>
        </v-card-actions>
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
        <stats-card v-if="showStats" />
      </v-card-text>
      <v-overlay :value="making">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-navigation-drawer>
    <v-main>
      <d3-chart />
      <error-place />
    </v-main>
  </v-app>
</template>

<script>
import errorplace from "@/components/errorplace"
import statscard from "@/components/statscard";
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
import loginchip from "@/components/loginchip";
import maps from "@/js/storemaps";


export default {
  components: {
    "error-place": errorplace,
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
    "stats-card": statscard,
    "login-chip": loginchip,
    icons,
  },

  computed: {
    viewToggle: {
      get() {
        return this.viewToggles.indexOf(this.viewType);
      },
      set(value) {
        this.setViewType(this.viewToggles[value]);
      },
    },
    hireables: {
      get() {
        return this.hireableOwners;
      },
      set(value) {
        this.setHireableOwners(value);
      },
    },
    interlocked: {
      get() {
        return this.interlockedFilters;
      },
      set(value) {
        this.setInterlockedFilters(value);
      },
    },
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
    viewToggles() {
      return ["owners"].concat(this.vTypes.map((f) => f.name));
    },
    ...maps.state,
    ...maps.getters,
  },
  methods: {
    flipSidebar() {
      this.sidebarMenu = !this.sidebarMenu;
    },
    refresh() {
      // force a fetch ie. no local cache
      this.vizzyInit(true)
    },
    ...maps.actions,
    ...maps.mutations,
  },
  data: () => ({
    sidebarMenu: false,
    showStats: false
  }),
};
</script>
