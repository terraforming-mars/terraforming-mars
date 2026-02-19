<template>
  <div class="popup-outer">
    <div class="popup-inner">
      <div class="popup-header">
        <slot name="header"></slot>
        <button class="close-button" @click="onclick">Close</button>
      </div>
      <div class="popup-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';

export default defineComponent({
  name: 'PopupPanel',
  methods: {
    onclick() {
      this.$emit('close');
    },
    keylistener(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        this.onclick();
        return;
      }
    },
  },
  computed: {
  },
  destroyed() {
    window.removeEventListener('keydown', this.keylistener);
  },
  mounted() {
    window.addEventListener('keydown', this.keylistener);
  },
});
</script>
