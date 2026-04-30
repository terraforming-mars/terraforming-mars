<template>
  <div>
    <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>
    <DeltaProjectBoard
      v-if="playerView.game.deltaProject !== undefined"
      :model="playerView.game.deltaProject"
      :playersCount="playerView.players.length"
    />
    <div class="flex">
      <select class="nes-input" v-model.number="amount">
        <option v-for="s in playerinput.validSteps" :key="s" :value="s">{{ s }}</option>
      </select>
      &nbsp;
      <AppButton size="big" type="max" @click="setMaxValue" title="MAX" />
      &nbsp;
      <AppButton size="big" @click="saveData" :title="playerinput.buttonLabel" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import DeltaProjectBoard from '@/client/components/delta/DeltaProjectBoard.vue';
import {DeltaProjectInputModel} from '@/common/models/PlayerInputModel';
import {DeltaProjectInputResponse} from '@/common/inputs/InputResponse';
import {PlayerViewModel} from '@/common/models/PlayerModel';

export default defineComponent({
  name: 'DeltaProjectInput',
  components: {
    AppButton,
    DeltaProjectBoard,
  },
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
      required: true,
    },
    playerinput: {
      type: Object as () => DeltaProjectInputModel,
      required: true,
    },
    onsave: {
      type: Function as unknown as () => (out: DeltaProjectInputResponse) => void,
      required: true,
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
      amount: this.playerinput.validSteps[0] ?? 1,
    };
  },
  methods: {
    saveData() {
      this.onsave({type: 'deltaProject', amount: this.amount});
    },
    setMaxValue() {
      const steps = this.playerinput.validSteps;
      this.amount = steps[steps.length - 1] ?? 1;
    },
  },
});
</script>
