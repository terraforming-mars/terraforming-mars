<template>
  <div class="wf-component wf-component--select-option">
    <div v-if="showtitle === true" class="wf-component-title">{{ $t(playerinput.title) }}</div>
    <Button v-if="showsave === true" size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Button from '@/client/components/common/Button.vue';
import {PlayerInputModel} from '@/models/PlayerInputModel';

export default Vue.extend({
  name: 'select-option',
  props: {
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: Array<Array<string>>) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  components: {
    Button,
  },
  methods: {
    saveData() {
      this.onsave([['1']]);
    },
  },
});

</script>
