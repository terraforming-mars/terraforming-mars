<!-- Button showing the chosen board, which opens a popup for choosing another. -->
<template>
  <div>
    <input type="checkbox" v-model="showPopup" id="boardSelector-checkbox">
    <label for="boardSelector-checkbox">
      <span v-i18n>Board</span>
      <template v-if="boards.length === 1">
        &nbsp;&nbsp;<span class="create-game-board-hexagon" :class="boardColorClass(boards[0])">&#x2B22;</span>
        <span class="capitalized" v-i18n>{{ boards[0] }}</span>
      </template>
      <template v-else>
        &nbsp;Random ({{ boards.length }})
      </template>
      <span v-if="shuffleMap" class="create-game-board-shuffled" title="Randomize board tiles">&nbsp;(&#x1F3B2;)</span>
    </label>
    <BoardPopup
      v-if="showPopup"
      :boards="boards"
      :shuffleMap="shuffleMap"
      @update:boards="$emit('update:boards', $event)"
      @update:shuffleMap="$emit('update:shuffleMap', $event)"
      @close="showPopup = false"
    />
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import BoardPopup from '@/client/components/create/BoardPopup.vue';
import {boardColorClass} from '@/client/components/create/boardOptions';
import {BoardName} from '@/common/boards/BoardName';

defineProps<{
  boards: Array<BoardName>;
  /** True when the board's tiles are randomized. */
  shuffleMap: boolean;
}>();

defineEmits<{
  'update:boards': [value: Array<BoardName>];
  'update:shuffleMap': [value: boolean];
}>();

const showPopup = ref(false);
</script>
