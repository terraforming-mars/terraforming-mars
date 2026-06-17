<template>
  <div :class="[getMainClasses(), { 'is-corporation': isCorporation() }]">
    <div v-if="isPrelude()" class="prelude-label">prelude</div>
    <div v-if="isCorporation()" class="corporation-label">corporation</div>
    <div v-if="isCeo()" class="ceo-label">CEO</div>
    <CardCorporationLogo v-if="isCorporation()" :title="title"/>
    <div v-else ref="title" :class="getClasses()">{{ titleWithoutSuffix }}</div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {CardType} from '@/common/cards/CardType';
import {translateText} from '@/client/directives/i18n';
import CardCorporationLogo from '@/client/components/card/CardCorporationLogo.vue';
import {CardName} from '@/common/cards/CardName';
import {fitTitle} from '@/client/components/card/titleFit';
import {getPreferences} from '@/client/utils/PreferencesManager';

type Refs = {
  // Only rendered for non-corporation cards (corporations show a logo instead).
  title: HTMLElement | undefined;
};

export default defineComponent({
  name: 'CardTitle',
  props: {
    title: {
      type: String as () => CardName,
      required: true,
    },
    type: {
      type: String as () => CardType,
      required: true,
    },
  },
  components: {
    CardCorporationLogo,
  },
  mounted() {
    this.fitTitle();
  },
  watch: {
    // Re-fit if the title prop changes on a reused instance. Card lists are keyed
    // by name today, so this is insurance against an unkeyed or index-keyed list.
    title() {
      this.fitTitle();
    },
  },
  methods: {
    // Size the title to fit by measuring the rendered text rather than guessing
    // from its length. Waits for the card font to load so the measurement uses
    // real glyph widths. Only when the experimental UI is on; otherwise the
    // length-based classes and language_hacks title overrides handle sizing.
    fitTitle(): void {
      if (!getPreferences().experimental_ui || this.isCorporation()) {
        return;
      }
      const el = this.typedRefs.title;
      if (el === undefined) {
        return;
      }
      // document.fonts is unavailable outside a real browser (e.g. JSDOM tests).
      if (document.fonts === undefined) {
        fitTitle(el);
        return;
      }
      document.fonts.ready.then(() => fitTitle(el));
    },
    isCeo(): boolean {
      return this.type === CardType.CEO;
    },
    isCorporation(): boolean {
      return this.type === CardType.CORPORATION;
    },
    isPrelude(): boolean {
      return this.type === CardType.PRELUDE;
    },
    getClasses(): string {
      const classes: Array<String> = ['card-title'];

      if (this.type === CardType.AUTOMATED) {
        classes.push('background-color-automated');
      } else if (this.type === CardType.ACTIVE) {
        classes.push('background-color-active');
      } else if (this.type === CardType.EVENT) {
        classes.push('background-color-events');
      } else if (this.type === CardType.PRELUDE) {
        classes.push('background-color-prelude');
      } else if (this.type === CardType.CEO) {
        classes.push('background-color-ceo');
      } else if (this.type === CardType.STANDARD_PROJECT || this.type === CardType.STANDARD_ACTION) {
        classes.push('background-color-standard-project');
      }

      // With the experimental UI on, the title is sized by measuring the
      // rendered text (see fitTitle). Otherwise fall back to a length-based size
      // class (these carry !important, so they'd override the measured size).
      if (!getPreferences().experimental_ui) {
        const localeSpecificTitle = translateText(this.titleWithoutSuffix);

        if (localeSpecificTitle.length > 29) {
          classes.push('title-smallest');
        } else if (localeSpecificTitle.length > 26) {
          classes.push('title-smaller');
        } else if (localeSpecificTitle.length > 23) {
          classes.push('title-small');
        }
      }

      return classes.join(' ');
    },
    getMainClasses() {
      const classes: Array<String> = ['card-title'];
      if (this.type === CardType.STANDARD_PROJECT || this.type === CardType.STANDARD_ACTION) {
        classes.push('card-title-standard-project');
      }
      return classes.join(' ');
    },
  },
  computed: {
    titleWithoutSuffix(): string {
      return this.title.split(':')[0];
    },
    typedRefs(): Refs {
      return this.$refs as unknown as Refs;
    },
  },
});

</script>
