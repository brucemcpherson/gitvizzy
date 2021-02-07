<template>
  <span>
    <v-autocomplete
      v-model="ownerList"
      :items="items"
      no-data-text="No more matching owners"
      chips
      deletable-chips
      :label="`Owners (${(items && items.length) || '-'})`"
      multiple
      small-chips
      dense
      solo
      prepend-inner-icon="mdi-account-search"
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
          @click:close="removeOwner(data.item)"
          class="mt-1 mb-1"
          
        >
          <v-avatar left>
            <v-img :src="data.item.avatar_url"></v-img>
          </v-avatar>
          {{ data.item.name }}
        </v-chip>
      </template>
      <template v-slot:item="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-item-content v-text="data.item"></v-list-item-content>
        </template>
        <template v-else>
          <v-list-item-avatar>
            <img :src="data.item.avatar_url" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="data.item.login"></v-list-item-title>
            <v-list-item-subtitle
              v-html="data.item.name"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
  </span>
</template>

<script>
import maps from "@/js/storemaps";

export default {
  name: "owner-filter",
  methods: {
    removeOwner(item) {
      this.ownerList = this.ownerList.filter((f) => f !== item.id);
    },
    ...maps.actions,
  },
  data: ()=> {
    return {
      search: null
    }
  },
  computed: {
    items() {
      return (this.fobOwners || []).map((f) => f.fields);
    },
    ownerList: {
      get() {
        return this.ownerFilter;
      },
      set(value) {
        this.setOwnerFilter(value);
      },
    },
    ...maps.state
  },
};
</script>
