<template>
  <div>
    <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>
    <label v-for="player in (playerinput.players || [])" :key="player" class="form-radio form-inline">
      <input type="radio" v-model="selectedPlayer" :value="player" />
      <i class="form-icon"></i>
      <span v-if="player === 'NEUTRAL'" >Neutral</span>
      <select-player-row v-else :player="players.find((otherPlayer) => otherPlayer.color === player)"></select-player-row>
    </label>
    <Button v-if="showsave === true" size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Button from '@/client/components/common/Button.vue';
import {ColorWithNeutral} from '@/common/Color';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import SelectPlayerRow from '@/client/components/SelectPlayerRow.vue';

export default Vue.extend({
  name: 'SelectPartyPlayer',
  props: {
    players: {
      type: Array as () => Array<PublicPlayerModel>,
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
  data() {
    return {
      selectedPlayer: undefined as ColorWithNeutral | undefined,
    };
  },
  components: {
    Button,
    'select-player-row': SelectPlayerRow,
  },
  methods: {
    saveData() {
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
