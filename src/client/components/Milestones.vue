<template>
    <div class="milestones_cont" v-trim-whitespace>
        <div class="milestones">
            <div class="ma-title">
                <a class="ma-clickable" href="#" v-on:click.prevent="toggleList()" v-i18n>Milestones</a>
                <span v-for="milestone in milestones.filter((m) => m.playerName)" :key="milestone.name" class="milestone-award-inline paid" :title="milestone.playerName">
                    <span v-i18n>{{ milestone.name }}</span>
                    <span class="ma-player-cube"><i :class="'board-cube board-cube--'+milestone.playerColor" /></span>
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

<script lang="ts">

import Vue from 'vue';
import {MAX_MILESTONES, MILESTONE_COST} from '@/common/constants';
import Milestone from '@/client/components/Milestone.vue';
import {ClaimedMilestoneModel} from '@/common/models/ClaimedMilestoneModel';
import {Preferences, PreferencesManager} from '@/client/utils/PreferencesManager';

export default Vue.extend({
  name: 'Milestones',
  props: {
    milestones: {
      type: Array as () => Array<ClaimedMilestoneModel>,
    },
    showScores: {
      type: Boolean,
      default: true,
    },
    preferences: {
      type: Object as () => Readonly<Preferences>,
      default: () => PreferencesManager.INSTANCE.values(),
    },
  },
  data() {
    return {
      showMilestoneDetails: (this.milestones.filter((milestone) => milestone.playerName).length === MAX_MILESTONES ? false : this.preferences?.show_milestone_details),
      showDescription: false,
    };
  },
  components: {
    Milestone,
  },
  methods: {
    toggleDescription() {
      this.showDescription = !this.showDescription;
    },
    toggleList() {
      this.showMilestoneDetails = !this.showMilestoneDetails;
      PreferencesManager.INSTANCE.set('show_milestone_details', this.showMilestoneDetails);
    },
    getAvailableMilestoneSpots(): Array<number> {
      const count = this.milestones.filter((milestone) => milestone.playerName).length;
      return Array(MAX_MILESTONES - count).fill(MILESTONE_COST);
    },
    isLearnerModeOn(): boolean {
      return this.preferences.learner_mode;
    },
  },
});
</script>
