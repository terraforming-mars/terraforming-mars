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

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';
import AppButton from '@/client/components/common/AppButton.vue';
import {ColorWithNeutral} from '@/common/Color';
import {SelectDelegateModel} from '@/common/models/PlayerInputModel';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import SelectPlayerRow from '@/client/components/SelectPlayerRow.vue';
import {SelectDelegateResponse} from '@/common/inputs/InputResponse';

interface DataModel {
  selectedPlayer: ColorWithNeutral | undefined;
}

export default defineComponent({
  name: 'SelectDelegate',
  props: {
    players: {
      type: Array as () => Array<PublicPlayerModel>,
      required: true,
    },
    playerinput: {
      type: Object as () => SelectDelegateModel,
      required: true,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectDelegateResponse) => void,
      required: true,
    },
    showsave: {
      type: Boolean,
      required: true,
    },
    showtitle: {
      type: Boolean,
      default: true,
    },
  },
  data(): DataModel {
    return {
      selectedPlayer: undefined,
    };
  },
  components: {
    AppButton,
    'select-player-row': SelectPlayerRow,
  },
  methods: {
    saveData() {
      if (this.selectedPlayer !== undefined) {
        this.onsave({type: 'delegate', player: this.selectedPlayer});
      }
    },
  },
});
</script>
