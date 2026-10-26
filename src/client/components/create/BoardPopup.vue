<!-- Popup listing every board, from which the player picks one. -->
<template>
  <PopupPanel class="create-game-board-popup" @close="close">
    <template #header>
      <h2 v-i18n>{{ multiple ? 'Select boards to be randomly chosen' : 'Select a board' }}</h2>
    </template>
    <div class="create-game-board-mode">
      <template v-for="mode in MODES" :key="mode.id">
        <input type="radio" name="boardMode" :value="mode.value" v-model="multiple" :id="mode.id" :disabled="!mode.value && selectedBoards.length > 1">
        <label :for="mode.id" v-i18n>{{ mode.label }}</label>
      </template>
    </div>
    <div class="create-game-board-groups">
      <!-- separate groups for official and fan content -->
      <div v-for="group in groups" :key="group.label" class="create-game-board-group">
        <h3 v-i18n>{{ group.label }}</h3>
        <div class="create-game-board-list">
          <div v-for="boardName in group.boards" :key="boardName">
            <input type="checkbox" :value="boardName" :checked="selectedBoards.includes(boardName)" @change="select(boardName, $event)" :id="boardName+'-checkbox'">
            <label :for="boardName+'-checkbox'" class="expansion-button">
              <span class="create-game-board-hexagon" :class="boardColorClass(boardName)">&#x2B22;</span>
              <span class="capitalized" v-i18n>{{ boardName }}</span>
              <template v-if="boardName === BoardName.AMAZONIS_PLANITIA">&nbsp;<span title="In development">(α)</span></template>
              &nbsp;<a :href="boardHref(boardName)" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
            </label>
          </div>
        </div>
        <button class="create-game-board-button create-game-board-random" @click="randomSelection(group.randomBoards)" v-i18n>{{ group.randomTitle }}</button>
      </div>
    </div>
    <div class="create-game-board-shuffle">
      <input type="checkbox" :checked="shuffleMap" @change="$emit('update:shuffleMap', ($event.target as HTMLInputElement).checked)" id="shuffleMap-checkbox">
      <label for="shuffleMap-checkbox">
        <span v-i18n>Randomize board tiles</span>&nbsp;<a :href="WIKI_URLS.randomizeBoardTiles" class="tooltip" v-i18n data-tooltip="Link opens in a new tab/window" target="_blank">&#9432;</a>
      </label>
      <button class="create-game-board-button create-game-board-clear" @click="clear" v-i18n>Clear</button>
    </div>
  </PopupPanel>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import PopupPanel from '@/client/components/common/PopupPanel.vue';
import {BoardName} from '@/common/boards/BoardName';
import {boardColorClass} from '@/client/components/create/boardOptions';
import {WIKI, WIKI_URLS} from '@/client/utils/WikiLinks';
import {inplaceRemove} from '@/common/utils/utils';

type BoardGroup = {
  label: string;
  boards: ReadonlyArray<BoardName>;
  randomTitle: string;
  /** Boards selected by this group's random button. */
  randomBoards: ReadonlyArray<BoardName>;
};

/** Anchor on the wiki's Maps page for each board. */
const WIKI_ANCHORS: Record<BoardName, string> = {
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
};

const props = defineProps<{
  boards: Array<BoardName>;
  /** True when the board's tiles are randomized. */
  shuffleMap: boolean;
}>();

/** Boards currently checked in the popup. */
const selectedBoards = ref<Array<BoardName>>([...props.boards]);

/** True when several boards may be checked, false when checking a board replaces the selection. */
const multiple = ref(props.boards.length > 1);

const MODES = [
  {value: false, label: 'One', id: 'boardMode-one-radio'},
  {value: true, label: 'Many', id: 'boardMode-many-radio'},
] as const;

/** Boards checked when the popup opened, restored if it closes with none checked. */
const originalBoards: ReadonlyArray<BoardName> = [...props.boards];

const emit = defineEmits<{
  'update:boards': [value: Array<BoardName>];
  'update:shuffleMap': [value: boolean];
  'close': [];
}>();

const OFFICIAL_GROUP_BOARDS = [
  BoardName.THARSIS,
  BoardName.HELLAS,
  BoardName.ELYSIUM,
  BoardName.UTOPIA_PLANITIA,
  BoardName.VASTITAS_BOREALIS_NOVA,
  BoardName.TERRA_CIMMERIA_NOVA,
  BoardName.AMAZONIS_PLANITIA,
] as const;

const FAN_GROUP_BOARDS = [
  BoardName.ARABIA_TERRA,
  BoardName.AMAZONIS,
  BoardName.TERRA_CIMMERIA,
  BoardName.VASTITAS_BOREALIS,
  BoardName.HOLLANDIA,
] as const;

const groups: ReadonlyArray<BoardGroup> = [
  {
    label: 'Official',
    boards: OFFICIAL_GROUP_BOARDS,
    randomTitle: 'Random Official',
    randomBoards: OFFICIAL_GROUP_BOARDS,
  },
  {
    label: 'Fan-made',
    boards: FAN_GROUP_BOARDS,
    randomTitle: 'Random All',
    randomBoards: [...OFFICIAL_GROUP_BOARDS, ...FAN_GROUP_BOARDS],
  },
] as const;

/** The wiki URL describing `boardName`. */
function boardHref(boardName: BoardName): string {
  return `${WIKI}/Maps#${WIKI_ANCHORS[boardName]}`;
}

function select(boardName: BoardName, event: Event) {
  if (!multiple.value) {
    // The checkbox toggled itself, so keep it checked when it was already the only board.
    (event.target as HTMLInputElement).checked = true;
    selectedBoards.value = [boardName];
  } else if (!inplaceRemove(selectedBoards.value, boardName)) {
    selectedBoards.value.push(boardName);
  }
  emit('update:boards', [...selectedBoards.value]);
}

/** Selects every board in a section, so one of them is picked at random. */
function randomSelection(boards: ReadonlyArray<BoardName>) {
  selectedBoards.value = [...boards];
  multiple.value = true;
  emit('update:boards', [...selectedBoards.value]);
}

/** Resets the selection to Tharsis. */
function clear() {
  selectedBoards.value = [BoardName.THARSIS];
  multiple.value = false;
  emit('update:boards', [...selectedBoards.value]);
}

/** Closes the popup, falling back to the original boards, then Tharsis, when none are checked. */
function close() {
  if (selectedBoards.value.length === 0) {
    const boards = originalBoards.length > 0 ? originalBoards : [BoardName.THARSIS];
    emit('update:boards', [...boards]);
  }
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

.create-game-board-mode {
  display: flex;
  margin-bottom: 12px;

  // Dimmed, and without the hover highlight, so it reads as unclickable.
  input:disabled + label,
  input:disabled + label:hover {
    background-color: @grey_850;
    opacity: 0.5;
    cursor: not-allowed;
  }
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

// Grows so the random buttons line up across sections.
.create-game-board-list {
  flex-grow: 1;
}

// Matches PopupPanel's close button.
.create-game-board-button {
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.create-game-board-random {
  margin-top: 8px;
}

.create-game-board-shuffle {
  display: flex;
  align-items: center;
  margin-top: 12px;
}

// Pushed to the far right, away from the shuffle checkbox.
.create-game-board-clear {
  margin-left: auto;
}
</style>
