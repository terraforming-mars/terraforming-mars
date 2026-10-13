<template>
  <div class="popup-outer" @mousedown="onMousedown" @mouseup="onMouseup" @click.self="outerOnClick">
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
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'PopupPanel',
  props: {
    /** True when clicking outside the panel closes it. */
    closeOnOutsideClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      /** True when the latest mouse press started outside the panel. */
      pressedOutside: false,
      /** True when the latest mouse release ended outside the panel. */
      releasedOutside: false,
    };
  },
  methods: {
    onclick() {
      this.$emit('close');
    },
    /** Returns true when `event` happened on the backdrop rather than the panel. */
    isOutside(event: MouseEvent): boolean {
      return event.target === event.currentTarget;
    },
    onMousedown(event: MouseEvent) {
      this.pressedOutside = this.isOutside(event);
    },
    onMouseup(event: MouseEvent) {
      this.releasedOutside = this.isOutside(event);
    },
    outerOnClick() {
      if (this.closeOnOutsideClick && this.pressedOutside && this.releasedOutside) {
        this.onclick();
      }
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
  unmounted() {
    window.removeEventListener('keydown', this.keylistener);
  },
  mounted() {
    window.addEventListener('keydown', this.keylistener);
  },
});
</script>
