<template>
  <v-autocomplete
    v-model="addOnList"
    :items="items"
    chips
    deletable-chips
    :label="`AddOn types (${(items && items.length) || '-'})`"
    multiple
    small-chips
    dense
    solo
    prepend-inner-icon="mdi-cloud-search"
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
import { getAddOns } from "@/js/d3prep";
export default {
  name: "add-on-filter",
  methods: {
    remove(item) {
      this.addOnList = this.addOnList.filter((f) => f !== item.id);
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
      const ot = getAddOns(this.mf);
      return (ot || []).map((f) => ({
        addOn: f,
        name: f.label,
        id: f.id,
        versionNames: `${f.label} addOns`,
      }));
    },
    addOnList: {
      get() {
        return this.addOnFilter;
      },
      set(value) {
        this.setAddOnFilter(value);
      },
    },
    ...maps.state,
  },
};
</script>
