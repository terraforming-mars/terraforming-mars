<template>
  <div :class="templateClasses">
    <div :class="iconClasses(expansion)"></div>
    <div v-for="module in modules" :class="iconClasses(module)" :key="module"></div>
  </div>
</template>
<script lang="ts">

import Vue from 'vue';
import {Expansion, GameModule} from '@/common/cards/GameModule';

// TODO(kberg): replace corporate-icon with corpera-icon, and
// this can be replaced with a template string.
const MODULE_TO_CSS: Record<Expansion, string> = {
  corpera: 'corporate-icon',
  promo: 'promo-icon',
  venus: 'venus-icon',
  colonies: 'colonies-icon',
  prelude: 'prelude-icon',
  prelude2: 'prelude2-icon',
  turmoil: 'turmoil-icon',
  community: 'community-icon',
  ares: 'ares-icon',
  moon: 'moon-icon',
  pathfinders: 'pathfinders-icon',
  ceo: 'ceo-icon',
  starwars: 'starwars-icon',
  underworld: 'underworld-icon',
};

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
    iconClasses(module: GameModule): string {
      const classes = ['project-icon'];
      if (module !== 'base') {
        classes.push(MODULE_TO_CSS[module]);
      }
      return classes.join(' ');
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
