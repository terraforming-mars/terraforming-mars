<template>
  <div class="info_panel">
    <div class="info-panel-title" v-i18n>Game Setup Details</div>
    <GameSetupDetail :gameOptions="gameOptions" :playerNumber="playerNumber" :lastSoloGeneration="lastSoloGeneration"/>

    <div class="info-panel-title" v-i18n>Decks</div>
    <div class="game-setup-detail-container">
      <ul>
        <li v-for="deck in decks" :key="deck.label">
          <div class="setup-item">{{ $t(deck.label) }}</div>
          <span class="game-config generic info-panel-deck-size">🂠{{ deck.sizes.drawPile }} 🗑{{ deck.sizes.discardPile }}</span>
        </li>
      </ul>
    </div>

    <div class="info_panel_actions">
      <button class="btn btn-lg btn-primary" @click="emit('close')" v-i18n>Ok</button>
      <button class="btn btn-lg" @click="gameOptionsPopupOpen = true" v-i18n>More...</button>
    </div>
    <GameOptionsPopup v-if="gameOptionsPopupOpen" :gameOptions="gameOptions" @close="gameOptionsPopupOpen = false" />
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from 'vue';
import GameSetupDetail from '@/client/components/GameSetupDetail.vue';
import GameOptionsPopup from '@/client/components/GameOptionsPopup.vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import {DeckSizeModel, OtherDeckSizesModel} from '@/common/models/GameModel';

const props = defineProps<{
  gameOptions: GameOptionsModel;
  playerNumber: number;
  lastSoloGeneration: number;
  deckSize: number;
  discardPileSize: number;
  otherDeckSizes: OtherDeckSizesModel;
}>();

const emit = defineEmits<{
  'close': [];
}>();

const gameOptionsPopupOpen = ref(false);

const decks = computed(() => {
  const sizes = props.otherDeckSizes;
  const all: Array<{label: string, sizes: DeckSizeModel | undefined}> = [
    {label: 'Projects:', sizes: {drawPile: props.deckSize, discardPile: props.discardPileSize}},
    {label: 'Corporations:', sizes: sizes.corporations},
    {label: 'Preludes:', sizes: sizes.preludes},
    {label: 'CEOs:', sizes: sizes.ceos},
    {label: 'Global Events:', sizes: sizes.globalEvents},
  ];
  return all.filter((deck): deck is {label: string, sizes: DeckSizeModel} => deck.sizes !== undefined);
});

// When the game options popup is open it captures key presses, so Escape closes only the popup.
function keylistener(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => window.addEventListener('keydown', keylistener));
onUnmounted(() => window.removeEventListener('keydown', keylistener));
</script>
