<template>
  <div class="players-overview-settings">
    <div class="setting-button" v-on:click.prevent="toggleTagsView()">{{ getTagToggleLabel() }}</div>
    <div class="setting-label">[ toggle tags view ]</div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {Shared} from '@/client/components/overview/Shared';

export default Vue.extend({
  name: 'OverviewSettings',
  methods: {
    toggleTagsView() {
      (this.$root as any).setVisibilityState(
        'tags_concise',
        !(this.$root as any).getVisibilityState('tags_concise'),
      );
    },
    getTagToggleLabel(): string {
      return Shared.isTagsViewConcise(this.$root) ? 'full' : 'concise';
    },
  },
});
</script>
