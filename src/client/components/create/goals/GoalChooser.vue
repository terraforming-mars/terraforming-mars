<!-- Lets the player pick the game's milestones and awards by hand. -->
<template>
  <div class="create-game-ma-chooser">
    <div class="corporations-filter-toolbox-cont">
      <div class="corporations-filter-toolbox">
        <input class="filter" :placeholder="$t('filter')" v-model="filterText">
      </div>
    </div>
    <!-- As many columns as fit the width, scrolling down for the rest. Awards start a new column. -->
    <div class="create-game-ma-scroll">
      <div class="create-game-ma-lists">
        <GoalChecklist heading="Milestones" :items="offeredMilestones" :selected="selected.milestones" @update:selected="selected = {...selected, milestones: $event}" :limit="limit" :filterText="filterText" />
        <GoalChecklist class="create-game-ma-awards" heading="Awards" :items="offeredAwards" :selected="selected.awards" @update:selected="selected = {...selected, awards: $event}" :limit="limit" :filterText="filterText" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import GoalChecklist from './GoalChecklist.vue';
import {milestoneNames} from '@/common/ma/MilestoneName';
import {awardNames} from '@/common/ma/AwardName';
import {getAward, getMilestone} from '@/client/MilestoneAwardManifest';
import {SelectedGoals} from './types';

const props = defineProps<{
  /** How many milestones, and how many awards, a hand-picked selection needs. */
  limit: number,
}>();

const selected = defineModel<SelectedGoals>('selected', {required: true});

// Every milestone and award, whatever the game's expansions; the validation reports the ones that aren't in the game.
const offeredMilestones = milestoneNames.toSorted().map((name) => ({name, expansion: getMilestone(name).requirements}));
const offeredAwards = awardNames.toSorted().map((name) => ({name, expansion: getAward(name).requirements}));

const filterText = ref('');
</script>

<style scoped lang="less">
// Fills the space the popup gives it, so the lists can scroll inside it.
.create-game-ma-chooser {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
}

// Fills the rest of the chooser, and scrolls down when the lists are taller than that.
.create-game-ma-scroll {
  flex: 1 1 0;
  min-height: 0;
  margin-top: 8px;
  overflow: hidden auto;
}

// As many columns as fit the width, balanced. Its height isn't limited, so it never adds columns sideways.
.create-game-ma-lists {
  column-width: 200px;
  column-gap: 20px;
}

// Only when there's room for two columns. In a single column, the break would put the awards in a column to the
// side, off screen.
@media (min-width: 480px) {
  .create-game-ma-awards {
    break-before: column;
  }
}
</style>
