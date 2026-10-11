<template>
  <nav class="player-layout-nav" :aria-label="$t('Game sections')">
    <button v-for="panel in panels" :key="panel.id" type="button"
      :aria-pressed="activePanel === panel.id" :data-test="'layout-' + panel.id"
      @click="$emit('navigate', panel.id)">
      <span aria-hidden="true">{{ panel.icon }}</span>
      <span>{{ $t(panel.title) }}<small v-if="panel.id === 'cards' && cardCount > 0"> {{ cardCount }}</small></span>
    </button>
  </nav>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';

export type PlayerLayoutPanel = 'actions' | 'cards' | 'board' | 'players' | 'log';

const panels: ReadonlyArray<{id: PlayerLayoutPanel; title: string; icon: string}> = [
  {id: 'actions', title: 'Actions', icon: '➤'},
  {id: 'cards', title: 'Cards', icon: '▤'},
  {id: 'board', title: 'Board', icon: '⬡'},
  {id: 'players', title: 'Players', icon: '♟'},
  {id: 'log', title: 'Game log', icon: '≡'},
];

export default defineComponent({
  name: 'ExperimentalPlayerNavigation',
  props: {
    activePanel: {type: String as PropType<PlayerLayoutPanel>, required: true},
    cardCount: {type: Number, required: true},
  },
  emits: ['navigate'],
  computed: {
    panels: () => panels,
  },
});
</script>
