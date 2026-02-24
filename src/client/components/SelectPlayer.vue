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

<script setup lang="ts">
import {ref} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectPlayerModel} from '@/common/models/PlayerInputModel';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import SelectPlayerRow from '@/client/components/SelectPlayerRow.vue';
import {SelectPlayerResponse} from '@/common/inputs/InputResponse';
import {ColorWithNeutral} from '@/common/Color';

const props = defineProps<{
  players: Array<PublicPlayerModel>;
  playerinput: SelectPlayerModel;
  onsave: (out: SelectPlayerResponse) => void;
  showsave?: boolean;
  showtitle?: boolean;
}>();

const selectedPlayer = ref<ColorWithNeutral | undefined>(undefined);

function saveData() {
  if (selectedPlayer.value === undefined) {
    return;
  }
  props.onsave({type: 'player', player: selectedPlayer.value});
}
</script>
