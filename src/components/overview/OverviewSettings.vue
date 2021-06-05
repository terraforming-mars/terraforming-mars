<template>
  <div class="players-overview-settings">
            <div class="setting-button" v-on:click.prevent="toggleTagsView()">{{ getTagToggleLabel() }}</div>
            <div class="setting-label">[ toggle tags view ]</div>
        </div>
</template>

<script lang="ts">
import Vue from 'vue';

const isTagsViewConcise = (root: any): boolean => {
  return (root as any).getVisibilityState('tags_concise');
};

export default Vue.extend({
  name: 'OverviewSettings',
  methods: {
    toggleTagsView: function() {
      (this.$root as any).setVisibilityState(
        'tags_concise',
        !(this.$root as any).getVisibilityState('tags_concise'),
      );
    },
    getTagToggleLabel: function(): string {
      return isTagsViewConcise(this.$root) ? 'full' : 'concise';
    },
  },
});
</script>

<style lang="less" scoped>
</style>
