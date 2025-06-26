<template>
  <div>
    <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>
    <label v-for="player in (playerinput.players || [])" :key="player" class="form-radio form-inline">
      <input type="radio" v-model="selectedPlayer" :value="player" />
      <i class="form-icon"></i>
      <SelectPlayerRow :player="players.find((otherPlayer) => otherPlayer.color === player)"></SelectPlayerRow>
    </label>
    <AppButton v-if="showsave === true" size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectPlayerModel} from '@/common/models/PlayerInputModel';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import SelectPlayerRow from '@/client/components/SelectPlayerRow.vue';
import {SelectPlayerResponse} from '@/common/inputs/InputResponse';
import {ColorWithNeutral} from '@/common/Color';

type DataModel = {
  selectedPlayer: ColorWithNeutral | undefined;
}

export default Vue.extend({
  name: 'SelectPlayer',
  props: {
    players: {
      type: Array as () => Array<PublicPlayerModel>,
    },
    playerinput: {
      type: Object as () => SelectPlayerModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectPlayerResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data(): DataModel {
    return {
      selectedPlayer: undefined,
    };
  },
  components: {
    SelectPlayerRow,
    AppButton,
  },
  methods: {
    saveData() {
      if (this.selectedPlayer === undefined) {
        return;
      }
      this.onsave({type: 'player', player: this.selectedPlayer});
    },
  },
});

</script>
