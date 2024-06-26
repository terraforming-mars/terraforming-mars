<template>
  <div :class="getClasses()">
    <CardRequirementsComponent v-if="requirements.length > 0" :requirements="requirements"/>
    <CardRenderData v-if="metadata.renderData" :renderData="metadata.renderData" />
    <CardDescription v-if="hasDescription" :item="metadata.description" />
    <CardVictoryPoints v-if="metadata.victoryPoints" :victoryPoints="metadata.victoryPoints" />
    <div class="padBottom" v-if="padBottom" style="padding-bottom: 22px;"></div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardMetadata} from '@/common/cards/CardMetadata';
import CardRequirementsComponent from './CardRequirementsComponent.vue';
import CardVictoryPoints from './CardVictoryPoints.vue';
import CardDescription from './CardDescription.vue';
import CardRenderData from './CardRenderData.vue';
import {CardRequirementDescriptor} from '@/common/cards/CardRequirementDescriptor';

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
    padBottom: {
      type: Boolean,
    },
  },
  components: {
    CardRequirementsComponent,
    CardVictoryPoints,
    CardDescription,
    CardRenderData,
  },
  methods: {
    getClasses(): string {
      const classes: Array<string> = ['card-content'];
      if (this.isCorporation) {
        classes.push('card-content-corporation');
      }
      return classes.join(' ');
    },
  },
  computed: {
    hasDescription(): boolean {
      const description = this.metadata.description;
      return description !== undefined && (typeof(description) !== 'string' || description.length > 0);
    },
  },
});

</script>

