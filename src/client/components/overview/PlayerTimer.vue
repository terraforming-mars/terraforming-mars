<template>
  <div class="player-timer">
    <template v-if="hasHours">
        <div class="player-timer-hours">{{ hours }}</div>
        <div class="timer-delimiter">:</div>
    </template>
    <div class="player-timer-minutes">{{ minutes }}</div>
    <div class="timer-delimiter">:</div>
    <div class="player-timer-seconds">{{ seconds }}</div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Timer} from '@/common/Timer';
import {TimerModel} from '@/common/models/TimerModel';

export default defineComponent({
  name: 'PlayerTimer',
  props: {
    timer: {
      type: Object as () => TimerModel,
      required: true,
    },
    live: {
      type: Boolean,
    },
  },
  data() {
    return {
      timerText: '',
      intervalId: undefined as number | undefined,
    };
  },
  mounted() {
    this.updateTimer();
    this.intervalId = window.setInterval(() => {
      if (this.live) {
        this.updateTimer();
      }
    }, 1000);
  },
  beforeUnmount() {
    window.clearInterval(this.intervalId);
  },
  watch: {
    timer() {
      this.updateTimer();
    },
  },
  computed: {
    hasHours(): number {
      if (this.timerText.split(':').length > 2) {
        return 1;
      }
      return 0;
    },
    hours(): string {
      if (this.hasHours) {
        return this.timerText.split(':')[0];
      }
      return '';
    },
    minutes(): string {
      if (this.hasHours) {
        return this.timerText.split(':')[1];
      }
      return this.timerText.split(':')[0];
    },
    seconds(): string {
      if (this.hasHours) {
        return this.timerText.split(':')[2];
      }
      return this.timerText.split(':')[1];
    },
  },
  methods: {
    updateTimer() {
      this.timerText = Timer.toString(this.timer);
    },
  },
});
</script>
