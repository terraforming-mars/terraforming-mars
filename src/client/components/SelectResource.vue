<template>
  <div class="wf-component wf-options">
    <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
    <div class="form-group">
      <label v-for="included in playerinput.include" :key="included" v-trim-whitespace class="form-inline d-flex align-items-center mb-2">
          <input type="radio" v-model="unit" :value="included" class="form-radio mr-2" />
          <i :data-tooltip="included" :class="'resource_icon mr-2 tooltip tooltip-bottom resource_icon--' + included" />
          {{ $t(included) }}
      </label>
    </div>
    <div v-if="showsave === true" class="nofloat">
        <AppButton @click="saveData" :title="playerinput.buttonLabel" />
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectResourceModel} from '@/common/models/PlayerInputModel';
import {SelectResourceResponse} from '@/common/inputs/InputResponse';
import {PlayerViewModel} from '@/common/models/PlayerModel';

const props = defineProps<{
  playerView: PlayerViewModel;
  playerinput: SelectResourceModel;
  onsave: (out: SelectResourceResponse) => void;
  showsave?: boolean;
  showtitle?: boolean;
}>();

const unit = ref<string | undefined>(undefined);

function canSave() {
  return unit.value !== undefined;
}

function saveData() {
  if (unit.value === undefined) {
    return;
  }
  props.onsave({type: 'resource', resource: unit.value});
}
</script>
