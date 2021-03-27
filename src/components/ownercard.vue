<template>
  <div>
    <v-list :color="listColor" dense max-width="600px">
      <v-list-item>
        <v-list-item-avatar>
          <img :src="fields.avatar_url" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ fields.login }}</v-list-item-title>
          <v-list-item-subtitle>{{
            fields.name
          }}</v-list-item-subtitle>
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
        <v-list-item-content>
          <v-list-item-subtitle>
            <span v-html="cleanBio"></span>
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
              <span class="mr-2">Direct scrviz link to this owner</span>
            </a></span
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-for="(row, i) in scrvizRows" :key="i">
        <v-list-item-icon>
          <icons
            :tip="
              canClip
                ? clipping
                  ? `${row.link ? 'copied link' : 'copied info'}`
                  : `${row.link ? 'copy link' : 'copy info'}`
                : null
            "
            :mdi="!!row.icon && row.icon.slice(0,4)==='mdi-'"
            :name="row.icon || 'info'"
            @clicked="clipText(row.link || row.description)"
          />
        </v-list-item-icon>
        <v-list-item-content>
          <v-tooltip :disabled="!row.tip" bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                <span v-if="row.link">
                  <a :href="row.link" target="_blank">
                    <span class="mr-2">{{ row.description || row.link }}</span>
                  </a></span
                ><span v-else
                  >{{row.description|| 'extra scrviz profile info'</span
                >
              </span>
            </template>
            <span>{{ row.tip }}</span>
          </v-tooltip>
        </v-list-item-content>
      </v-list-item>
      <tag-item :tags="tags" />
    </v-list>
  </div>
</template>
<script>
import icons from "@/components/icons";
import tagitem from "@/components/tagitem";
import { directLink } from "@/js/params";
import anchorme from "anchorme";
export default {
  components: {
    icons,
    "tag-item": tagitem,
  },

  props: {
    fields: Object,
    listColor: String,
  },
  computed: {
    canClip() {
      return navigator.clipboard && navigator.clipboard.writeText;
    },
    directLink() {
      //emulate a class for this kind of data to generate a direct link
      return directLink({
        type: "owner",
        item: {
          data: {
            type: "owners",
            owner: {
              fields: this.fields,
            },
          },
        },
      });
    },
    isHireable() {
      return this.fields && this.fields.hireable;
    },
    hireableIcon() {
      return this.isHireable ? "hireable" : "hireable-off";
    },
    hireableText() {
      return this.isHireable ? "Available for hire" : "Not available for hire";
    },
    cleanTwitter() {
      return (
        this.fields &&
        this.fields.twitter_username &&
        this.fields.twitter_username.replace(/^@/, "")
      );
    },
    tags() {
      return this.scrvizOwner && this.scrvizOwner.tags
    },
    scrvizOwner() {
      return this.fields && this.fields.scrviz && this.fields.scrviz.owner
    },
    scrvizRows() {
      return ((this.scrvizOwner && this.scrvizOwner.rows) || []).filter(
        (f) => f.visible
      );
    },
    chunkString(str, length) {
      return str.match(new RegExp(".{1," + length + "}", "g"));
    },
    cleanBio() {
      const bio = this.fields && this.fields.bio;
      if (!bio) return null;
      return anchorme({
        input: bio,
        options: {
          attributes: () => {
            return {
              target: "_blank",
              style: "color: #f5f5f5;",
            };
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
  methods: {
    clipText(value) {
      if (!this.canClip) return null;
      this.clipping = false;
      return navigator.clipboard
        .writeText(value)
        .then(() => (this.clipping = true));
    },
  },
  data: () => {
    return {
      clipping: false,
    };
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
