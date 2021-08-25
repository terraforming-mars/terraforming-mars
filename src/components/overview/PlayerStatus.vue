<template>
      <div class="player-status">
        <div class="player-status-bottom">
          <div :class="getLabelAndTimerClasses()">
            <div :class="getActionStatusClasses()">{{ actionLabel }}</div>
            <div class="player-status-timer" v-if="playerView.game.gameOptions.showTimers"><player-timer :timer="playerView.thisPlayer.timer"/></div>
          </div>
        </div>
      </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {ActionLabel} from './ActionLabel';
import {mainAppSettings} from '../App';
import {PlayerViewModel} from '../../models/PlayerModel';
import PlayerTimer from './PlayerTimer.vue';

export const hidePlayerData = (root: typeof mainAppSettings.methods, playerIndex: number) => {
  root.setVisibilityState('pinned_player_' + playerIndex, false);
};

export default Vue.extend({
  name: 'player-status',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    firstForGen: {
      type: Boolean,
    },
    actionLabel: {
      type: String,
    },
    playerIndex: {
      type: Number,
    },
  },
  components: {
    PlayerTimer,
  },
  methods: {
    getLabelAndTimerClasses: function(): string {
      const classes: Array<string> = [];
      const baseClass = 'player-action-status-container';
      classes.push(baseClass);
      if (!this.playerView.game.gameOptions.showTimers) {
        classes.push('no-timer');
      }
      if (this.actionLabel === ActionLabel.PASSED) {
        classes.push(`${baseClass}--passed`);
      } else if (this.actionLabel === ActionLabel.ACTIVE || this.actionLabel === ActionLabel.DRAFTING || this.actionLabel === ActionLabel.RESEARCHING) {
        classes.push(`${baseClass}--active`);
      }
      return classes.join(' ');
    },
    getActionStatusClasses: function(): string {
      const classes: Array<string> = ['player-action-status'];
      if (this.actionLabel === ActionLabel.NONE) {
        classes.push('visibility-hidden');
      }
      return classes.join(' ');
    },
  },
});

</script>

