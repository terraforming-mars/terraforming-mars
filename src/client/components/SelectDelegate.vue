<template>
  <div>
    <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>
    <label v-for="player in (playerinput.players || [])" :key="player" class="form-radio form-inline">
      <input type="radio" v-model="selectedPlayer" :value="player" />
      <i class="form-icon"></i>
      <span v-if="player === 'NEUTRAL'" >Neutral</span>
      <select-player-row v-else :player="players.find((otherPlayer) => otherPlayer.color === player)"></select-player-row>
    </label>
    <AppButton v-if="showsave === true" size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {ColorWithNeutral} from '@/common/Color';
import {SelectDelegateModel} from '@/common/models/PlayerInputModel';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import SelectPlayerRow from '@/client/components/SelectPlayerRow.vue';
import {SelectDelegateResponse} from '@/common/inputs/InputResponse';

const props = defineProps<{
  players: Array<PublicPlayerModel>;
  playerinput: SelectDelegateModel;
  onsave: (out: SelectDelegateResponse) => void;
  showsave?: boolean;
  showtitle?: boolean;
}>();

const selectedPlayer = ref<ColorWithNeutral | undefined>(undefined);

function saveData() {
  if (selectedPlayer.value !== undefined) {
    props.onsave({type: 'delegate', player: selectedPlayer.value});
  }
}
</script>
