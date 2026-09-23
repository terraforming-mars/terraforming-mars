<template>
  <div class="info_panel">
    <div class="info-panel-title" v-i18n>Game Setup Details</div>
    <GameSetupDetail :gameOptions="gameOptions" :playerNumber="playerNumber" :lastSoloGeneration="lastSoloGeneration"/>

    <div class="info_panel_actions">
      <button class="btn btn-lg btn-primary" @click="emit('close')" v-i18n>Ok</button>
      <button class="btn btn-lg" @click="gameOptionsPopupOpen = true" v-i18n>More...</button>
    </div>
    <GameOptionsPopup v-if="gameOptionsPopupOpen" :gameOptions="gameOptions" @close="gameOptionsPopupOpen = false" />
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import GameSetupDetail from '@/client/components/GameSetupDetail.vue';
import GameOptionsPopup from '@/client/components/GameOptionsPopup.vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';

defineProps<{
  gameOptions: GameOptionsModel;
  playerNumber: number;
  lastSoloGeneration: number;
}>();

const emit = defineEmits<{
  'close': [];
}>();

const gameOptionsPopupOpen = ref(false);

// When the game options popup is open it captures key presses, so Escape closes only the popup.
function keylistener(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => window.addEventListener('keydown', keylistener));
onUnmounted(() => window.removeEventListener('keydown', keylistener));
</script>
