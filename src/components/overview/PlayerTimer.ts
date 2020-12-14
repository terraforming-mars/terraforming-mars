import Vue from 'vue';
import {Timer} from '../../Timer';

export const PlayerTimer = Vue.component('player-timer', {
  props: {
    timer: {
      type: Object as () => Timer,
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
      this.timerText = Timer.deserialize(this.timer).toString();
    },
  },
  template: `<div class="player-timer" > {{timerText}} </div>`,
});
