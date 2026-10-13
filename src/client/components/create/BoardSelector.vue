<!-- Button showing the chosen board, which opens a popup for choosing another. -->
<template>
  <div>
    <input type="checkbox" v-model="showPopup" id="boardSelector-checkbox">
    <label for="boardSelector-checkbox">
      <span v-i18n>Board</span>&nbsp;&nbsp;<span v-if="!isRandomBoard(board)" class="create-game-board-hexagon" :class="boardColorClass(board)">&#x2B22;</span>
      <span class="capitalized" v-i18n>{{ board }}</span>
      <span v-if="shuffleMap" class="create-game-board-shuffled" title="Randomize board tiles">&nbsp;(&#x1F3B2;)</span>
    </label>
    <BoardPopup
      v-if="showPopup"
      :board="board"
      :shuffleMap="shuffleMap"
      @update:board="$emit('update:board', $event)"
      @update:shuffleMap="$emit('update:shuffleMap', $event)"
      @close="showPopup = false"
    />
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import BoardPopup from '@/client/components/create/BoardPopup.vue';
import {BoardNameType} from '@/common/game/NewGameConfig';
import {boardColorClass, isRandomBoard} from '@/client/components/create/boardOptions';

defineProps<{
  board: BoardNameType;
  /** True when the board's tiles are randomized. */
  shuffleMap: boolean;
}>();

defineEmits<{
  'update:board': [value: BoardNameType];
  'update:shuffleMap': [value: boolean];
}>();

const showPopup = ref(false);
</script>
