<template>
      <div class="player-status">
        <div class="player-status-bottom">
          <div :class="getLabelAndTimerClasses()">
            <div :class="getActionStatusClasses()"><span v-i18n>{{ actionLabel }}</span></div>
            <div class="player-status-timer" v-if="showTimer"><player-timer :timer="timer" :live="liveTimer"/></div>
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
      type: String as () => ActionLabel,
    },
    showTimer: {
      type: Boolean,
    },
    liveTimer: {
      type: Boolean,
    },
  },
  components: {
    PlayerTimer,
  },
  methods: {
    getLabelAndTimerClasses(): string {
      const classes = [];
      const baseClass = 'player-action-status-container';
      classes.push(baseClass);
      if (!this.showTimer) {
        classes.push('no-timer');
      }
      if (this.actionLabel === 'passed') {
        classes.push(`${baseClass}--passed`);
      } else if (this.actionLabel === 'active' || this.actionLabel === 'drafting' || this.actionLabel === 'researching') {
        classes.push(`${baseClass}--active`);
      }
      return classes.join(' ');
    },
    getActionStatusClasses(): string {
      const classes: Array<string> = ['player-action-status'];
      if (this.actionLabel === 'none') {
        classes.push('visibility-hidden');
      }
      return classes.join(' ');
    },
  },
});

</script>

