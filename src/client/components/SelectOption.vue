<template>
  <div class="wf-component wf-component--select-option">
    <div v-if="showtitle === true" class="wf-component-title">{{ $t(playerinput.title) }}</div>
    <AppButton v-if="showsave === true" size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {SelectOptionResponse} from '@/common/inputs/InputResponse';

export default Vue.extend({
  name: 'select-option',
  props: {
    playerinput: {
      type: Object as () => PlayerInputModel,
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
  },
  methods: {
    saveData() {
      this.onsave({type: 'option'});
    },
  },
});

</script>
