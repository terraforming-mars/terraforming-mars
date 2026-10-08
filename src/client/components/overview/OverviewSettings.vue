<template>
  <div class="players-overview-settings">
    <div class="setting-button" @click.prevent="toggleTagsView()" v-i18n>{{ tagToggleLabel }}</div>
    <div class="setting-label" v-i18n>[ toggle tags view ]</div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {vueRoot} from '@/client/components/vueRoot';

export default defineComponent({
  name: 'OverviewSettings',
  computed: {
    tagToggleLabel(): string {
      return vueRoot(this).componentsVisibility['tags_concise'] ? 'full' : 'concise';
    },
  },
  methods: {
    toggleTagsView() {
      vueRoot(this).setVisibilityState(
        'tags_concise',
        !vueRoot(this).getVisibilityState('tags_concise'),
      );
    },
  },
});
</script>
