<template>
  <div :class="getClasses()"></div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GameModule} from '@/common/cards/GameModule';

const MODULE_TO_CSS: Map<GameModule, string> = new Map([
  [GameModule.CorpEra, 'corporate-icon'],
  [GameModule.Promo, 'promo-icon'],
  [GameModule.Venus, 'venus-icon'],
  [GameModule.Colonies, 'colonies-icon'],
  [GameModule.Prelude, 'prelude-icon'],
  [GameModule.Turmoil, 'turmoil-icon'],
  [GameModule.Community, 'community-icon'],
  [GameModule.Ares, 'ares-icon'],
  [GameModule.Moon, 'moon-icon'],
  [GameModule.Pathfinders, 'pathfinders-icon']],
);
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
  },
  methods: {
    getClasses(): string {
      const classes = ['card-expansion', 'project-icon'];
      const expansionClass = MODULE_TO_CSS.get(this.expansion);
      if (expansionClass !== undefined) {
        classes.push(expansionClass);
      }
      if (this.isCorporation) {
        classes.push('card-corporation-expansion');
      }

      return classes.join(' ');
    },
  },
});

</script>

