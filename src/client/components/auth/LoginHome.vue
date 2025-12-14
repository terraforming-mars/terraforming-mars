<template>
  <div class="login-home">
    <template v-if="user !== undefined">
      You are {{  user }}
      <a :href="logoutURL">Log out</a>
    </template>
    <template v-else>
      <a :href="loginUrl">
        <img style="width: 87px; height: 24px;" src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6257d23c5fb25be7e0b6e220_Open%20Source%20Projects%20_%20Discord-7.svg">
        Login with Discord</a>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {paths} from '@/common/app/paths';

type Data = {
  user: string | undefined;
};

export default Vue.extend({
  name: 'login-home',
  data(): Data {
    return {
      user: undefined,
    };
  },
  mounted() {
    const url = paths.API_PROFILE;
    fetch(url)
      .then((resp) => {
        if (!resp.ok) {
          console.error('Unexpected server response: ' + resp.statusText);
          return null;
        }
        return resp.json();
      })
      .then((data) => {
        if (!data) return;
        try {
          this.user = data._user.userid;
        } catch (e) {
          console.log('Error processing fetch response: ' + e);
        }
      })
      .catch((err) => {
        alert('Error getting session profile data');
        console.error(err);
      });
  },
  computed: {
    loginUrl(): string {
      const thisUrl = window.location.href;
      const idx = window.location.href.lastIndexOf('/' + paths.LOGIN);
      const url = thisUrl.substring(0, idx) + '/' + paths.AUTH_DISCORD_CALLBACK;
      const encoded = encodeURI(url);
      return 'https://discord.com/oauth2/authorize?client_id=1326283152448163921&response_type=code&scope=identify&redirect_uri=' + encoded;
    },
    logoutURL(): string {
      return paths.API_LOGOUT;
    },
  },
});
</script>
