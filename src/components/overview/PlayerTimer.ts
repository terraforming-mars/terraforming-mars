import Vue from 'vue';
import {Timer} from '../../Timer';
import {SerializedTimer} from '../../SerializedTimer';

export const PlayerTimer = Vue.component('player-timer', {
  props: {
    timer: {
      type: Object as () => SerializedTimer,
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
    updateTimer: function() {
      this.timerText = Timer.toString(this.timer);
    },
    getHours: function(): string {
      return this.timerText.split(':')[0];
    },
    getMinutes: function(): string {
      return this.timerText.split(':')[1];
    },
    getSeconds: function(): string {
      return this.timerText.split(':')[2];
    },
  },
  template: `
    <div class="player-timer">
      <div class="player-timer-hours time-part">{{ getHours() }}</div>
      <div class="timer-delimiter">:</div>
      <div class="player-timer-minutes time-part">{{ getMinutes() }}</div>
      <div class="timer-delimiter">:</div>
      <div class="player-timer-seconds time-part">{{ getSeconds() }}</div>
    </div>
  `,
});
