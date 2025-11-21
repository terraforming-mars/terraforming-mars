<template>
  <div class="wf-component wf-component--select-option">
    <div v-if="showtitle === true" class="wf-component-title">{{ $t(playerinput.title) }}</div>
    <warnings-component :warnings="playerinput.warnings"></warnings-component>
    <AppButton v-if="showsave === true" size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectOptionModel} from '@/common/models/PlayerInputModel';
import {SelectOptionResponse} from '@/common/inputs/InputResponse';
import WarningsComponent from './WarningsComponent.vue';

export default Vue.extend({
  name: 'select-option',
  props: {
    playerinput: {
      type: Object as () => SelectOptionModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectOptionResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  components: {
    AppButton,
    WarningsComponent,
  },
  methods: {
    saveData() {
      this.onsave({type: 'option'});
    },
  },
});

</script>
