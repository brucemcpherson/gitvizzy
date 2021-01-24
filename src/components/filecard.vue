<template>
  <div>
    <v-list :color="listColor" dense>
      <v-list-item>
        <v-list-item-icon>
          <icons name="github" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{fields.repoFullName}}</v-list-item-title>
          <v-list-item-subtitle>
            <a :href="folder" target="_blank">{{folderLabel}}</a>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <icons name="file" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{fields.repoFullName}}</v-list-item-title>
          <v-list-item-subtitle>
            <a :href="fields.html_url" target="_blank">{{fileLabel}}</a>
          </v-list-item-subtitle>
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
    path () {
      return (`${this.fields.path}`).replace(this.fields.name,"") || "/"
    },

    folder () {
      return this.fields.html_url.replace(this.fields.name,"")
    },

    fileLabel () {
      return 'go to ' + this.fields.path
    },

    folderLabel () {
      return 'go to ' + this.path
    }
  }
};
</script>
<style scoped>
/* unvisited link */
a:link {
  color: #F5F5F5;
}

a:visited {
  color: #F5F5F5;
}

a:active {
  color: #F5F5F5;
}
a:link {
  color: #F5F5F5;
}
</style>
