<template>
  <div>
    <v-list :color="listColor" dense>
      <v-list-item>
        <v-list-item-avatar>
          <img :src="fields.avatar_url" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="fields.login"></v-list-item-title>
          <v-list-item-subtitle v-html="fields.name"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.company">
        <v-list-item-icon>
          <icons name="company" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ fields.company }}
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.location">
        <v-list-item-icon>
          <icons name="location" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ fields.location }}
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.email">
        <v-list-item-icon>
          <icons name="email" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ fields.email }}
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.html_url">
        <v-list-item-icon>
          <icons name="github" />
        </v-list-item-icon>
        <v-list-item-content>
          <a :href="fields.html_url" target="_blank">{{ fields.html_url }}</a>
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
