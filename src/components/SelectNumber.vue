<template>
  <span>
    <button class="btn btn-primary" @click="delta(-1)"><i class="icon icon-minus" /></button>
    <input type="text" :maxlength="maxlength" class="form-input form-inline payments_input"
      v-bind:value="componentValue"
      @input="$emit('change', parseInt($event.target.value))"
      />
    <button class="btn btn-primary" @click="delta(1)"><i class="icon icon-plus" /></button>
  </span>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SelectNumber',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Number,
    },
    min: {
      type: Number,
      required: false,
      default: 0,
    },
    max: {
      type: Number,
      required: false,
      default: 99,
    },
    maxlength: {
      type: Number,
      required: false,
      default: 2,
    },
  },
  data() {
    return {
      componentValue: this.value,
    };
  },
  methods: {
    delta(direction: number) {
      this.componentValue = Math.min(Math.max(this.value + direction, this.min), this.max);
      this.$emit('change', this.componentValue);
      this.$forceUpdate(); // Use case: Type a 1 in the text box, click the minus button. The model is correct but the text box is not.
    },
  },
});
</script>
