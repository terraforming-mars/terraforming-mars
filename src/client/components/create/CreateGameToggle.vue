<template>
  <div class="create-game-toggle" :class="{'create-game-toggle--checked': value}">
    <input type="checkbox" :value="value" @input="$emit('input', !value)" :id="inputId">
    <label :for="inputId" style="align-items: center">
      <slot name="prepend" />

      <span style="width: 10px;"></span>

      <span v-i18n>{{ title }}</span>

      <span style="width: 5px;"></span>

      <slot name="append" />
    </label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {type: Boolean, required: true},
    title: {type: String, default: ''},
  },
  data() {
    return {
      inputId: 'i' + String(Math.random()).slice(-8),
    };
  },
});

</script>
<style lang="less">
.create-game-toggle {
  input {
    opacity: 0;
    position: fixed;
    width: 0;
  }
  &--checked {
    label {
      background-color: rgb(199, 199, 199);
      color: black;
    }
  }
}

</style>
