<template>
      <div class="player-status">
        <div class="player-status-bottom">
          <div :class="getLabelAndTimerClasses()">
            <div :class="getActionStatusClasses()">{{ actionLabel }}</div>
            <div class="player-status-timer" v-if="showTimers"><player-timer :timer="timer"/></div>
          </div>
        </div>
      </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {ActionLabel} from '@/client/components/overview/ActionLabel';
import PlayerTimer from '@/client/components/overview/PlayerTimer.vue';
import {TimerModel} from '@/common/models/TimerModel';

export default Vue.extend({
  name: 'player-status',
  props: {
    timer: {
      type: Object as () => TimerModel,
    },
    actionLabel: {
      type: String,
    },
    showTimers: {
      type: Boolean,
    },
  },
  components: {
    PlayerTimer,
  },
  methods: {
    getLabelAndTimerClasses(): string {
      const classes: Array<string> = [];
      const baseClass = 'player-action-status-container';
      classes.push(baseClass);
      if (!this.showTimers) {
        classes.push('no-timer');
      }
      if (this.actionLabel === ActionLabel.PASSED) {
        classes.push(`${baseClass}--passed`);
      } else if (this.actionLabel === ActionLabel.ACTIVE || this.actionLabel === ActionLabel.DRAFTING || this.actionLabel === ActionLabel.RESEARCHING) {
        classes.push(`${baseClass}--active`);
      }
      return classes.join(' ');
    },
    getActionStatusClasses(): string {
      const classes: Array<string> = ['player-action-status'];
      if (this.actionLabel === ActionLabel.NONE) {
        classes.push('visibility-hidden');
      }
      return classes.join(' ');
    },
  },
});

</script>

