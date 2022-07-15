<template>
  <div class="admin-home">
    <ul>
      <li v-for="path of paths" v-bind:key="path">
        <a :href="path + '?serverId=' + serverId">{{path}}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'admin-home',
  data() {
    return {
      paths: [
        '/api/stats',
        '/games-overview',
        '/api/games',
        '/api/metrics',
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
