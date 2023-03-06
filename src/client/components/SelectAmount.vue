<template>
  <div>
    <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>
    <div class="flex">
      <input type="number" class="nes-input" value="playerinput.min" :min="playerinput.min" :max="playerinput.max" v-model="amount" />
      &nbsp;
      <AppButton size="big" type="max" @click="setMaxValue" title="MAX" />
      &nbsp;
      <AppButton v-if="showsave === true" size="big" @click="saveData" :title="playerinput.buttonLabel" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {SelectAmountResponse} from '@/common/inputs/InputResponse';

interface DataModel {
  // Why is amount type string?
  amount: string;
}

export default Vue.extend({
  name: 'SelectAmount',
  components: {
    AppButton,
  },
  props: {
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectAmountResponse) => void,
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
      amount: this.playerinput.maxByDefault ? String(this.playerinput.max) : String(this.playerinput.min),
    };
  },
  methods: {
    saveData() {
      this.onsave({type: 'amount', amount: parseInt(this.amount)});
    },
    setMaxValue() {
      this.amount = String(this.playerinput.max);
    },
  },
});
</script>
