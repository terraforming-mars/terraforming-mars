<!--
  General-purpose checkbox + label toggle used for expansions, card types,
  tags, and resources.
-->
<template>
  <!-- IMPORTANT: the input must immediately precede the label in the DOM.
       CSS in card_list.less and create_game_form.less uses the adjacent-sibling
       selector `input:checked + label` to style the checked state. Inserting any
       element between them will silently break the checked highlight. Wrapping
       this component in a container (e.g. <span>) is fine. -->
  <input
    type="checkbox"
    :name="name"
    :id="computedId"
    :checked="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
  >
  <label :for="computedId" class="toggle-button">
    <slot></slot>
  </label>
</template>

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';

export default defineComponent({
  name: 'ToggleButton',
  emits: ['update:modelValue'],
  props: {
    modelValue: {type: Boolean, required: true},
    name: {type: String, required: true},
    id: {type: String, required: false, default: undefined},
  },
  computed: {
    computedId(): string {
      return this.id ?? `${this.name}-checkbox`;
    },
  },
});
</script>
