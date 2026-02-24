<template>
  <div class="wf-component wf-options">
    <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
    <div class="underground-tokens">
      <label v-for="(token, idx) in playerinput.tokens" :key="idx">
         <!-- disabled="selected.length >= playerinput.count -->
        <input type="checkbox" :name="String(idx)" v-model="selected" :value="idx" />
        <underground-token
          :token="token"
          :key="idx"
          location="tag-count"
          ></underground-token>
          <br>
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
import {SelectClaimedUndergroundTokenModel} from '@/common/models/PlayerInputModel';
import {SelectClaimedUndergroundTokenResponse} from '@/common/inputs/InputResponse';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import UndergroundToken from '@/client/components/underworld/UndergroundToken.vue';

const props = defineProps<{
  playerView: PlayerViewModel;
  playerinput: SelectClaimedUndergroundTokenModel;
  onsave: (out: SelectClaimedUndergroundTokenResponse) => void;
  showsave?: boolean;
  showtitle?: boolean;
}>();

const selected = ref<Array<number>>([]);

function canSave() {
  if (selected.value.length > props.playerinput.max) {
    return false;
  }
  if (selected.value.length < props.playerinput.min) {
    return false;
  }
  return true;
}

function saveData() {
  props.onsave({type: 'claimedUndergroundToken', selected: selected.value.sort()});
}
</script>
