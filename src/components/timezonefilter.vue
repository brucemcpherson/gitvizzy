<template>
  <v-autocomplete
    v-model="timeZoneList"
    :items="items"
    chips
    deletable-chips
    :label="`Time zones (${(items && items.length) || '-'})`"
    multiple
    small-chips
    dense
    solo
    prepend-inner-icon="mdi-map-search"
    item-text="name"
    item-value="id"
    clearable
    hide-selected
    :menu-props="{ closeOnClick: true }"
    :search-input.sync="search"
    @change="search = ''"
    
  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.item"
        close
        @click="data.select"
        @click:close="remove(data.item)"
        class="mt-1 mb-1"
      >
        {{ data.item.name }}
      </v-chip>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.name"></v-list-item-title>
          <v-list-item-subtitle
            v-html="data.item.versionNames"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
import maps from "@/js/storemaps";
import { getTimeZones, mapVersions } from "@/js/d3prep";
export default {
  name: "time-zone-filter",
  methods: {
    remove(item) {
      this.timeZoneList = this.timeZoneList.filter((f) => f !== item.id);
    },
    ...maps.actions,
  },
  data: () => {
    return {
      search: null,
    };
  },
  computed: {
    items() {
      return mapVersions(getTimeZones(this.mf));
    },
    timeZoneList: {
      get() {
        return this.timeZoneFilter;
      },
      set(value) {
        this.setTimeZoneFilter(value);
      },
    },
    ...maps.state,
  },
};
</script>
