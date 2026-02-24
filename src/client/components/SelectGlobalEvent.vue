<template>
    <div class="wf-component wf-component--select-global-event">
        <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
        <label v-for="globalEventName in playerinput.globalEventNames" :key="globalEventName" class="cardBox">
          <input type="radio" v-model="selected" :value="globalEventName" />
          <GlobalEvent :globalEventName="globalEventName" type="distant"></GlobalEvent>
        </label>
        <div v-if="showsave === true" class="nofloat">
          <AppButton :disabled="selected === undefined" type="submit" @click="saveData" title="OK" />
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import GlobalEvent from '@/client/components/turmoil/GlobalEvent.vue';
import {SelectGlobalEventModel} from '@/common/models/PlayerInputModel';
import {SelectGlobalEventResponse} from '@/common/inputs/InputResponse';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';

const props = withDefaults(defineProps<{
  playerView: PlayerViewModel;
  playerinput: SelectGlobalEventModel;
  onsave: (out: SelectGlobalEventResponse) => void;
  showsave?: boolean;
  showtitle?: boolean;
}>(), {
  showsave: false,
});

const selected = ref<GlobalEventName | undefined>(undefined);

function saveData() {
  if (selected.value === undefined) {
    throw new Error('Select a global event');
  }
  props.onsave({type: 'globalEvent', globalEventName: selected.value});
}
</script>
