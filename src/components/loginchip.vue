<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-avatar left v-on="on" v-bind="attrs" @click.stop = "handleSigning">
        <v-img v-if="userImage && isLoggedIn" :src="userImage"></v-img>
        <v-icon v-else-if="isLoggedIn">mdi-person</v-icon>
        <icons v-else name="login" unmouse />
      </v-avatar>
   
    </template>
    <span v-if="isLoggedIn">{{ userName }} - click to sign out</span><span v-else>click to sign in</span>
  </v-tooltip>
</template>
<script>
import maps from "@/js/storemaps";
import icons from "@/components/icons";

export default {
  components: {
    icons
  },
  methods: {
    handleSigning () {
      if (this.isLoggedIn) {
        this.signout()
      } else {
        this.signin()
      }
    },
    ...maps.actions
  },
  computed: {
    ...maps.state,
    ...maps.getters,
  },
};
</script>
