<template>
  <v-autocomplete
    v-model="oauthScopeList"
    :items="items"
    chips
    deletable-chips
    :label="`Oauth scopes (${(items && items.length) || '-'})`"
    multiple
    small-chips
    dense
    solo
    prepend-inner-icon="mdi-shield-search"
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
import { getOauthScopes } from "@/js/d3prep";
export default {
  name: "oauth-scope-filter",
  methods: {
    remove(item) {
      this.oauthScopeList = this.oauthScopeList.filter((f) => f !== item.id);
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
      const ot = getOauthScopes(this.mf);
      return (ot || []).map((f) => ({
        oauthScope: f,
        name: f.label
          .replace("https://www.googleapis.com/auth/", "")
          .replace("https://www.google.com/", ""),
        id: f.id,
        versionNames: f.label,
      }));
    },

    oauthScopeList: {
      get() {
        return this.oauthScopeFilter;
      },
      set(value) {
        this.setOauthScopeFilter(value);
      },
    },
    ...maps.state,
  },
};
</script>
