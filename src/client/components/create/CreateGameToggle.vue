<template>
  <div>
    <input type="checkbox" :value="value" @input="$emit('input', !value)" :id="inputId">
    <label :for="inputId">
      <span>
        <slot name="prepend" />
        <span v-i18n>{{ title }}</span>
        <slot name="append" />
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {nanoid} from 'nanoid';

export default Vue.extend({
  props: {
    value: {type: Boolean, required: true},
    title: {type: String, default: ''},
    id: {type: String, default: ''},
  },
  data() {
    return {
      inputId: 'i' + (nanoid(10)),
    };
  },
});

</script>
