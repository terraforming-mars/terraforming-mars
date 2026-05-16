<template>
    <div class="top-bar-container">
      <div :class="formatCssClass()" :key="componentKey">
        <PlayerInfo v-show="isExpanded()" :player="playerView.thisPlayer" :playerView="playerView" :actionLabel="''" :playerIndex="0" :hideZeroTags="true" :isTopBar="true"/>
        <div class="top-bar-collapser" @click="toggleBar()">
          <img src="assets/arrows_left.png">
        </div>
      </div>
    </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import PlayerInfo from '@/client/components/overview/PlayerInfo.vue';
import {getPreferences, PreferencesManager} from '@/client/utils/PreferencesManager';

export default defineComponent({
  name: 'TopBar',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
      required: true,
    },
  },
  components: {
    PlayerInfo,
  },
  data() {
    return {
      componentKey: 0,
    };
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    toggleBar() {
      PreferencesManager.INSTANCE.set('hide_top_bar', this.isExpanded());
      this.forceRerender();
    },
    isExpanded(): boolean {
      return !getPreferences().hide_top_bar;
    },
    formatCssClass(): string {
      const cssClasses = ['top-bar'];
      if ( ! this.isExpanded()) {
        cssClasses.push('top-bar-collapsed');
      }
      return cssClasses.join(' ');
    },
  },
});
</script>

