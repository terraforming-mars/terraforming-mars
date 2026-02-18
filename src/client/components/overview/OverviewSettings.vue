<template>
  <div class="players-overview-settings">
    <div class="setting-button" v-on:click.prevent="toggleTagsView()" v-i18n>{{ getTagToggleLabel() }}</div>
    <div class="setting-label" v-i18n>[ toggle tags view ]</div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import {vueRoot} from '@/client/components/vueRoot';

export default defineComponent({
  name: 'OverviewSettings',
  methods: {
    toggleTagsView() {
      vueRoot(this).setVisibilityState(
        'tags_concise',
        !vueRoot(this).getVisibilityState('tags_concise'),
      );
    },
    getTagToggleLabel(): string {
      return vueRoot(this).componentsVisibility['tags_concise'] ? 'full' : 'concise';
    },
  },
});
</script>
