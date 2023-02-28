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
<script lang="ts">
import Vue from 'vue';
import Colony from '@/client/components/colonies/Colony.vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {SelectColonyResponse} from '@/common/inputs/InputResponse';
import {ColonyName} from '@/common/colonies/ColonyName';

type DataModel = {
  selectedColony: ColonyName | undefined,
};

export default Vue.extend({
  name: 'SelectColony',
  props: {
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectColonyResponse) => void,
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
      selectedColony: undefined,
    };
  },
  components: {
    'colony': Colony,
    AppButton,
  },
  methods: {
    canSave() {
      return this.selectedColony !== undefined;
    },
    saveData() {
      if (this.selectedColony !== undefined) {
        this.onsave({type: 'colony', colonyName: this.selectedColony});
      }
    },
  },
});
</script>
