<template>
    <div class="keyboard-shortcuts-container">
  <div class="popup-panel">
    <h2>Keyboard Shortcuts</h2>
      A - Main Board<br/>
      S - Players Overview Table<br/>
      D - Cards in Hand<br/>
      F - Colonies<br/>
      <br/>
      ? - Show this help<br/>
      ESC - close this help<br/>
      <br/>More coming.
    <button class="close-button" @click="onclick">Close</button>
  </div>
</div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'KeyboardShortcuts',
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
  destroyed() {
    window.removeEventListener('keydown', this.keylistener);
  },
  mounted() {
    window.addEventListener('keydown', this.keylistener);
  },

});
</script>
