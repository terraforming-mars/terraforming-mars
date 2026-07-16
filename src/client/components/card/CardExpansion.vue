<template>
  <div :class="templateClasses">
    <div class="project-icon" :class="iconClass(expansion)"></div>
    <div v-for="module in modules" class="project-icon" :class="module + '-icon'" :key="module"></div>
  </div>
</template>
<script lang="ts">

import Vue from 'vue';
import {GameModule} from '@/common/cards/GameModule';

export default Vue.extend({
  name: 'CardExpansion',
  props: {
    expansion: {
      type: String as () => GameModule,
      required: true,
    },
    isCorporation: {
      type: Boolean,
      required: true,
    },
    isResourceCard: {
      type: Boolean,
      required: true,
    },
    compatibility: {
      type: Array<GameModule>,
      required: false,
    },
  },
  methods: {
    iconClass(module: GameModule): string {
      return module === 'base' ? '' : module + '-icon';
    },
  },
  computed: {
    modules(): ReadonlyArray<GameModule> {
      return this.compatibility.filter((e) => e !== this.expansion);
    },
    templateClasses(): string {
      if (this.isCorporation) {
        return 'card-corporation-expansion';
      } else {
        if (this.isResourceCard) {
          return 'resource-card-icon-expansion-container';
        } else {
          return 'project-icon-expansion-container';
        }
      }
    },
  },
});

</script>
