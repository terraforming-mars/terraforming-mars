<template>
  <div class="card-title" :class="{'card-title-standard-project': isStandardProject, 'is-corporation': isCorporation}">
    <div v-if="isPrelude" class="prelude-label">prelude</div>
    <div v-if="isCorporation" class="corporation-label">corporation</div>
    <div v-if="isCeo" class="ceo-label">CEO</div>
    <CardCorporationLogo v-if="isCorporation" :title="title"/>
    <div v-else ref="title" class="card-title" :class="backgroundColorClass">{{ titleWithoutSuffix }}</div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {CardType} from '@/common/cards/CardType';
import CardCorporationLogo from '@/client/components/card/CardCorporationLogo.vue';
import {CardName} from '@/common/cards/CardName';
import {fitTextWhenReady} from '@/client/utils/textFit';

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
    // from its length. Corporations show a logo instead of a title element, so
    // nothing to fit.
    fitTitle(): void {
      if (this.isCorporation) {
        return;
      }
      fitTextWhenReady(this.typedRefs.title, 'card-title');
    },
  },
  computed: {
    backgroundColorClass(): string | undefined {
      switch (this.type) {
      case CardType.AUTOMATED:
        return 'background-color-automated';
      case CardType.ACTIVE:
        return 'background-color-active';
      case CardType.EVENT:
        return 'background-color-events';
      case CardType.PRELUDE:
        return 'background-color-prelude';
      case CardType.CEO:
        return 'background-color-ceo';
      case CardType.STANDARD_PROJECT:
      case CardType.STANDARD_ACTION:
        return 'background-color-standard-project';
      default:
        return undefined;
      }
    },
    titleWithoutSuffix(): string {
      return this.title.split(':')[0];
    },
    typedRefs(): Refs {
      return this.$refs as unknown as Refs;
    },
    isCeo(): boolean {
      return this.type === CardType.CEO;
    },
    isCorporation(): boolean {
      return this.type === CardType.CORPORATION;
    },
    isStandardProject(): boolean {
      return this.type === CardType.STANDARD_PROJECT || this.type === CardType.STANDARD_ACTION;
    },
    isPrelude(): boolean {
      return this.type === CardType.PRELUDE;
    },
  },
});

</script>
