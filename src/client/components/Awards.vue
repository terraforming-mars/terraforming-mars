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
              :class="`board-cube--${award.color}`"
              :data-test-player-cube="award.color"
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

<script setup lang="ts">
import {ref, computed} from 'vue';
import Award from '@/client/components/Award.vue';
import {AWARD_COSTS} from '@/common/constants';
import {FundedAwardModel} from '@/common/models/FundedAwardModel';
import {Preferences, PreferencesManager} from '@/client/utils/PreferencesManager';

const props = withDefaults(defineProps<{
  awards: ReadonlyArray<FundedAwardModel>;
  showScores?: boolean;
  preferences?: Readonly<Preferences>;
}>(), {
  showScores: true,
  preferences: () => PreferencesManager.INSTANCE.values(),
});

const showAwardDetails = ref(props.preferences?.show_award_details);
const showDescription = ref(false);

function toggleList() {
  showAwardDetails.value = !showAwardDetails.value;
  PreferencesManager.INSTANCE.set('show_award_details', showAwardDetails.value);
}

function toggleDescription() {
  showDescription.value = !showDescription.value;
}

const fundedAwards = computed((): FundedAwardModel[] => {
  const isFunded = (award: FundedAwardModel) => !!award.playerName;
  return props.awards.filter(isFunded);
});

const availableAwardSpots = computed((): number[] => {
  return AWARD_COSTS.slice(fundedAwards.value.length);
});

const isLearnerModeOn = computed((): boolean => {
  return props.preferences.learner_mode;
});
</script>
