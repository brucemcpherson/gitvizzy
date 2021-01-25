<template>
  <v-autocomplete
    v-model="repoList"
    :items="items"
    chips
    deletable-chips
    :label="`Repositories (${(items && items.length) || '-'})`"
    multiple
    small-chips
    dense
    solo
    prepend-inner-icon="mdi-folder-search"
    item-text="name"
    item-value="id"
    clearable
    hide-selected
    :menu-props="{ closeOnClick: true }"
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
        <v-list-item-content>
          <v-list-item-title v-html="data.item.login"></v-list-item-title>
          <v-list-item-subtitle v-html="data.item.name"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
import maps from "@/js/storemaps";
import {getRepos} from '@/js/d3prep'
export default {
  name: "repo-filter",

  methods: {
    remove(item) {
      this.repoList = this.repoList.filter((f) => f !== item.id);
    },
    ...maps.actions,
  },
  data: () => {
    return {
      loading: false,
    };
  },
  computed: {
    items ()  {
      const ot = getRepos({ gd: this.gd });
      return (ot || []).map((f) => f.fields);
    },
    repoList: {
      get() {
        return this.repoFilter;
      },
      set(value) {
        this.setRepoFilter(value);
      },
    },
    ...maps.state,
  },
};
</script>
