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
      const newVal = this.isExpanded() ? '1': '';
      PreferencesManager.saveValue('hide_top_bar', newVal);
      PreferencesManager.preferencesValues.set('hide_top_bar', this.isExpanded());
      this.forceRerender();
    },
    isExpanded(): boolean {
      const val = PreferencesManager.loadValue('hide_top_bar');
      return val !== '1';
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
