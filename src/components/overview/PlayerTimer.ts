import Vue from 'vue';
import {PlayerModel} from '../../models/PlayerModel';
import {Timer} from '../../Timer';

export const PlayerTimer = Vue.component('player-timer', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
  },
  data() {
    return {
      timer: '',
    };
  },
  mounted() {
    this.updateTimer();
  },
  watch: {
    timer: {
      handler() {
        setTimeout(() => {
          this.updateTimer();
        }, 1000);
      },
    },
  },
  methods: {
    updateTimer: function() {
      this.timer = Timer.fromJSON(this.player.timer).toString();
    },
  },
  template: `
        <div class="player-timer"> {{timer}} </div>
    `,
});
