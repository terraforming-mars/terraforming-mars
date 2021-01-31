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
    hasHours: function() {
      if (this.timerText.split(':').length > 2) {
        return 1;
      }
      return 0;
    },
    getHours: function(): string {
      if (this.hasHours()) {
        return this.timerText.split(':')[0];
      }
      return '';
    },
    getMinutes: function(): string {
      if (this.hasHours()) {
        return this.timerText.split(':')[1];
      }
      return this.timerText.split(':')[0];
    },
    getSeconds: function(): string {
      if (this.hasHours()) {
        return this.timerText.split(':')[2];
      }
      return this.timerText.split(':')[1];
    },
  },
  template: `
    <div class="player-timer">
      <template v-if="hasHours()">
         <div class="player-timer-hours time-part">{{ getHours() }}</div>
         <div class="timer-delimiter">:</div>
      </template>   
      <div class="player-timer-minutes time-part">{{ getMinutes() }}</div>
      <div class="timer-delimiter">:</div>
      <div class="player-timer-seconds time-part">{{ getSeconds() }}</div>
    </div>
  `,
});
