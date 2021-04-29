import Vue from 'vue';
import {PlayerModel} from '../models/PlayerModel';
import {PlayerInfo} from './overview/PlayerInfo';
import {PreferencesManager} from './PreferencesManager';

export const TopBar = Vue.component('top-bar', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
  },
  components: {
    PlayerInfo,
  },
  data: function() {
    return {
      componentKey: 0,
    };
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    toggleBar() {
      PreferencesManager.save('hide_top_bar', this.isExpanded(), true);
      this.forceRerender();
    },
    isExpanded(): boolean {
      return !PreferencesManager.loadBoolean('hide_top_bar');
    },
    formatCssClass(): string {
      const cssClasses = ['top-bar'];
      if ( ! this.isExpanded()) {
        cssClasses.push('top-bar-collapsed');
      }
      return cssClasses.join(' ');
    },
  },
  template: `
    <div :class="formatCssClass()" :key="componentKey">
      <PlayerInfo v-show="isExpanded()" :player="player" :activePlayer="player" actionLabel="" :playerIndex="0" :hideZeroTags="true"/>
      <div class="top-bar-collapser" v-on:click="toggleBar()">
        <img src="/assets/arrows_left.png">
      </div>
    </div>
  `,
});
