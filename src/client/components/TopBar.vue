<template>
    <div :class="formatCssClass()" :key="componentKey">
      <PlayerInfo v-show="isExpanded()" :player="playerView.thisPlayer" :playerView="playerView" actionLabel="" :playerIndex="0" :hideZeroTags="true" :isTopBar="true"/>
      <div class="top-bar-collapser" v-on:click="toggleBar()">
        <img src="/assets/arrows_left.png">
      </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import PlayerInfo from '@/client/components/overview/PlayerInfo.vue';
import {getPreferences, PreferencesManager} from '@/client/utils/PreferencesManager';

export default Vue.extend({
  name: 'top-bar',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
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

