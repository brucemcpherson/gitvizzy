<template>
  <div>
    <v-list :color="listColor" dense>
      <v-list-item>
        <v-list-item-icon>
          <icons name="libraries" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ fields.name }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <icons v-if="canClip" name="copy" :tip="clipping ? 'id copied' : 'click to copy id'" @clicked="clipText()"/>
          <icons v-else name="id" />
        </v-list-item-icon>
        <v-list-item-content>
          <span>{{ fields.libraryId }}</span>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.userSymbol">
        <v-list-item-icon>
          <icons name="symbol" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ fields.userSymbol }}
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.version">
        <v-list-item-icon>
          <icons name="version" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ fields.version }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
import icons from "@/components/icons";

export default {
  components: {
    icons,
  },
  props: {
    fields: Object,
    listColor: String,
  },
  computed: {
    canClip () {
      return navigator.clipboard && navigator.clipboard.writeText
    }
  },
  data: () => {
    return {
      clipping: false
    }
  },
  methods: {
    clipText () {
      this.clipping = false
      return navigator.clipboard.writeText(this.fields.libraryId).then (()=> this.clipping = true)
    }
  }
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
