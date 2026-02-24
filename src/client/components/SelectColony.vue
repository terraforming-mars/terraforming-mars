<template>
  <div class="wf-component wf-component--select-card">
    <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
    <label v-for="colony in (playerinput.coloniesModel || [])" class="cardbox" :key="colony.name">
      <input type="radio" v-model="selectedColony" :value="colony.name" />
      <colony :colony="colony"></colony>
    </label>
    <div v-if="showsave === true" class="nofloat">
      <AppButton @click="saveData" :title="playerinput.buttonLabel" :disabled="!canSave()"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import Colony from '@/client/components/colonies/Colony.vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectColonyModel} from '@/common/models/PlayerInputModel';
import {SelectColonyResponse} from '@/common/inputs/InputResponse';
import {ColonyName} from '@/common/colonies/ColonyName';

const props = defineProps<{
  playerinput: SelectColonyModel;
  onsave: (out: SelectColonyResponse) => void;
  showsave?: boolean;
  showtitle?: boolean;
}>();

const selectedColony = ref<ColonyName | undefined>(undefined);

function canSave() {
  return selectedColony.value !== undefined;
}

function saveData() {
  if (selectedColony.value !== undefined) {
    props.onsave({type: 'colony', colonyName: selectedColony.value});
  }
}
</script>
