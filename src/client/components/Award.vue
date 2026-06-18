<template>
  <div class="ma-block">
    <div class="ma-player" v-if="award.playerName">
      <i :title="award.playerName" class="board-cube" :class="`board-cube--${award.color}`" ></i>
    </div>

    <div class="ma-name ma-name--awards award-block" :class="nameCss">
      <span ref="name" v-i18n>{{ award.name }}</span>
      <div v-if="showScores" class="ma-scores player_home_block--milestones-and-awards-scores">
        <template v-for="score in sortedScores" :key="score.color">
          <p
            v-if="playerSymbol(score.color).length > 0"
            class="ma-score"
            :class="`player_bg_color_${score.color}`"
            v-text="playerSymbol(score.color)"
            data-test="player-score"
          ></p>
          <p
            class="ma-score"
            :class="`player_bg_color_${score.color}`"
            v-text="score.score"
            data-test="player-score"
          ></p>
      </template>
      </div>
    </div>

    <div v-if="showDescription" class="ma-description">
      <span v-i18n>{{ description }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {FundedAwardModel, AwardScore} from '@/common/models/FundedAwardModel';
import {getAward} from '@/client/MilestoneAwardManifest';
import {playerSymbol} from '@/client/utils/playerSymbol';
import {Color} from '@/common/Color';
import {fitText} from '@/client/utils/textFit';
import {getPreferences} from '@/client/utils/PreferencesManager';

type Refs = {
  name: HTMLElement | undefined;
};

export default defineComponent({
  name: 'Award',
  props: {
    award: {
      type: Object as () => FundedAwardModel,
      required: true,
    },
    showScores: {
      type: Boolean,
      default: true,
    },
    showDescription: {
      type: Boolean,
    },
  },
  mounted() {
    this.fitName();
  },
  watch: {
    'award.name'() {
      this.fitName();
    },
  },
  methods: {
    playerSymbol(color: Color) {
      return playerSymbol(color);
    },
    // Size the name to fit its medal box by measuring the rendered text rather
    // than guessing from its length. Waits for the font to load so the
    // measurement uses real glyph widths. Only when the experimental UI is on;
    // otherwise the language_hacks ma-name overrides handle sizing.
    fitName(): void {
      if (!getPreferences().experimental_ui) {
        return;
      }
      const el = this.typedRefs.name;
      if (el === undefined) {
        return;
      }
      // document.fonts is unavailable outside a real browser (e.g. JSDOM tests).
      if (document.fonts === undefined) {
        fitText(el, 'award-name');
        return;
      }
      document.fonts.ready.then(() => fitText(el, 'award-name'));
    },
  },
  computed: {
    typedRefs(): Refs {
      return this.$refs as unknown as Refs;
    },
    nameCss(): string {
      return 'ma-name--' + this.award.name.replaceAll(' ', '-').replaceAll('.', '').toLowerCase();
    },
    sortedScores(): Array<AwardScore> {
      return [...this.award.scores].sort((s1, s2) => s2.score - s1.score);
    },
    description(): string {
      return getAward(this.award.name).description;
    },
  },
});
</script>
