<template>
  <div class="admin-home">
    <h1><HomeLink>{{ APP_NAME }}</HomeLink> — Admin</h1>
    <ul>
      <li v-for="path of paths" :key="path">
        <a :href="path + '?serverId=' + serverId">{{path}}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {paths} from '@/common/app/paths';
import {APP_NAME} from '@/common/constants';
import HomeLink from '@/client/components/common/HomeLink.vue';

export default defineComponent({
  name: 'AdminHome',
  components: {
    HomeLink,
  },
  data() {
    return {
      APP_NAME,
      paths: [
        paths.API_STATS,
        paths.GAMES_OVERVIEW,
        paths.API_GAMES,
        paths.API_METRICS,
        paths.LOAD,
        paths.API_IPS,
        paths.API_HEAP_SNAPSHOT,
      ],
    };
  },
  computed: {
    serverId(): string {
      return new URLSearchParams(window.location.search).get('serverId') || '';
    },
  },
});
</script>
