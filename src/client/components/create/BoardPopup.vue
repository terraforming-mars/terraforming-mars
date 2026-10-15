<!-- Popup listing every board, from which the player picks one. -->
<template>
  <PopupPanel class="create-game-board-popup" @close="$emit('close')">
    <template #header>
      <h2 v-i18n>Board</h2>
    </template>
    <div class="create-game-board-groups">
      <!-- separate groups for official and fan content -->
      <div v-for="group in groups" :key="group.label" class="create-game-board-group">
        <h3 v-i18n>{{ group.label }}</h3>
        <div v-for="boardName in group.boards" :key="boardName" :class="{'create-game-board-random': isRandomBoard(boardName)}">
          <input type="radio" :value="boardName" name="board" :checked="boardName === board" @change="select(boardName)" :id="boardName+'-checkbox'">
          <label :for="boardName+'-checkbox'" class="expansion-button">
            <span v-if="!isRandomBoard(boardName)" class="create-game-board-hexagon" :class="boardColorClass(boardName)">&#x2B22;</span>
            <span class="capitalized" v-i18n>{{ boardName }}</span>
            <template v-if="boardName === BoardName.AMAZONIS_PLANITIA">&nbsp;<span title="In development">(α)</span></template>
            <template v-if="!isRandomBoard(boardName)">
              &nbsp;<a :href="boardHref(boardName)" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
            </template>
          </label>
        </div>
      </div>
    </div>
    <div class="create-game-board-shuffle">
      <input type="checkbox" :checked="shuffleMap" @change="$emit('update:shuffleMap', ($event.target as HTMLInputElement).checked)" id="shuffleMap-checkbox">
      <label for="shuffleMap-checkbox">
        <span v-i18n>Randomize board tiles</span>&nbsp;<a :href="WIKI_URLS.randomizeBoardTiles" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
      </label>
    </div>
  </PopupPanel>
</template>

<script setup lang="ts">
import PopupPanel from '@/client/components/common/PopupPanel.vue';
import {BoardName} from '@/common/boards/BoardName';
import {RandomBoardOption} from '@/common/boards/RandomBoardOption';
import {BoardNameType} from '@/common/game/NewGameConfig';
import {boardColorClass, isRandomBoard} from '@/client/components/create/boardOptions';
import {WIKI, WIKI_URLS} from '@/client/utils/WikiLinks';

type BoardGroup = {
  label: string,
  boards: ReadonlyArray<BoardNameType>,
};

/** Anchor on the wiki's Maps page for each board. */
const WIKI_ANCHORS: Record<BoardNameType, string> = {
  [BoardName.THARSIS]: 'tharsis',
  [BoardName.HELLAS]: 'hellas',
  [BoardName.ELYSIUM]: 'elysium',
  [BoardName.ARABIA_TERRA]: 'arabia-terra',
  [BoardName.UTOPIA_PLANITIA]: 'utopia-planitia',
  [BoardName.VASTITAS_BOREALIS_NOVA]: 'vastitas-borealis-nova',
  [BoardName.VASTITAS_BOREALIS]: 'vastitas-borealis',
  [BoardName.AMAZONIS]: 'amazonis',
  [BoardName.TERRA_CIMMERIA]: 'terra-cimmeria',
  [BoardName.TERRA_CIMMERIA_NOVA]: 'terra-cimmeria-nova',
  [BoardName.HOLLANDIA]: 'hollandia',
  [BoardName.AMAZONIS_PLANITIA]: 'amazonis-planitia',
  [RandomBoardOption.OFFICIAL]: '',
  [RandomBoardOption.ALL]: '',
};

defineProps<{
  board: BoardNameType;
  /** True when the board's tiles are randomized. */
  shuffleMap: boolean;
}>();

const emit = defineEmits<{
  'update:board': [value: BoardNameType];
  'update:shuffleMap': [value: boolean];
  'close': [];
}>();

const groups: ReadonlyArray<BoardGroup> = [
  {
    label: 'Official',
    boards: [
      BoardName.THARSIS,
      BoardName.HELLAS,
      BoardName.ELYSIUM,
      BoardName.UTOPIA_PLANITIA,
      BoardName.VASTITAS_BOREALIS_NOVA,
      BoardName.TERRA_CIMMERIA_NOVA,
      BoardName.AMAZONIS_PLANITIA,
      RandomBoardOption.OFFICIAL,
    ],
  },
  {
    label: 'Fan-made',
    boards: [
      BoardName.ARABIA_TERRA,
      BoardName.AMAZONIS,
      BoardName.TERRA_CIMMERIA,
      BoardName.VASTITAS_BOREALIS,
      BoardName.HOLLANDIA,
      RandomBoardOption.ALL,
    ],
  },
] as const;

/** The wiki URL describing `boardName`. */
function boardHref(boardName: BoardNameType): string {
  return `${WIKI}/Maps#${WIKI_ANCHORS[boardName]}`;
}

/** Reports `boardName` as the new board and closes the popup. */
function select(boardName: BoardNameType) {
  emit('update:board', boardName);
  emit('close');
}
</script>

<style scoped lang="less">
@import (reference) '../../../styles/variables.less';

// Sized to its two board sections rather than most of the screen.
.create-game-board-popup :deep(.popup-inner) {
  width: auto;
  max-width: 90vw;
  height: auto;
  max-height: 90vh;
}

.create-game-board-groups {
  display: flex;
  flex-flow: row wrap;
  gap: 20px;
}

.create-game-board-group {
  display: flex;
  flex-direction: column;
  border: 1px solid @grey_850;
  border-radius: 8px;
  padding: 10px;

  h3 {
    margin: 0 4px 6px;
  }
}

// Pinned to the bottom so the random options line up across sections.
.create-game-board-random {
  margin-top: auto;
  padding-top: 8px;
}

.create-game-board-shuffle {
  display: flex;
  margin-top: 12px;
}
</style>
