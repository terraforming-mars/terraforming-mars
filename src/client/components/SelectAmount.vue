<script lang="ts">
import Vue from 'vue';
import Button from '@/client/components/common/Button.vue';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';

export default Vue.extend({
  name: 'SelectAmount',
  components: {
    Button,
  },
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
  data() {
    return {
      amount: this.playerinput.maxByDefault ? String(this.playerinput.max) : String(this.playerinput.min),
    };
  },
  methods: {
    saveData() {
      this.onsave([[String(parseInt(this.amount))]]);
    },
    setMaxValue() {
      this.amount = String(this.playerinput.max);
    },
  },
});
</script>
<template>
  <div>
    <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>
    <div class="flex">
      <input type="number" class="nes-input" value="playerinput.min" :min="playerinput.min" :max="playerinput.max" v-model="amount" />
      <Button size="big" type="max" @click="setMaxValue" title="MAX" />
      <Button v-if="showsave === true" size="big" @click="saveData" :title="playerinput.buttonLabel" />
    </div>
  </div>
</template>
