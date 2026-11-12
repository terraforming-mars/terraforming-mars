<!-- One of the milestones and awards popup's lists, with a checkbox for each milestone or award. -->
<template>
  <div class="create-game-ma-checklist">
    <div class="create-game-ma-heading">
      <span v-i18n>{{ heading }}</span>&nbsp;({{ selected.length }}/{{ limit }})
    </div>
    <div v-for="goal in items" :key="goal.name" v-show="matchesFilter(goal)" class="create-game-ma-item">
      <label class="form-checkbox">
        <input type="checkbox" :value="goal.name" v-model="selected" :disabled="isFull && !selected.includes(goal.name)">
        <i class="form-icon"></i>
        <span class="create-game-ma-name">
          <span v-i18n>{{ label(goal.name) }}</span><template v-if="number(goal.name)">&nbsp;({{ number(goal.name) }})</template>
          <div v-if="goal.expansion" :class="iconClass(goal.expansion)"></div>
        </span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends MilestoneName | AwardName">
import {computed} from 'vue';
import {Expansion} from '@/common/cards/GameModule';
import {MilestoneName} from '@/common/ma/MilestoneName';
import {AwardName} from '@/common/ma/AwardName';
import {expansionIconClass} from '@/client/utils/expansionIcon';

/**
 * One milestone or award to offer, as the chooser passes it in through `items`. The template draws a checkbox for each,
 * and checking it puts its name in `selected`.
 *
 * T is either MilestoneName or AwardName: the chooser uses one checklist with each, so `selected` only
 * ever holds names of the right kind.
 */
type Goal = {
  name: T;
  /** The expansion it needs, if any. */
  expansion: Expansion | undefined;
};

const NUMBERED_NAME_REGEX = /^(.*\D)(\d+)$/;

const props = defineProps<{
  /** The list's title, such as "Milestones", shown above it with the count selected. Translated. */
  heading: string;
  items: ReadonlyArray<Goal>;
  /** How many may be selected. */
  limit: number;
  /** Text the shown items' labels contain. Empty shows them all. */
  filterText: string;
}>();

/** The names that are checked. Checking or unchecking a box emits the new list. */
const selected = defineModel<ReadonlyArray<T>>('selected', {required: true});

/** True when `limit` names are checked, so the unchecked boxes are disabled. */
const isFull = computed(() => selected.value.length >= props.limit);

/** The name without a trailing number, such as Tactician for Tactician4. */
function label(name: T): string {
  return NUMBERED_NAME_REGEX.exec(name)?.[1] ?? name;
}

/** The name's trailing number, if any. */
function number(name: T): string | undefined {
  return NUMBERED_NAME_REGEX.exec(name)?.[2];
}

/** Classes for the icon of an expansion. */
function iconClass(expansion: Expansion): string {
  return `create-game-expansion-icon ${expansionIconClass(expansion)}`;
}

function matchesFilter(goal: Goal): boolean {
  const filter = props.filterText.toLocaleUpperCase();
  return filter.length === 0 || label(goal.name).toLocaleUpperCase().includes(filter);
}
</script>

<style scoped lang="less">
.create-game-ma-heading {
  font-weight: bold;
  break-after: avoid;
}

.create-game-ma-item {
  break-inside: avoid;
}

// The popup sits inside .create-game-page-column, whose labels look like buttons. The popup's radios keep that look;
// these checkboxes get spectre's look back.
.create-game-ma-checklist label.form-checkbox,
.create-game-ma-checklist label.form-checkbox:hover {
  display: block;
  color: inherit;
  background-color: transparent;
  font-family: inherit;
  font-size: inherit;
  text-align: left;
  border-radius: 0;
  min-width: 0;
  height: auto;
  min-height: 1.4rem;
  line-height: 1.2rem;
  margin: .2rem 0;
  padding: .1rem .4rem .1rem 1.2rem;
  cursor: pointer;
}

// Keeps the expansion icon on the same line as the name.
.create-game-ma-name {
  white-space: nowrap;
}

// Fits the expansion icon within the line, so rows with an icon are no taller than the rest.
.create-game-ma-checklist .create-game-expansion-icon {
  width: 1.2rem;
  height: 1.2rem;
  background-size: 1.2rem 1.2rem;
  margin: 0 0 0 6px;
  vertical-align: top;
}
</style>
