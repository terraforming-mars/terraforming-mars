<template>
  <div :class="[getMainClasses(), { 'is-corporation': isCorporation() }]">
    <div v-if="isPrelude()" class="prelude-label">prelude</div>
    <div v-if="isCorporation()" class="corporation-label">corporation</div>
    <div v-if="isCeo()" class="ceo-label">CEO</div>
    <CardCorporationLogo v-if="isCorporation()" :title="props.title"/>
    <div v-else :class="getClasses(props.title)">{{ getCardTitleWithoutSuffix(props.title) }}</div>
  </div>
</template>

<script setup lang="ts">
import {CardType} from '@/common/cards/CardType';
import {translateText} from '@/client/directives/i18n';
import CardCorporationLogo from '@/client/components/card/CardCorporationLogo.vue';
import {CardName} from '@/common/cards/CardName';

const props = defineProps<{
  title: CardName;
  type: CardType;
}>();

function isCeo(): boolean {
  return props.type === CardType.CEO;
}

function isCorporation(): boolean {
  return props.type === CardType.CORPORATION;
}

function isPrelude(): boolean {
  return props.type === CardType.PRELUDE;
}

function getClasses(title: string): string {
  const classes: Array<String> = ['card-title'];

  if (props.type === CardType.AUTOMATED) {
    classes.push('background-color-automated');
  } else if (props.type === CardType.ACTIVE) {
    classes.push('background-color-active');
  } else if (props.type === CardType.EVENT) {
    classes.push('background-color-events');
  } else if (props.type === CardType.PRELUDE) {
    classes.push('background-color-prelude');
  } else if (props.type === CardType.CEO) {
    classes.push('background-color-ceo');
  } else if (props.type === CardType.STANDARD_PROJECT || props.type === CardType.STANDARD_ACTION) {
    classes.push('background-color-standard-project');
  }

  const localeSpecificTitle = translateText(getCardTitleWithoutSuffix(title));

  if (localeSpecificTitle.length > 26) {
    classes.push('title-smaller');
  } else if (localeSpecificTitle.length > 23) {
    classes.push('title-small');
  }

  return classes.join(' ');
}

function getMainClasses() {
  const classes: Array<String> = ['card-title'];
  if (props.type === CardType.STANDARD_PROJECT || props.type === CardType.STANDARD_ACTION) {
    classes.push('card-title-standard-project');
  }
  return classes.join(' ');
}

function getCardTitleWithoutSuffix(title: string): string {
  return title.split(':')[0];
}
</script>
