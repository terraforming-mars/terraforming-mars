
import Vue from 'vue';
import {Button} from '../components/common/Button';
import {ColorWithNeutral} from '../Color';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerModel} from '../models/PlayerModel';
import {SelectPlayerRow} from './SelectPlayerRow';
import {TranslateMixin} from './TranslateMixin';

export const SelectPartyPlayer = Vue.component('select-party-player', {
  props: {
    players: {
      type: Array as () => Array<PlayerModel>,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: Array<Array<string>>) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data: function() {
    return {
      selectedPlayer: undefined as ColorWithNeutral | undefined,
    };
  },
  mixins: [TranslateMixin],
  components: {
    'Button': Button,
    'select-player-row': SelectPlayerRow,
  },
  methods: {
    saveData: function() {
      const result: string[][] = [];
      result.push([]);
      if (this.selectedPlayer !== undefined) {
        result[0].push(this.selectedPlayer);
      }
      this.onsave(result);
    },
  },
  template: `<div>
  <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>
  <label v-for="player in (playerinput.players || [])" :key="player" class="form-radio form-inline">
    <input type="radio" v-model="selectedPlayer" :value="player" />
    <i class="form-icon"></i>
    <span v-if="player === 'NEUTRAL'" >Neutral</span>
    <select-player-row v-else :player="players.find((otherPlayer) => otherPlayer.color === player)"></select-player-row>
  </label>
  <Button v-if="showsave === true" size="big" :onClick="saveData" :title="$t(playerinput.buttonLabel)" />
</div>`,
});

