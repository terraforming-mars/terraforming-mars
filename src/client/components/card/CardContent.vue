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

<script lang="ts">

import Vue from 'vue';
import {CardMetadata} from '@/common/cards/CardMetadata';
import CardRequirementsComponent from './CardRequirementsComponent.vue';
import CardDescription from './CardDescription.vue';
import CardRenderData from './CardRenderData.vue';
import {CardRequirementDescriptor} from '@/common/cards/CardRequirementDescriptor';
import {ICardRenderRoot, isICardRenderRoot} from '@/common/cards/render/Types';

export default Vue.extend({
  name: 'CardContent',
  props: {
    metadata: {
      type: Object as () => CardMetadata,
      required: true,
    },
    requirements: {
      type: Array<CardRequirementDescriptor>,
    },
    isCorporation: {
      type: Boolean,
      required: true,
    },
    bottomPadding: {
      type: String, // '', 'short', 'long'
    },
  },
  components: {
    CardRequirementsComponent,
    CardDescription,
    CardRenderData,
  },
  methods: {
  },
  computed: {
    corporationClass(): string {
      return this.isCorporation ? 'card-content-corporation' : '';
    },
    hasDescription(): boolean {
      const description = this.metadata.description;
      return description !== undefined && (typeof(description) !== 'string' || description.length > 0);
    },
    firstRow(): ICardRenderRoot | undefined {
      if (isICardRenderRoot(this.metadata.renderData) && this.metadata.renderData.rows.length > 0) {
        return {
          is: 'root',
          rows: [this.metadata.renderData.rows[0]],
        };
      }
      return undefined;
    },
    remainingRows(): ICardRenderRoot | undefined {
      if (isICardRenderRoot(this.metadata.renderData) && this.metadata.renderData.rows.length > 1) {
        return {
          is: 'root',
          rows: this.metadata.renderData.rows.slice(1),
        };
      }
      return undefined;
    },
  },
});

</script>

