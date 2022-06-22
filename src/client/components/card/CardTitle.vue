<template>
  <div :class="getMainClasses()">
    <div v-if="isPrelude()" class="prelude-label">prelude</div>
    <div v-if="isCorporation()" class="corporation-label">corporation</div>
    <CardCorporationLogo v-if="isCorporation()" :title="title"/>
    <div v-else :class="getClasses(title)">{{ getCardTitleWithoutSuffix(title) }}</div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardType} from '@/common/cards/CardType';
import {translateText} from '@/client/directives/i18n';
import CardCorporationLogo from '@/client/components/card/CardCorporationLogo.vue';

export default Vue.extend({
  name: 'CardTitle',
  props: {
    title: {
      type: String,
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
  methods: {
    isCorporation(): boolean {
      return this.type === CardType.CORPORATION;
    },
    isPrelude(): boolean {
      return this.type === CardType.PRELUDE;
    },
    getClasses(title: string): string {
      const classes: Array<String> = ['card-title'];

      if (this.type === CardType.AUTOMATED) {
        classes.push('background-color-automated');
      } else if (this.type === CardType.ACTIVE) {
        classes.push('background-color-active');
      } else if (this.type === CardType.EVENT) {
        classes.push('background-color-events');
      } else if (this.type === CardType.PRELUDE) {
        classes.push('background-color-prelude');
      } else if (this.type === CardType.STANDARD_PROJECT || this.type === CardType.STANDARD_ACTION) {
        classes.push('background-color-standard-project');
      }

      const localeSpecificTitle = translateText(this.getCardTitleWithoutSuffix(title));

      if (localeSpecificTitle.length > 26) {
        classes.push('title-smaller');
      } else if (localeSpecificTitle.length > 23) {
        classes.push('title-small');
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
    getCardTitleWithoutSuffix(title: string): string {
      return title.split(':')[0];
    },
  },
});

</script>
