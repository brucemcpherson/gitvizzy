<template>
  <div>
    <v-list :color="listColor" dense>
      <v-list-item> 
        <v-list-item-icon>
          <v-avatar  v-if="fields.logoUrl" size="24"><img :src="fields.logoUrl"></v-avatar>
          <icons v-else name="advancedServices" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ fields.name }}
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.company">
        <v-list-item-icon>
          <icons name="company" />
        </v-list-item-icon>
        <v-list-item-content>
          <span v-if="fields.companyUrl">
            <a target="_blank" :href="fields.companyUrl">{{
              fields.company
            }}</a> </span
          ><span v-else> {{ fields.company }}</span>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.shortDescription || fields.description">
        <v-list-item-icon>
          <icons name="text" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ fields.shortDescription || fields.description }}
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.supportUrl">
        <v-list-item-icon>
          <icons name="company" />
        </v-list-item-icon>
        <v-list-item-content>
          <a target="_blank" :href="fields.supportUrl">Support Url</a>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.feeType && fields.feeType.length">
        <v-list-item-icon>
          <icons name="fees" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ fields.feeType.join(",") }}
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
