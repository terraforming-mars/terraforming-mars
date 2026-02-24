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

<script setup lang="ts">
import {ref} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectAmountModel} from '@/common/models/PlayerInputModel';
import {SelectAmountResponse} from '@/common/inputs/InputResponse';

const props = defineProps<{
  playerinput: SelectAmountModel;
  onsave: (out: SelectAmountResponse) => void;
  showsave?: boolean;
  showtitle?: boolean;
}>();

const amount = ref<string>(props.playerinput.maxByDefault ? String(props.playerinput.max) : String(props.playerinput.min));

function saveData() {
  props.onsave({type: 'amount', amount: parseInt(amount.value)});
}

function setMaxValue() {
  amount.value = String(props.playerinput.max);
}
</script>
