<template>
  <div :class="getClasses()">
    <CardRequirementsComponent v-if="requirements" :requirements="requirements"/>
    <CardRenderData v-if="metadata.renderData" :renderData="metadata.renderData" />
    <CardDescription v-if="metadata.description" :item="metadata.description" />
    <CardVictoryPoints v-if="metadata.victoryPoints" :victoryPoints="metadata.victoryPoints" />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {ICardMetadata} from '@/common/cards/ICardMetadata';
import {ICardRequirements} from '@/common/cards/ICardRequirements';
import CardRequirementsComponent from './CardRequirementsComponent.vue';
import CardVictoryPoints from './CardVictoryPoints.vue';
import CardDescription from './CardDescription.vue';
import CardRenderData from './CardRenderData.vue';

export default Vue.extend({
  name: 'CardContent',
  props: {
    metadata: {
      type: Object as () => ICardMetadata,
      required: true,
    },
    requirements: {
      type: Object as () => ICardRequirements,
    },
    isCorporation: {
      type: Boolean,
      required: true,
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
});

</script>

