<template>
  <div class="player-status">
        <div class="player-status-bottom">
          <div :class="getLabelAndTimerClasses()">
            <div :class="getActionStatusClasses()">{{ actionLabel }}</div>
            <div class="player-status-timer" v-if="player.game.gameOptions.showTimers"><player-timer :timer="player.timer"/></div>
          </div>
        </div>
      </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {ActionLabel} from './ActionLabel';
import Button from '../common/Button.vue';
import {PlayerModel} from '../../models/PlayerModel';
import PlayerTimer from './PlayerTimer.vue';

export default Vue.extend({
  name: 'PlayerStatus',
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    activePlayer: {
      type: Object as () => PlayerModel,
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
    Button,
    PlayerTimer,
  },
  methods: {
    getLabelAndTimerClasses: function(): string {
      const classes: Array<string> = [];
      const baseClass = 'player-action-status-container';
      classes.push(baseClass);
      if (!this.player.game.gameOptions.showTimers) {
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

<style lang="less" scoped>
</style>
