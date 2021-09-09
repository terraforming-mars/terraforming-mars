<template>
  <div class="awards_cont" v-trim-whitespace>
    <div class="awards">
      <div class="ma-title">
        <a
          @click.prevent="toggleList"
          class="ma-clickable awards-padding"
          href="#"
          v-i18n
          data-test="toggle-awards"
        >
          Awards
        </a>

        <span
          v-for="award in fundedAwards"
          :key="award.award.name"
          :title="award.player_name"
          class="milestone-award-inline paid"
          data-test="funded-awards"
        >
          <span v-i18n>{{ award.award.name }}</span>
          <span class="ma-player-cube">
            <i
              class="board-cube"
              :class="`board-cube--${award.player_color}`"
              :data-test-player-cube="award.player_color"
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

      <div v-show="showAwards">
        <Award
          v-for="award in awards"
          :key="award.award.name"
          :award="award"
          :showScores="showScores"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Award from '@/client/components/Award.vue';
import {AWARD_COSTS} from '@/constants';
import {FundedAwardModel} from '@/models/FundedAwardModel';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

export default Vue.extend({
  name: 'Awards',
  components: {Award},
  props: {
    awards: {
      type: Array as () => FundedAwardModel[],
      required: true,
    },
    showScores: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showAwards: true,
      PreferencesManager,
    };
  },
  methods: {
    toggleList() {
      this.showAwards = !this.showAwards;
    },
  },
  computed: {
    fundedAwards(): FundedAwardModel[] {
      const isFunded = (award: FundedAwardModel) => !!award.player_name;
      return this.awards.filter(isFunded);
    },
    availableAwardSpots(): Number[] {
      return AWARD_COSTS.slice(this.fundedAwards.length);
    },
    isLearnerModeOn(): boolean {
      return this.PreferencesManager.loadBoolean('learner_mode');
    },
  },
});
</script>
