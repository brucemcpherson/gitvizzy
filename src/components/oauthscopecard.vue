<template>
  <div>
    <v-list :color="listColor" dense>

      <v-list-item>
        <v-list-item-icon>
          <icons v-if="canClip" name="copy" :tip="clipping ? 'scope copied' : 'click to copy scope'" @clicked="clipText()"/>
          <icons v-else name="oauthScopes" />
        </v-list-item-icon>
        <v-list-item-content>
          <span>{{ fields.value }}</span>
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
      return navigator.clipboard.writeText(this.fields.value).then (()=> this.clipping = true)
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
