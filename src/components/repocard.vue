<template>
  <div>
    <v-list :color="listColor" dense>
      <v-list-item>
        <v-list-item-icon>
          <icons name="github" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-html="fields.name"></v-list-item-title>
          <v-list-item-subtitle>
            <a :href="fields.html_url" target="_blank">{{
              fields.full_name
            }}</a>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="directLink">
        <v-list-item-icon>
          <icons
            v-if="canClip"
            name="copy"
            :tip="
              clipping ? 'direct scrviz link copied' : 'copy directscrviz link'
            "
            @clicked="clipText(directLink)"
          />
          <icons v-else name="id" />
        </v-list-item-icon>
        <v-list-item-content
          ><span>
            <a :href="directLink" target="_blank">
              <span class="mr-2">Direct scrviz link to this repo</span>
            </a></span
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
import icons from "@/components/icons";
import { directLink } from "@/js/params";

export default {
  components: {
    icons,
  },
  props: {
    fields: Object,
    listColor: String,
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
    canClip() {
      return navigator.clipboard && navigator.clipboard.writeText;
    },
    directLink() {
      //emulate a class for this kind of data to generate a direct link
      return directLink({
        type: "repo",
        item: {
          data: {
            type: "repos",
            repo: {
              fields: this.fields,
            },
          },
        },
      });
    },
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
