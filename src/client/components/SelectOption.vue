<template>
  <div class="wf-component wf-component--select-option">
    <div v-if="showtitle === true" class="wf-component-title">{{ $t(playerinput.title) }}</div>
    <WarningsComponent :warnings="playerinput.warnings"/>
    <AppButton v-if="showsave === true" size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectOptionModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {SelectOptionResponse} from '@/common/inputs/InputResponse';
import WarningsComponent from './WarningsComponent.vue';

export default defineComponent({
  name: 'SelectOption',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
      required: true,
    },
    playerinput: {
      type: Object as () => SelectOptionModel,
      required: true,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectOptionResponse) => void,
      required: true,
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
