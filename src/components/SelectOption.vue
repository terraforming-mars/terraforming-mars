<template>
  <div class="wf-component wf-component--select-option">
        <div v-if="showtitle === true" class="wf-component-title">{{ $t(playerinput.title) }}</div>
        <Button v-if="showsave === true" size="big" :onClick="saveData" :title="$t(playerinput.buttonLabel)" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Button from '../components/common/Button.vue';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {TranslateMixin} from './TranslateMixin';

export default Vue.extend({
  name: 'SelectOption',
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
    'Button': Button,
  },
  mixins: [TranslateMixin],
  data: function() {
    return {};
  },
  methods: {
    saveData: function() {
      this.onsave([['1']]);
    },
  },
});
</script>

<style lang="less" scoped>
</style>
