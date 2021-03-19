<template>
  <v-list-item v-if="tagItems">
    <v-list-item-icon>
      <icons name="tags" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-row cols="12" sm="7" md="8" lg="5" xl="3" no-gutters>
        <v-chip-group column>
          <v-tooltip
            :disabled="!row.tip"
            bottom
            v-for="(row, i) in tags"
            :key="i"
          >
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                <v-chip :color="colors.tagChip">
                  <icons
                    :tip="
                      canClip
                        ? clipping
                          ? `${row.link ? 'copied link' : 'copied info'}`
                          : `${row.link ? 'copy link' : 'copy info'}`
                        : null
                    "
                    :mdi="!!row.icon && row.icon.slice(0, 4) === 'mdi-'"
                    :name="row.icon || 'info'"
                    @clicked="clipText(row.link || row.description)"
                  /><span class="ml-1">
                    <span v-if="row.link">
                      <a :href="row.link" target="_blank">
                        <span class="ml-1">{{ row.description || "tag" }}</span>
                      </a></span
                    ><span v-else class="ml-1">{{
                      row.description || "tag"
                    }}</span>
                  </span>
                </v-chip>
              </span>
            </template>
            <span>{{ row.tip }}</span>
          </v-tooltip>
        </v-chip-group>
      </v-row>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
import icons from "@/components/icons";
import maps from "@/js/storemaps";
export default {
  components: {
    icons,
  },
  props: {
    tags: Array,
  },
  data: () => {
    return {
      clipping: false,
    };
  },
  methods: {
    clipText(value) {
      this.clipping = false;
      return navigator.clipboard
        .writeText(value)
        .then(() => (this.clipping = true));
    },
  },
  computed: {
    tagItems() {
      return (
        this.tags &&
        Array.isArray(this.tags) &&
        this.tags.filter((f) => f.visible)
      );
    },

    canClip() {
      return navigator.clipboard && navigator.clipboard.writeText;
    },
    ...maps.state,
  },
};
</script>
<style scoped>
a:link {
  color: #f5f5f5;
}

a:visited {
  color: #f5f5f5;
}

a:active {
  color: #f5f5f5;
}
a:link {
  color: #f5f5f5;
}
</style>
