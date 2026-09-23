<template>
  <PopupPanel @close="$emit('close')">
    <template #header>
      <h2 v-i18n>Game options</h2>
      <!-- Both labels share one grid cell so the button is always sized to the wider one. -->
      <button class="btn btn-primary game-options-copy" @click="copy">
        <span :class="{'visibility-hidden': copied}" v-i18n>Copy to Clipboard</span>
        <span :class="{'visibility-hidden': !copied}" v-i18n>Copied!</span>
      </button>
    </template>
    <pre class="game-options-markdown">{{ markdown }}</pre>
  </PopupPanel>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from 'vue';
import PopupPanel from './common/PopupPanel.vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';

const props = defineProps<{
  gameOptions: GameOptionsModel;
}>();

const emit = defineEmits<{
  'close': [];
}>();

const copied = ref(false);
const markdown = computed(() => toMarkdown(props.gameOptions));

// Renders an object as a nested markdown bullet list, one option per line.
function toMarkdown(obj: object, indent = ''): string {
  const lines: Array<string> = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }
    if (Array.isArray(value)) {
      lines.push(`${indent}- ${key}: ${value.length > 0 ? value.join(', ') : 'none'}`);
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${indent}- ${key}:`);
      lines.push(toMarkdown(value, indent + '  '));
    } else {
      lines.push(`${indent}- ${key}: ${value}`);
    }
  }
  return lines.join('\n');
}

function copy() {
  navigator.clipboard.writeText(markdown.value).then(() => {
    copied.value = true;
  });
}

// Registered on window in the capture phase so it runs before any other key handler
// (e.g. the page navigation shortcuts), and stops them from seeing the event.
// Default behavior (Ctrl+C, scrolling) is left alone.
function keylistener(event: KeyboardEvent) {
  event.stopImmediatePropagation();
  if (event.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => window.addEventListener('keydown', keylistener, {capture: true}));
onUnmounted(() => window.removeEventListener('keydown', keylistener, {capture: true}));
</script>

<style scoped>
.game-options-markdown {
  white-space: pre-wrap;
  font-size: 12px;
  user-select: text;
  text-align: left;
}

.game-options-copy {
  margin-right: 80px;
  display: inline-grid;
}

.game-options-copy > span {
  grid-area: 1 / 1;
}
</style>
