<template>
  <div>
  <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>
  <label v-for="player in (playerinput.players || [])" :key="player" class="form-radio form-inline">
    <input type="radio" v-model="selectedPlayer" :value="player" />
    <i class="form-icon"></i>
    <select-player-row :player="players.find((otherPlayer) => otherPlayer.color === player)"></select-player-row>
  </label>
  <Button v-if="showsave === true" size="big" :onClick="saveData" :title="$t(playerinput.buttonLabel)" />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Button from './common/Button.vue';
import {ColorWithNeutral} from '../Color';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerModel} from '../models/PlayerModel';
import SelectPlayerRow from './SelectPlayerRow.vue';
import {VueModelRadio} from './VueTypes';
import {TranslateMixin} from './TranslateMixin';

export default Vue.extend({
  name: 'SelectPlayer',
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
      selectedPlayer: undefined as VueModelRadio<ColorWithNeutral>,
    };
  },
  components: {
    'select-player-row': SelectPlayerRow,
    Button,
  },
  mixins: [TranslateMixin],
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
});
</script>

<style lang="less" scoped>
</style>
