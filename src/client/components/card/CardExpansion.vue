<template>
  <div :class="getClasses()"></div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GameModule} from '@/common/cards/GameModule';

const MODULE_TO_CSS: Map<GameModule, string> = new Map([
  ['corpera', 'corporate-icon'],
  ['promo', 'promo-icon'],
  ['venus', 'venus-icon'],
  ['colonies', 'colonies-icon'],
  ['prelude', 'prelude-icon'],
  ['turmoil', 'turmoil-icon'],
  ['community', 'community-icon'],
  ['ares', 'ares-icon'],
  ['moon', 'moon-icon'],
  ['pathfinders', 'pathfinders-icon']],
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

