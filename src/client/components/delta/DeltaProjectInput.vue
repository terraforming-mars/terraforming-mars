<template>
  <div>
    <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>
    <DeltaProjectBoard
      :model="playerinput.deltaProjectModel"
      :playersCount="Object.keys(playerinput.deltaProjectModel.playerPositions).length"
    />
    <div class="flex">
      <input type="number" class="nes-input" :min="playerinput.min" :max="playerinput.max" v-model="amount" />
      &nbsp;
      <AppButton size="big" type="max" @click="setMaxValue" title="MAX" />
      &nbsp;
      <AppButton size="big" @click="saveData" :title="playerinput.buttonLabel" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';
import AppButton from '@/client/components/common/AppButton.vue';
import DeltaProjectBoard from '@/client/components/delta/DeltaProjectBoard.vue';
import {DeltaProjectInputModel} from '@/common/models/PlayerInputModel';
import {DeltaProjectInputResponse} from '@/common/inputs/InputResponse';

export default defineComponent({
  name: 'DeltaProjectInput',
  components: {
    AppButton,
    DeltaProjectBoard,
  },
  props: {
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
      amount: String(this.playerinput.min),
    };
  },
  methods: {
    saveData() {
      this.onsave({type: 'deltaProject', amount: parseInt(this.amount)});
    },
    setMaxValue() {
      this.amount = String(this.playerinput.max);
    },
  },
});
</script>
