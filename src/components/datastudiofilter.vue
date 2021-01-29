<template>
  <v-autocomplete
    v-model="dataStudioList"
    :items="items"
    chips
    deletable-chips
    :label="`dataStudio names (${(items && items.length) || '-'})`"
    multiple
    small-chips
    dense
    solo
    prepend-inner-icon="mdi-toy-brick-search"
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
import { getDataStudios, mapVersions } from "@/js/d3prep";
export default {
  name: "data-studio-filter",
  methods: {
    remove(item) {
      this.dataStudioList = this.dataStudioList.filter((f) => f !== item.id);
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
      return mapVersions(getDataStudios(this.mf));
    },
    dataStudioList: {
      get() {
        return this.dataStudioFilter;
      },
      set(value) {
        this.setDataStudioFilter(value);
      },
    },
    ...maps.state,
  },
};
</script>
