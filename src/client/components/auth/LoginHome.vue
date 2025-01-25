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
import {statusCode} from '@/common/http/statusCode';

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
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'profile');
    xhr.onerror = () => alert('Error getting session profile data');
    xhr.onload = () => {
      try {
        if (xhr.status === statusCode.ok) {
          this.user = xhr.response._user.userid;
        } else {
          console.error('Unexpected server response: ' + xhr.statusText);
        }
      } catch (e) {
        console.log('Error processing XHR response: ' + e);
      }
    };
    xhr.responseType = 'json';
    xhr.send();
  },
  computed: {
    loginUrl(): string {
      return 'https://discord.com/oauth2/authorize?client_id=1326283152448163921&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fdiscord%2Fcallback&scope=identify';
    },
    logoutURL(): string {
      return paths.API_LOGOUT;
    },
  },
});
</script>
