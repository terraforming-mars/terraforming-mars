<template>
  <div class="player-timer">
    <template v-if="hasHours()">
        <div class="player-timer-hours time-part">{{ getHours() }}</div>
        <div class="timer-delimiter">:</div>
    </template>
    <div class="player-timer-minutes time-part">{{ getMinutes() }}</div>
    <div class="timer-delimiter">:</div>
    <div class="player-timer-seconds time-part">{{ getSeconds() }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Timer} from '@/Timer';
import {TimerModel} from '@/common/models/TimerModel';

export default Vue.extend({
  name: 'PlayerTimer',
  props: {
    timer: {
      type: Object as () => TimerModel,
    },
  },
  data() {
    return {
      timerText: '',
    };
  },
  mounted() {
    this.updateTimer();
  },
  watch: {
    timerText: {
      handler() {
        setTimeout(() => {
          this.updateTimer();
        }, 1000);
      },
    },
  },
  methods: {
    updateTimer() {
      this.timerText = Timer.toString(this.timer);
    },
    hasHours() {
      if (this.timerText.split(':').length > 2) {
        return 1;
      }
      return 0;
    },
    getHours(): string {
      if (this.hasHours()) {
        return this.timerText.split(':')[0];
      }
      return '';
    },
    getMinutes(): string {
      if (this.hasHours()) {
        return this.timerText.split(':')[1];
      }
      return this.timerText.split(':')[0];
    },
    getSeconds(): string {
      if (this.hasHours()) {
        return this.timerText.split(':')[2];
      }
      return this.timerText.split(':')[1];
    },
  },
});
</script>
