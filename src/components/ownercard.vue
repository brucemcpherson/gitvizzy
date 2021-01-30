<template>
  <div>
    <v-list :color="listColor" dense>
      <v-list-item>
        <v-list-item-avatar>
          <img :src="fields.avatar_url" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ fields.login }}</v-list-item-title>
          <v-list-item-subtitle>{{ fields.name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <icons :name="hireableIcon" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ hireableText }}
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

      <v-list-item v-if="fields.public_repos">
        <v-list-item-icon>
          <icons name="repos" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ fields.public_repos }}
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.followers">
        <v-list-item-icon>
          <icons name="followers" />
        </v-list-item-icon>
        <v-list-item-content>
          {{ fields.followers }}
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.twitter_username">
        <v-list-item-icon>
          <icons name="twitter" />
        </v-list-item-icon>
        <v-list-item-content>
          <a :href="`https://twitter.com/${cleanTwitter}`" target="_blank"
            >@{{ cleanTwitter }}</a
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.blog">
        <v-list-item-icon>
          <icons name="blog" />
        </v-list-item-icon>
        <v-list-item-content>
          <a :href="fields.blog" target="_blank">{{ fields.blog }}</a>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="fields.bio">
        <v-list-item-icon>
          <icons name="bio" />
        </v-list-item-icon>
        <v-list-item-content v-html="cleanBio"> </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
import icons from "@/components/icons";
import anchorme from "anchorme";
export default {
  components: {
    icons,
  },
  props: {
    fields: Object,
    listColor: String,
  },
  computed: {
    isHireable() {
      return this.fields && this.fields.hireable;
    },
    hireableIcon() {
      return this.isHireable ? "hireable" : "hireable-off";
    },
    hireableText() {
      return this.isHireable
        ? "Available for hire" : "Not available for hire"

    },
    cleanTwitter() {
      return (
        this.fields &&
        this.fields.twitter_username &&
        this.fields.twitter_username.replace(/^@/, "")
      );
    },
    cleanBio() {
      const bio = this.fields && this.fields.bio;
      if (!bio) return null;
      return anchorme({
        input: bio,
        options: {
          attributes: () => {
            return {
              target:"_blank",
              style: "color: #f5f5f5;"
            }
          },
        },
        extensions: [
          {
            test: /\n/gi,
            transform: () => `<br>`,
          },
        ],
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
