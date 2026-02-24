<template>
  <div class="card-content" :class="corporationClass">
    <CardRequirementsComponent v-if="requirements.length > 0" :requirements="requirements"/>
    <CardRenderData v-if="firstRow !== undefined" :renderData="firstRow" />
    <CardDescription v-if="isCorporation && hasDescription" :item="metadata.description"/>
    <CardRenderData v-if="remainingRows !== undefined" :renderData="remainingRows" />
    <CardDescription v-if="!isCorporation && hasDescription" :item="metadata.description"/>
    <div :class="'bottom-padding-' + bottomPadding" v-if="bottomPadding"></div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {CardMetadata} from '@/common/cards/CardMetadata';
import CardRequirementsComponent from './CardRequirementsComponent.vue';
import CardDescription from './CardDescription.vue';
import CardRenderData from './CardRenderData.vue';
import {CardRequirementDescriptor} from '@/common/cards/CardRequirementDescriptor';
import {ICardRenderRoot, isICardRenderRoot} from '@/common/cards/render/Types';

const props = defineProps<{
  metadata: CardMetadata;
  requirements: ReadonlyArray<CardRequirementDescriptor>;
  isCorporation: boolean;
  bottomPadding?: string;
}>();

const corporationClass = computed<string>(() => {
  return props.isCorporation ? 'card-content-corporation' : '';
});

const hasDescription = computed<boolean>(() => {
  const description = props.metadata.description;
  return description !== undefined && (typeof(description) !== 'string' || description.length > 0);
});

const firstRow = computed<ICardRenderRoot | undefined>(() => {
  if (isICardRenderRoot(props.metadata.renderData) && props.metadata.renderData.rows.length > 0) {
    return {
      is: 'root',
      rows: [props.metadata.renderData.rows[0]],
    };
  }
  return undefined;
});

const remainingRows = computed<ICardRenderRoot | undefined>(() => {
  if (isICardRenderRoot(props.metadata.renderData) && props.metadata.renderData.rows.length > 1) {
    return {
      is: 'root',
      rows: props.metadata.renderData.rows.slice(1),
    };
  }
  return undefined;
});
</script>
