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
  },
  template: `<div class="player-timer" > {{timerText}} </div>`,
});
