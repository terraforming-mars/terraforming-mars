<template>
  <div>
    <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>
    <label v-for="player in (playerinput.players || [])" :key="player" class="form-radio form-inline">
      <input type="radio" v-model="selectedPlayer" :value="player" >
      <i class="form-icon"></i>
      <span v-if="player === 'NEUTRAL'" >Neutral</span>
      <SelectPlayerRow v-else :player="playerView.players.find((otherPlayer) => otherPlayer.color === player)"/>
    </label>
    <AppButton v-if="showsave === true" size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {ColorWithNeutral} from '@/common/Color';
import {SelectDelegateModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import SelectPlayerRow from '@/client/components/SelectPlayerRow.vue';
import {SelectDelegateResponse} from '@/common/inputs/InputResponse';

interface DataModel {
  selectedPlayer: ColorWithNeutral | undefined;
}

export default defineComponent({
  name: 'SelectDelegate',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
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
    AppButton,
    SelectPlayerRow,
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
