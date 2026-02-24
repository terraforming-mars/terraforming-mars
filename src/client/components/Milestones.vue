<template>
    <div class="milestones_cont" v-trim-whitespace>
        <div class="milestones">
            <div class="ma-title">
                <a class="ma-clickable" href="#" v-on:click.prevent="toggleList()" v-i18n>Milestones</a>
                <span v-for="milestone in milestones.filter((m) => m.playerName)" :key="milestone.name" class="milestone-award-inline paid" :title="milestone.playerName">
                    <span v-i18n>{{ milestone.name }}</span>
                    <span class="ma-player-cube"><i :class="'board-cube board-cube--'+milestone.color" /></span>
                </span>
                <span v-if="isLearnerModeOn()">
                    <span v-for="(spotPrice, index) in getAvailableMilestoneSpots()" :key="index" class="milestone-award-inline unpaid">
                        <div class="milestone-award-price">{{spotPrice}}</div>
                    </span>
                </span>
            </div>
            <span @click="toggleDescription" :title="$t('press to show or hide the description')" data-test="toggle-description">
              <div v-show="showMilestoneDetails">
                  <Milestone
                    v-for="milestone in milestones"
                    :key="milestone.name"
                    :milestone="milestone"
                    :showScores="showScores"
                    :showDescription="showDescription"
                  ></Milestone>
              </div>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {MAX_MILESTONES, MILESTONE_COST} from '@/common/constants';
import Milestone from '@/client/components/Milestone.vue';
import {ClaimedMilestoneModel} from '@/common/models/ClaimedMilestoneModel';
import {Preferences, PreferencesManager} from '@/client/utils/PreferencesManager';

const props = withDefaults(defineProps<{
  milestones: ReadonlyArray<ClaimedMilestoneModel>;
  showScores?: boolean;
  preferences?: Readonly<Preferences>;
}>(), {
  showScores: true,
  preferences: () => PreferencesManager.INSTANCE.values(),
});

const showMilestoneDetails = ref(
  props.milestones.filter((milestone) => milestone.playerName).length === MAX_MILESTONES ? false : props.preferences?.show_milestone_details,
);
const showDescription = ref(false);

function toggleDescription() {
  showDescription.value = !showDescription.value;
}

function toggleList() {
  showMilestoneDetails.value = !showMilestoneDetails.value;
  PreferencesManager.INSTANCE.set('show_milestone_details', showMilestoneDetails.value);
}

function getAvailableMilestoneSpots(): Array<number> {
  const count = props.milestones.filter((milestone) => milestone.playerName).length;
  return Array(MAX_MILESTONES - count).fill(MILESTONE_COST);
}

function isLearnerModeOn(): boolean {
  return props.preferences.learner_mode;
}
</script>
