<template>
  <div class="wf-component wf-component--select-option">
    <div v-if="showtitle === true" class="wf-component-title">{{ $t(playerinput.title) }}</div>
    <warnings-component :warnings="playerinput.warnings"></warnings-component>
    <AppButton v-if="showsave === true" size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
  </div>
</template>

<script setup lang="ts">
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectOptionModel} from '@/common/models/PlayerInputModel';
import {SelectOptionResponse} from '@/common/inputs/InputResponse';
import WarningsComponent from './WarningsComponent.vue';

const props = defineProps<{
  playerinput: SelectOptionModel;
  onsave: (out: SelectOptionResponse) => void;
  showsave?: boolean;
  showtitle?: boolean;
}>();

function saveData() {
  props.onsave({type: 'option'});
}
</script>
