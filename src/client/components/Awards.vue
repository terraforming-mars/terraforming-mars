<template>
  <div class="awards_cont" v-trim-whitespace>
    <div class="awards">
      <div class="ma-title">
        <a @click.prevent="toggleList" class="ma-clickable awards-padding" href="#" data-test="toggle-awards" v-i18n>Awards</a>
        <span
          v-for="award in fundedAwards"
          :key="award.name"
          :title="award.playerName"
          class="milestone-award-inline paid"
          data-test="funded-awards"
        >
          <span v-i18n>{{ award.name }}</span>
          <span class="ma-player-cube">
            <i
              class="board-cube"
              :class="`board-cube--${award.playerColor}`"
              :data-test-player-cube="award.playerColor"
            />
          </span>
        </span>

        <span v-if="isLearnerModeOn">
          <span
            v-for="spotPrice in availableAwardSpots"
            :key="spotPrice"
            class="milestone-award-inline unpaid"
          >
            <div class="milestone-award-price" data-test="spot-price" v-text="spotPrice" />
          </span>
        </span>
      </div>

      <span @click="toggleDescription" :title="$t('press to show or hide the description')" data-test="toggle-description">
        <div v-show="showAwardDetails">
          <Award
            v-for="award in awards"
            :key="award.name"
            :award="award"
            :showScores="showScores"
            :showDescription="showDescription"
          />
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Award from '@/client/components/Award.vue';
import {AWARD_COSTS} from '@/common/constants';
import {FundedAwardModel} from '@/common/models/FundedAwardModel';
import {Preferences, PreferencesManager} from '@/client/utils/PreferencesManager';

export default Vue.extend({
  name: 'Awards',
  components: {Award},
  props: {
    awards: {
      type: Array as () => Array<FundedAwardModel>,
      required: true,
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
      showAwardDetails: this.preferences?.show_award_details,
      showDescription: false,
    };
  },
  methods: {
    toggleList() {
      this.showAwardDetails = !this.showAwardDetails;
      PreferencesManager.INSTANCE.set('show_award_details', this.showAwardDetails);
    },
    toggleDescription() {
      this.showDescription = !this.showDescription;
    },

  },
  computed: {
    fundedAwards(): FundedAwardModel[] {
      const isFunded = (award: FundedAwardModel) => !!award.playerName;
      return this.awards.filter(isFunded);
    },
    availableAwardSpots(): Number[] {
      return AWARD_COSTS.slice(this.fundedAwards.length);
    },
    isLearnerModeOn(): boolean {
      return this.preferences.learner_mode;
    },
  },
});
</script>
