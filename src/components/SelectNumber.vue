<template>
  <span>
    <Button type="minus" class="btn btn-primary" @click="delta(-1)" data-test="minus" />
    <!-- TODO(kberg): get rid of style: width; why is this necessary when it's not in SelectHowToPay? -->
    <input type="text" :maxlength="maxlength" class="form-input form-inline payments_input"
      v-bind:value="componentValue"
      @input="$emit('change', parseInt($event.target.value))"
      data-test="textbox"
      style="width: 80px;"
      />
    <Button type="plus" class="btn btn-primary" @click="delta(1)" data-test="plus" />
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import Button from '@/components/common/Button.vue';

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
  components: {
    Button,
  },
  data() {
    return {
      componentValue: this.value,
    };
  },
  methods: {
    delta(direction: number) {
      this.componentValue = Math.min(Math.max(this.componentValue + direction, this.min), this.max);
      this.$emit('change', this.componentValue);
      this.$forceUpdate(); // Use case: Type a 1 in the text box, click the minus button. The model is correct but the text box is not.
    },
  },
});
</script>
