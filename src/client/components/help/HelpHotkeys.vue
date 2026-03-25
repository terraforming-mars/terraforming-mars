<template>
  <div class="help-hotkeys">
    <div class="keys">
      <div v-i18n>Main Board</div>
      <div v-i18n>Players Overview Table</div>
      <div v-i18n>Cards in Hand</div>
      <div v-i18n>Colonies</div>
    </div>
  </div>
  <div class="help-hotkeys-example"></div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'HelpHotkeys',
});
</script>
