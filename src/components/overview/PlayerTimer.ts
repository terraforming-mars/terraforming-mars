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
      timer_text: '',
    };
  },
  mounted() {
    this.updateTimer();
  },
  watch: {
    timer_text: {
      handler() {
        setTimeout(() => {
          this.updateTimer();
        }, 1000);
      },
    },
  },
  methods: {
    updateTimer: function() {
      this.timer_text = Timer.fromJSON(this.timer).toString();
    },
  },
  template: `<div class="player-timer" > {{timer_text}} </div>`,
});
