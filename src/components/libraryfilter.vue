<template>
  <v-autocomplete
  
    v-model="libraryList"
    :items="items"
    chips
    deletable-chips
    :label="`Libraries (${items && items.length || '-'})`"
    multiple
    small-chips
    dense
    solo
    prepend-inner-icon="mdi-database-search"
    item-text="name"
    item-value="id"
    clearable
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

export default {
  name: "library-filter",
  methods: {
    remove(item) {
      this.libraryList = this.libraryList.filter((f) => f !== item.id);
    },
    ...maps.actions,
  },
  computed: {
    items() {
      return this.selectLibraries;
    },
    libraryList: {
      get() {
        return this.libraryFilter;
      },
      set(value) {
        this.setLibraryFilter(value);
      },
    },
    ...maps.getters,
    ...maps.state,
  },
};
</script>
